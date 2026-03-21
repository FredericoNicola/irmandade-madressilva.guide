import { Router, Response } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import {
  listEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/entryController";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import supabase from "../lib/supabase";

const router = Router();
const BUCKET = "entry-photos";

// Keep files in memory — no disk writes, upload directly to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/", listEntries);
router.get("/:id", getEntry);
router.post("/", authenticateToken, createEntry);
router.put("/:id", authenticateToken, updateEntry);
router.delete("/:id", authenticateToken, deleteEntry);

router.post(
  "/:id/photos",
  authenticateToken,
  upload.array("photos", 10),
  async (req: AuthRequest, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }

    try {
      const entry = await prisma.entry.findUnique({
        where: { id: req.params.id },
      });
      if (!entry) {
        res.status(404).json({ message: "Entry not found" });
        return;
      }

      // Only the entry owner or an admin may upload photos
      if (entry.userId !== req.user!.id && req.user!.role !== "ADMIN") {
        res.status(403).json({ message: "Not allowed" });
        return;
      }

      const photos = await Promise.all(
        files.map(async (file) => {
          const ext = path.extname(file.originalname).toLowerCase();
          const storagePath = `photos/${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;

          const { error } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, file.buffer, {
              contentType: file.mimetype,
              upsert: false,
            });

          if (error) throw new Error(`Storage upload failed: ${error.message}`);

          const { data: urlData } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(storagePath);

          return prisma.photo.create({
            data: {
              url: urlData.publicUrl,
              entryId: req.params.id,
            },
          });
        }),
      );

      res.status(201).json(photos);
    } catch (err) {
      console.error("Photo upload error:", err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
