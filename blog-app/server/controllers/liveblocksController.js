import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY,
});

// Vibrant, pleasant cursor colors for multiplayer collaborators
const COLLAB_COLORS = [
  "#8B5CF6", // Purple
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
];

/**
 * Authorizes a user session with Liveblocks for a specific room.
 * Assigns user identity, cursor color, avatar, and permission level (Owner, Editor, Viewer).
 */
export const liveblocksAuth = async (req, res) => {
  try {
    const { room, role = "editor", userName, avatar, color } = req.body;

    if (!room) {
      return res.status(400).json({ error: "Missing room ID" });
    }

    // Assign a unique user ID and avatar if not logged in
    const randomSeed = Math.random().toString(36).substring(2, 9);
    const resolvedName = userName?.trim() || `Author-${randomSeed.slice(0, 4)}`;
    const resolvedColor =
      color || COLLAB_COLORS[Math.floor(Math.random() * COLLAB_COLORS.length)];
    const resolvedAvatar =
      avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(resolvedName)}`;

    const userId = req.user?._id?.toString() || `collab_${randomSeed}`;

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: resolvedName,
        avatar: resolvedAvatar,
        color: resolvedColor,
        role: role, // 'owner' | 'editor' | 'viewer'
      },
    });

    // Enforce role-based access control in Liveblocks
    if (role === "viewer") {
      session.allow(room, session.READ_ACCESS);
    } else {
      session.allow(room, session.FULL_ACCESS);
    }

    const { status, body } = await session.authorize();
    return res.status(status).end(body);
  } catch (error) {
    console.error("Liveblocks Auth Error:", error);
    return res.status(500).json({ error: "Liveblocks authorization failed" });
  }
};
