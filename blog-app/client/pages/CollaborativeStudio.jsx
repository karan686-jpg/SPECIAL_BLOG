import React, { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import {
  RoomProvider,
  useOthers,
  useSelf,
  useStatus,
  COLLAB_PALETTE,
} from "../src/components/collab/liveblocks.config";
import CollaborativeEditor from "../src/components/collab/CollaborativeEditor";
import StudioHeader from "../src/components/collab/StudioHeader";
import TypingIndicator from "../src/components/collab/TypingIndicator";
import InviteCollaboratorsModal from "../src/components/collab/InviteCollaboratorsModal";
import CollabCommentsPanel from "../src/components/collab/CollabCommentsPanel";
import VersionHistoryModal from "../src/components/collab/VersionHistoryModal";
import ActivityFeedDrawer from "../src/components/collab/ActivityFeedDrawer";
import CategorySelector from "../src/components/CategorySelector";

// Inner room component rendered inside RoomProvider
const CollabStudioInner = ({ roomId, initialRole }) => {
  const navigate = useNavigate();
  const { axios, fetchBlogs, user: authUser, theme, toggleTheme } = useContext(AppContext);

  // Editor and Story Metadata state
  const [editorInstance, setEditorInstance] = useState(null);

  const handleEditorReady = useCallback((editor) => {
    setEditorInstance(editor);
  }, []);

  const [storyTitle, setStoryTitle] = useState("Collaborative Masterpiece");
  const [storySubtitle, setStorySubtitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState("Technology");
  const [isPublishing, setIsPublishing] = useState(false);

  // Modals & Panels State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Collaboration Comments & Activity state
  const [comments, setComments] = useState([]);
  const [activities, setActivities] = useState([
    {
      id: "act_init",
      author: "System",
      action: "initialized collaborative room",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "join",
    },
  ]);

  // Version Snapshots state
  const [versions, setVersions] = useState([
    {
      id: "v_init",
      name: "Initial Canvas",
      author: authUser?.name || "System",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      html: "<p>Welcome to your collaborative workspace!</p>",
      isCurrent: true,
    },
  ]);

  // Collaborator identity
  const [currentUser, setCurrentUser] = useState(() => {
    const randomSeed = Math.random().toString(36).substring(2, 7);
    const randomPal =
      COLLAB_PALETTE[Math.floor(Math.random() * COLLAB_PALETTE.length)];
    const stored = localStorage.getItem("collab_identity");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          role: initialRole || parsed.role || "editor",
        };
      } catch {
        // fallback
      }
    }
    return {
      id: authUser?._id || `user_${randomSeed}`,
      name: authUser?.name || `Writer-${randomSeed.slice(0, 4)}`,
      avatar:
        authUser?.avatar ||
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(
          authUser?.name || randomSeed
        )}`,
      color: randomPal.hex,
      role: initialRole || "editor",
    };
  });

  const fileInputRef = useRef(null);

  // Sync identity to localStorage
  useEffect(() => {
    localStorage.setItem("collab_identity", JSON.stringify(currentUser));
  }, [currentUser]);

  // Log activity helper
  const addActivity = (action, type = "edit", author = currentUser.name) => {
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        author,
        action,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type,
      },
      ...prev,
    ]);
  };

  // Add Comment handler
  const handleAddComment = (comment) => {
    setComments((prev) => [comment, ...prev]);
    addActivity(`added a discussion note: "${comment.text.slice(0, 25)}..."`, "comment");
    toast.success("Comment posted to room!");
  };

  const handleReplyComment = (commentId, reply) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : c
      )
    );
    addActivity("replied to a discussion thread", "comment");
  };

  const handleToggleResolve = (commentId) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const next = !c.resolved;
          addActivity(
            next ? "resolved a comment thread" : "reopened a comment thread",
            "comment"
          );
          return { ...c, resolved: next };
        }
        return c;
      })
    );
  };

  // Snapshot handler
  const handleSaveSnapshot = (name) => {
    if (!editorInstance) return;
    const html = editorInstance.getHTML();
    const newVer = {
      id: `ver_${Date.now()}`,
      name,
      author: currentUser.name,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      html,
      isCurrent: false,
    };
    setVersions((prev) => [newVer, ...prev]);
    addActivity(`saved version checkpoint "${name}"`, "snapshot");
  };

  // Restore snapshot handler
  const handleRestoreVersion = (ver) => {
    if (!editorInstance || !ver.html) return;
    editorInstance.commands.setContent(ver.html);
    addActivity(`restored document to version "${ver.name}"`, "snapshot");
  };

  // Publish collaborative document to Blogify feed
  const handlePublish = async () => {
    if (!editorInstance) return;

    if (!storyTitle.trim()) {
      toast.error("Please provide an article title before publishing.");
      return;
    }

    if (!coverImage) {
      toast.error("Please attach a cover image before publishing.");
      return;
    }

    const htmlContent = editorInstance.getHTML();
    if (!htmlContent || htmlContent === "<p></p>") {
      toast.error("Story content cannot be empty.");
      return;
    }

    try {
      setIsPublishing(true);
      toast("Publishing collaborative story to Blogify...");

      const blogData = {
        title: storyTitle,
        subtitle: storySubtitle,
        description: htmlContent,
        category,
        isPublished: true,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blogData));
      formData.append("image", coverImage);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success("Story successfully published to live feed!");
        addActivity("published story to Blogify live feed", "publish");
        await fetchBlogs();
        navigate("/");
      } else {
        toast.error(data.message || "Failed to publish story");
      }
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Error publishing story");
    } finally {
      setIsPublishing(false);
    }
  };

  const isViewer = currentUser.role === "viewer";
  const unresolvedCommentsCount = comments.filter((c) => !c.resolved).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors flex flex-col selection:bg-purple-200 dark:selection:bg-purple-900/60">
      {/* 🚀 Top Navigation & Collaboration Bar */}
      <StudioHeader
        currentUser={currentUser}
        isViewer={isViewer}
        isPublishing={isPublishing}
        handlePublish={handlePublish}
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        isCommentsOpen={isCommentsOpen}
        setIsCommentsOpen={setIsCommentsOpen}
        unresolvedCommentsCount={unresolvedCommentsCount}
        isHistoryOpen={isHistoryOpen}
        setIsHistoryOpen={setIsHistoryOpen}
        isActivityOpen={isActivityOpen}
        setIsActivityOpen={setIsActivityOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* 📄 Distraction-Free Collaborative Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* Notion-Style Cover Image */}
        <div className="mb-8">
          {coverImage ? (
            <div className="relative group/img w-full h-56 sm:h-72 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Story cover"
                className="w-full h-full object-cover rounded-2xl"
              />
              {!isViewer && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-3.5 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-lg shadow-md hover:bg-gray-100 transition"
                  >
                    Change cover
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="px-3.5 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            !isViewer && (
              <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl py-6 px-4 transition-all bg-gray-50/50 dark:bg-gray-900/30 flex flex-col items-center justify-center text-center group"
              >
                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1.5" />
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  + Add cover image
                </p>
              </div>
            )
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setCoverImage(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Dynamic & Customizable Category Selector */}
        <div className="mb-6">
          <CategorySelector
            selectedCategory={category}
            onSelectCategory={(cat) => setCategory(cat)}
            disabled={isViewer}
          />
        </div>

        {/* Borderless Large Headline */}
        <div className="mb-3">
          <input
            type="text"
            value={storyTitle}
            disabled={isViewer}
            onChange={(e) => {
              setStoryTitle(e.target.value);
            }}
            placeholder="Title..."
            className="w-full text-3xl sm:text-5xl font-editorial font-bold bg-transparent border-none outline-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-gray-50 transition leading-tight"
          />
        </div>

        {/* Borderless Subtitle */}
        <div className="mb-6">
          <input
            type="text"
            value={storySubtitle}
            disabled={isViewer}
            onChange={(e) => setStorySubtitle(e.target.value)}
            placeholder="Add an enticing subtitle or hook..."
            className="w-full text-lg sm:text-xl font-sans text-gray-500 dark:text-gray-400 bg-transparent border-none outline-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 transition"
          />
        </div>

        <hr className="border-gray-200 dark:border-gray-800 mb-4" />

        {/* 🖊️ TipTap Real-time Collaborative Rich Text Editor */}
        <CollaborativeEditor
          currentUser={currentUser}
          onEditorReady={handleEditorReady}
          onContentChange={(_html) => {
            // content changed
          }}
        />
      </main>

      {/* Floating Typing Indicator */}
      <TypingIndicator />

      {/* Invite Collaborators Modal */}
      <InviteCollaboratorsModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        currentUser={currentUser}
        onUpdateCurrentUser={(updated) => setCurrentUser(updated)}
        activeCollaborators={[{ ...currentUser, isSelf: true }]}
      />

      {/* Comments Sidebar Panel */}
      <CollabCommentsPanel
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        currentUser={currentUser}
        comments={comments}
        onAddComment={handleAddComment}
        onReplyComment={handleReplyComment}
        onToggleResolve={handleToggleResolve}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versions}
        onSaveSnapshot={handleSaveSnapshot}
        onRestoreVersion={handleRestoreVersion}
        currentUser={currentUser}
      />

      {/* Activity Feed Drawer */}
      <ActivityFeedDrawer
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        activities={activities}
      />
    </div>
  );
};

// Root Page that wraps RoomProvider around the studio
export default function CollaborativeStudio() {
  const { roomId: paramRoomId } = useParams();
  const [searchParams] = useSearchParams();
  const resolvedRoomId = paramRoomId || "blogify-collab-master";
  const roleParam = searchParams.get("role") || "editor";

  return (
    <RoomProvider
      id={resolvedRoomId}
      initialPresence={{
        isTyping: false,
        name: "Collaborator",
        color: "#8B5CF6",
        role: roleParam,
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=collab",
      }}
    >
      <CollabStudioInner roomId={resolvedRoomId} initialRole={roleParam} />
    </RoomProvider>
  );
}
