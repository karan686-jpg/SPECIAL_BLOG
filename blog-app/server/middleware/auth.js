import jwt from "jsonwebtoken";

const readToken = (req) => {
  const header = req.headers.authorization?.trim() || "";
  return header.replace(/^Bearer\s+/i, "").trim();
};

const attachIdentity = (req) => {
  const token = readToken(req);
  if (!token) return false;

  const decoded = jwt.verify(token, process.env.JWT_SECRET, {
    issuer: "blogify-api",
    audience: "blogify-client",
  });

  req.auth = decoded;
  req.user = decoded.sub || null;
  return true;
};

export const optionalAuth = (req, _res, next) => {
  try {
    attachIdentity(req);
  } catch {
    // A public endpoint remains public; protected endpoints use requireAuth.
  }
  next();
};

export const requireAuth = (req, res, next) => {
  try {
    if (!attachIdentity(req)) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

export const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.auth.role !== "admin") {
      return res.status(403).json({ success: false, message: "Administrator access required" });
    }
    next();
  });
};

export default requireAuth;
