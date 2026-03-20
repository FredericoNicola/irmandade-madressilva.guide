import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export async function listEntries(_req: Request, res: Response): Promise<void> {
  try {
    const entries = await prisma.entry.findMany({
      include: { photos: true, createdBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(entries);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getEntry(req: Request, res: Response): Promise<void> {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id: req.params.id },
      include: { photos: true, createdBy: { select: { id: true, name: true } } },
    });

    if (!entry) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    res.json(entry);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function createEntry(req: AuthRequest, res: Response): Promise<void> {
  const { name, location, latitude, longitude, medianPrice, description } = req.body;

  if (!name || !location || !medianPrice || !description) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        name,
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        medianPrice,
        description,
        userId: req.user!.id,
      },
      include: { photos: true },
    });
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function updateEntry(req: AuthRequest, res: Response): Promise<void> {
  const { name, location, latitude, longitude, medianPrice, description } = req.body;

  try {
    const existing = await prisma.entry.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    const entry = await prisma.entry.update({
      where: { id: req.params.id },
      data: {
        name,
        location,
        latitude: latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : existing.latitude,
        longitude: longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : existing.longitude,
        medianPrice,
        description,
      },
      include: { photos: true },
    });
    res.json(entry);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteEntry(req: AuthRequest, res: Response): Promise<void> {
  try {
    const existing = await prisma.entry.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ message: 'Entry not found' });
      return;
    }

    await prisma.entry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
}
