import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const issueToken = (user) => jwt.sign(
  { role: user.role }, process.env.JWT_SECRET,
  { subject: user._id.toString(), expiresIn: "2h", issuer: "blogify-api", audience: "blogify-client" },
);
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, role: user.role });

export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password, profileImage } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
    if (name.length > 80 || password.length < 8 || password.length > 128) return res.status(400).json({ success: false, message: "Use a name up to 80 characters and a password of 8–128 characters" });
    if (await User.exists({ email })) return res.status(409).json({ success: false, message: "Email is already registered" });

    const newUser = await User.create({ name, email, password: await bcrypt.hash(password, 12), profileImage: typeof profileImage === "string" ? profileImage : undefined });
    return res.status(201).json({ success: true, token: issueToken(newUser), user: publicUser(newUser), message: "Registered successfully" });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "Email is already registered" });
    return res.status(500).json({ success: false, message: "Unable to register account" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const isHashedPassword = user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$");
    const passwordMatches = isHashedPassword ? await bcrypt.compare(password, user.password) : password === user.password;
    if (!passwordMatches) return res.status(401).json({ success: false, message: "Invalid email or password" });
    if (!isHashedPassword) {
      user.password = await bcrypt.hash(password, 12);
      await user.save();
    }
    return res.json({ success: true, token: issueToken(user), user: publicUser(user) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to log in" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (req.auth.role === "admin") return res.json({ success: true, user: { id: "admin", role: "admin", name: "Admin", email: process.env.ADMIN_EMAIL } });
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user: publicUser(user) });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to load profile" });
  }
};
