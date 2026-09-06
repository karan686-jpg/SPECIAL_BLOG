import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Vibrant colors for multiplayer collaborative cursors and avatars
export const COLLAB_PALETTE = [
  { name: "Violet", hex: "#8B5CF6", bg: "bg-purple-500", light: "bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800" },
  { name: "Sky", hex: "#0284C7", bg: "bg-sky-500", light: "bg-sky-50 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300 border-sky-300 dark:border-sky-800" },
  { name: "Emerald", hex: "#10B981", bg: "bg-emerald-500", light: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800" },
  { name: "Amber", hex: "#F59E0B", bg: "bg-amber-500", light: "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800" },
  { name: "Rose", hex: "#F43F5E", bg: "bg-rose-500", light: "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300 dark:border-rose-800" },
  { name: "Cyan", hex: "#06B6D4", bg: "bg-cyan-500", light: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800" },
  { name: "Indigo", hex: "#6366F1", bg: "bg-indigo-500", light: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800" },
  { name: "Coral", hex: "#F97316", bg: "bg-orange-500", light: "bg-orange-50 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300 dark:border-orange-800" },
];

const PUBLIC_API_KEY =
  import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY ||
  "pk_dev_gbm6G79HQWM5MJ0d6E4aIIUO-tABCNwS5cnZIqJzucvgQn79jQ_NV_R72v7y4BAU";

export const client = createClient({
  publicApiKey: PUBLIC_API_KEY,
});

export const {
  RoomProvider,
  useRoom,
  useStatus,
  useSelf,
  useOthers,
  useMyPresence,
  useUpdateMyPresence,
  useStorage,
  useMutation,
  useBroadcastEvent,
  useEventListener,
} = createRoomContext(client);
