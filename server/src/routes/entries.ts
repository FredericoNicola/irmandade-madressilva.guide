import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  listEntries,
  getEntry,
  createEntry,
  updateEntry,
  deleteEntry,
} from '../controllers/entryController';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/', listEntries);
router.get('/:id', getEntry);
router.post('/', authenticateToken, createEntry);
router.put('/:id', authenticateToken, updateEntry);
router.delete('/:id', authenticateToken, deleteEntry);

router.post(
  '/:id/photos',
  authenticateToken,
  upload.array('photos', 10),
  async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return;
    }

    try {
      const entry = await prisma.entry.findUnique({ where: { id: req.params.id } });
      if (!entry) {
        res.status(404).json({ message: 'Entry not found' });
        return;
      }

      const photos = await Promise.all(
        files.map((file) =>
          prisma.photo.create({
            data: {
              url: `/uploads/${file.filename}`,
              entryId: req.params.id,
            },
          })
        )
      );

      res.status(201).json(photos);
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
