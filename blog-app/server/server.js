import "dotenv/config"; // This is a special command that loads variables IMMEDIATELY
import express from "express";
// ... then the rest of your imports

import cors from "cors";
import connectDB from "./config/db.js";
// import adminAuthRoutes from './routes/adminAuth.js'
import blogRouter from "./routes/blogRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// app.use('/api/admin',adminAuthRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Serve frontend files in production
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Api is working");
  });
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running");
});
