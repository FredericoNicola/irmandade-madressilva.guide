import { Router, Response } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";
import supabase from "../lib/supabase";

const router = Router();
const BUCKET = "entry-photos";
const BUCKET_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const photo = await prisma.photo.findUnique({
        where: { id: req.params.id },
      });
      if (!photo) {
        res.status(404).json({ message: "Photo not found" });
        return;
      }

      // Extract storage path from the full Supabase public URL
      const idx = photo.url.indexOf(BUCKET_PREFIX);
      if (idx !== -1) {
        const storagePath = photo.url.slice(idx + BUCKET_PREFIX.length);
        await supabase.storage.from(BUCKET).remove([storagePath]);
      }

      await prisma.photo.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  },
);

export default router;
