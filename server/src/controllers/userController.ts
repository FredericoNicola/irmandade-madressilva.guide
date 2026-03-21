import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_ROLES = ["ADMIN", "USER"];
const MIN_PASSWORD = 8;

export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { email, name, password, role } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ message: "Email, name, and password are required" });
    return;
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }
  if (typeof name !== "string" || name.length > 100) {
    res.status(400).json({ message: "Name must be at most 100 characters" });
    return;
  }
  if (typeof password !== "string" || password.length < MIN_PASSWORD) {
    res
      .status(400)
      .json({
        message: `Password must be at least ${MIN_PASSWORD} characters`,
      });
    return;
  }
  if (role && !VALID_ROLES.includes(role)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        password: hashedPassword,
        role: role || "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.status(201).json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body;

  if (
    email !== undefined &&
    (typeof email !== "string" || !EMAIL_RE.test(email))
  ) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }
  if (name !== undefined && (typeof name !== "string" || name.length > 100)) {
    res.status(400).json({ message: "Name must be at most 100 characters" });
    return;
  }
  if (
    password !== undefined &&
    (typeof password !== "string" || password.length < MIN_PASSWORD)
  ) {
    res
      .status(400)
      .json({
        message: `Password must be at least ${MIN_PASSWORD} characters`,
      });
    return;
  }
  if (role !== undefined && !VALID_ROLES.includes(role)) {
    res.status(400).json({ message: "Invalid role" });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const data: Record<string, unknown> = {};
    if (name) data.name = name.trim();
    if (email) data.email = email.trim().toLowerCase();
    if (role) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}

export async function deleteUser(
  req: AuthRequest,
  res: Response,
): Promise<void> {
  try {
    // Prevent admin from deleting themselves
    if (req.user!.id === req.params.id) {
      res.status(400).json({ message: "Cannot delete your own account" });
      return;
    }

    const existing = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!existing) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
