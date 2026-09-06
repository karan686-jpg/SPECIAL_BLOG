import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import blogRouter from "./routes/blogRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import discussionRouter from "./routes/discussionRoutes.js";
import { liveblocksAuth } from "./controllers/liveblocksController.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map((origin) => origin.trim());

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error("Origin not allowed")), methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));
const sensitiveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });
app.use("/api/admin/login", sensitiveLimiter);
app.use("/api/user/login", sensitiveLimiter);
app.use("/api/user/register", sensitiveLimiter);
app.use("/api/blog/generate-ai-content", sensitiveLimiter);

app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);
app.use("/api/discussions", discussionRouter);
app.post("/api/liveblocks/auth", liveblocksAuth);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("/{*splat}", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
} else {
  app.get("/", (_req, res) => res.json({ success: true, message: "Blogify API is running" }));
}

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) return res.status(400).json({ success: false, message: "Invalid image upload" });
  return res.status(500).json({ success: false, message: "Unexpected server error" });
});

const port = process.env.PORT || 3000;
connectDB().then(() => app.listen(port, () => console.log(`Server running on port ${port}`))).catch((error) => { console.error("Unable to start server", error.message); process.exit(1); });
