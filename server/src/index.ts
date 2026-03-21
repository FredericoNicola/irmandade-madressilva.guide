import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import entryRoutes from "./routes/entries";
import userRoutes from "./routes/users";
import photoRoutes from "./routes/uploads";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "db.uxuehhcztsomerexomxb.supabase.co",
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/entries", generalLimiter, entryRoutes);
app.use("/api/users", generalLimiter, userRoutes);
app.use("/api/photos", generalLimiter, photoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
