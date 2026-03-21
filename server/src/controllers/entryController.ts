import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const MAX_NAME = 200;
const MAX_LOCATION = 300;
const MAX_DESCRIPTION = 5000;
const VALID_PRICES = ["€", "€€", "€€€"];

export async function listEntries(_req: Request, res: Response): Promise<void> {
  try {
    const entries = await prisma.entry.findMany({
      include: {
        photos: true,
        createdBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(entries);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getEntry(req: Request, res: Response): Promise<void> {
  try {
    const entry = await prisma.entry.findUnique({
      where: { id: req.params.id },
      include: {
        photos: true,
        createdBy: { select: { id: true, name: true } },
      },
    });

    if (!entry) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    res.json(entry);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createEntry(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { name, location, latitude, longitude, medianPrice, description } =
    req.body;

  if (!name || !location || !medianPrice || !description) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  if (typeof name !== "string" || name.length > MAX_NAME) {
    res
      .status(400)
      .json({ message: `Name must be at most ${MAX_NAME} characters` });
    return;
  }
  if (typeof location !== "string" || location.length > MAX_LOCATION) {
    res
      .status(400)
      .json({ message: `Location must be at most ${MAX_LOCATION} characters` });
    return;
  }
  if (typeof description !== "string" || description.length > MAX_DESCRIPTION) {
    res
      .status(400)
      .json({
        message: `Description must be at most ${MAX_DESCRIPTION} characters`,
      });
    return;
  }
  if (!VALID_PRICES.includes(medianPrice)) {
    res.status(400).json({ message: "Invalid price range" });
    return;
  }

  const lat = latitude ? parseFloat(latitude) : null;
  const lng = longitude ? parseFloat(longitude) : null;
  if (lat !== null && (lat < -90 || lat > 90)) {
    res.status(400).json({ message: "Latitude must be between -90 and 90" });
    return;
  }
  if (lng !== null && (lng < -180 || lng > 180)) {
    res.status(400).json({ message: "Longitude must be between -180 and 180" });
    return;
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        name: name.trim(),
        location: location.trim(),
        latitude: lat,
        longitude: lng,
        medianPrice,
        description: description.trim(),
        userId: req.user!.id,
      },
      include: { photos: true },
    });
    res.status(201).json(entry);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateEntry(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  const { name, location, latitude, longitude, medianPrice, description } =
    req.body;

  try {
    const existing = await prisma.entry.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    // Only the entry owner or an admin may update
    if (existing.userId !== req.user!.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ message: "Not allowed" });
      return;
    }

    if (
      name !== undefined &&
      (typeof name !== "string" || name.length > MAX_NAME)
    ) {
      res
        .status(400)
        .json({ message: `Name must be at most ${MAX_NAME} characters` });
      return;
    }
    if (
      location !== undefined &&
      (typeof location !== "string" || location.length > MAX_LOCATION)
    ) {
      res
        .status(400)
        .json({
          message: `Location must be at most ${MAX_LOCATION} characters`,
        });
      return;
    }
    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > MAX_DESCRIPTION)
    ) {
      res
        .status(400)
        .json({
          message: `Description must be at most ${MAX_DESCRIPTION} characters`,
        });
      return;
    }
    if (medianPrice !== undefined && !VALID_PRICES.includes(medianPrice)) {
      res.status(400).json({ message: "Invalid price range" });
      return;
    }

    const lat =
      latitude !== undefined
        ? latitude
          ? parseFloat(latitude)
          : null
        : existing.latitude;
    const lng =
      longitude !== undefined
        ? longitude
          ? parseFloat(longitude)
          : null
        : existing.longitude;
    if (lat !== null && (lat < -90 || lat > 90)) {
      res.status(400).json({ message: "Latitude must be between -90 and 90" });
      return;
    }
    if (lng !== null && (lng < -180 || lng > 180)) {
      res
        .status(400)
        .json({ message: "Longitude must be between -180 and 180" });
      return;
    }

    const entry = await prisma.entry.update({
      where: { id: req.params.id },
      data: {
        name: name?.trim(),
        location: location?.trim(),
        latitude: lat,
        longitude: lng,
        medianPrice,
        description: description?.trim(),
      },
      include: { photos: true },
    });
    res.json(entry);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteEntry(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    const existing = await prisma.entry.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ message: "Entry not found" });
      return;
    }

    // Only the entry owner or an admin may delete
    if (existing.userId !== req.user!.id && req.user!.role !== "ADMIN") {
      res.status(403).json({ message: "Not allowed" });
      return;
    }

    await prisma.entry.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
