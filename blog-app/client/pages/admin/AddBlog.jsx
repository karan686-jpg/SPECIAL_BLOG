import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Save,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import "quill/dist/quill.snow.css";
import AIAssistantDrawer from "../../src/components/AIAssistantDrawer";
import CategorySelector from "../../src/components/CategorySelector";
import DraftRecoveryBanner from "../../src/components/editor/DraftRecoveryBanner";
import CoverImageUploader from "../../src/components/editor/CoverImageUploader";
import PublishScheduler from "../../src/components/editor/PublishScheduler";

const DRAFT_STORAGE_KEY = "blog_author_draft";

const AddBlog = () => {
  const { axios, fetchBlogs } = useContext(AppContext);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Lifestyle");
  const [description, setDescription] = useState("");

  // Publishing & Scheduling state
  // "publish" | "draft" | "schedule"
  const [publishMode, setPublishMode] = useState("publish");
  const [scheduledDate, setScheduledDate] = useState("");

  // Local Draft Auto-Save State
  const [autoSaveStatus, setAutoSaveStatus] = useState(null);
  const [hasExistingDraft, setHasExistingDraft] = useState(null);

  const fileInputRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Initialize Quill editor after mount with strict duplicate toolbar cleanup
  useEffect(() => {
    let isCancelled = false;

    if (editorRef.current) {
      // Clean up any previously injected duplicate toolbars from container
      const container = editorRef.current.parentElement;
      if (container) {
        const existingToolbars = container.querySelectorAll(".ql-toolbar");
        existingToolbars.forEach((tb) => tb.remove());
      }
      editorRef.current.innerHTML = "";

      import("quill").then((QuillModule) => {
        if (isCancelled || !editorRef.current) return;
        const Quill = QuillModule.default;
        const qInstance = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Write your masterpiece here...",
        });
        quillRef.current = qInstance;

        if (description) {
          qInstance.root.innerHTML = description;
        }

        qInstance.on("text-change", () => {
          setDescription(qInstance.root.innerHTML);
        });
      });
    }

    return () => {
      isCancelled = true;
      if (editorRef.current?.parentElement) {
        const toolbars =
          editorRef.current.parentElement.querySelectorAll(".ql-toolbar");
        toolbars.forEach((tb) => tb.remove());
      }
      quillRef.current = null;
    };
  }, []);

  // Check for unsaved local draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.title || parsed.description || parsed.subTitle) {
          setHasExistingDraft(parsed);
        }
      }
    } catch (e) {
      console.error("Error reading draft", e);
    }
  }, []);

  // Debounced Auto-Save to LocalStorage (800ms)
  useEffect(() => {
    if (!title && !description && !subTitle) return undefined;

    const timer = setTimeout(() => {
      const currentDesc = quillRef.current
        ? quillRef.current.root.innerHTML
        : description;
      const draft = {
        title,
        subTitle,
        category,
        description: currentDesc,
        savedAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setAutoSaveStatus(`Auto-saved at ${draft.savedAt}`);
      } catch (e) {
        console.error("Failed to auto-save draft", e);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, subTitle, category, description]);

  const restoreDraft = () => {
    if (!hasExistingDraft) return;
    setTitle(hasExistingDraft.title || "");
    setSubTitle(hasExistingDraft.subTitle || "");
    setCategory(hasExistingDraft.category || "Lifestyle");
    setDescription(hasExistingDraft.description || "");
    if (quillRef.current) {
      quillRef.current.root.innerHTML = hasExistingDraft.description || "";
    }
    toast.success("Unsaved draft restored successfully!");
    setHasExistingDraft(null);
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setHasExistingDraft(null);
    setAutoSaveStatus(null);
    toast("Draft discarded");
  };

  const generateDraft = async (e) => {
    e.preventDefault();
    if (!title) {
      toast.error("Please enter a blog title to generate content.");
      return;
    }
    try {
      setIsGeneratingDraft(true);
      toast("AI drafting content...");
      const response = await axios.post("/api/blog/generate-ai-content", {
        prompt: title,
      });
      if (response.data.success) {
        toast.success("Draft created!");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = response.data.content;
          setDescription(response.data.content);
        }
      } else {
        toast.error(response.data.message || "Failed to generate draft");
      }
    } catch (error) {
      console.error("Draft Error:", error);
      toast.error("An error occurred drafting content");
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    if (publishMode === "schedule") {
      if (!scheduledDate) {
        toast.error("Please select a date and time for scheduled publishing.");
        return;
      }
      const selected = new Date(scheduledDate);
      if (selected <= new Date()) {
        toast.error("Scheduled time must be in the future.");
        return;
      }
    }

    try {
      setIsAdding(true);
      const blogData = {
        title,
        subtitle: subTitle,
        description: quillRef.current
          ? quillRef.current.root.innerHTML
          : description,
        category,
        isPublished: publishMode !== "draft",
        scheduledFor:
          publishMode === "schedule" ? new Date(scheduledDate).toISOString() : null,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blogData));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);
      if (data.success) {
        toast.success(
          publishMode === "schedule"
            ? "Story scheduled successfully!"
            : data.message
        );
        // Clear local backup draft
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // ignore
        }
        await fetchBlogs();
        if (quillRef.current) quillRef.current.root.innerHTML = "";
        setTitle("");
        setSubTitle("");
        setDescription("");
        setImage(null);
        setCategory("Lifestyle");
        setPublishMode("publish");
        setScheduledDate("");
        navigate("/");
      } else {
        toast.error(data.message || "Error adding blog");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding blog");
    } finally {
      setIsAdding(false);
    }
  };

  // Min date for scheduler: 5 minutes from now in YYYY-MM-DDTHH:mm
  const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const wordCount = description
    ? description
        .replace(/<[^>]*>/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="w-full">
      {/* Studio Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            📖 {readTime} min read • {wordCount} words
          </span>
          {autoSaveStatus && (
            <span className="flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{autoSaveStatus}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Assistant</span>
          </button>
          <button
            onClick={generateDraft}
            disabled={isGeneratingDraft}
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
            type="button"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGeneratingDraft ? "Drafting..." : "Auto-Draft"}</span>
          </button>
        </div>
      </div>

      {/* 🛡️ Crash Protection Restore Banner */}
      <DraftRecoveryBanner
        draft={hasExistingDraft}
        onRestore={restoreDraft}
        onDiscard={discardDraft}
      />

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
        {/* Notion-Style Cover Image Zone */}
        <CoverImageUploader
          image={image}
          onImageChange={onImageChange}
          onRemoveImage={() => setImage(null)}
          fileInputRef={fileInputRef}
        />

        {/* Medium-Grade Borderless Headline */}
        <div>
          <input
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full text-3xl sm:text-5xl font-editorial font-bold bg-transparent border-none outline-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 text-gray-900 dark:text-gray-50 transition leading-tight"
            placeholder="Title..."
            required
          />
        </div>

        {/* Medium-Grade Borderless Subtitle */}
        <div>
          <input
            name="subTitle"
            onChange={(e) => setSubTitle(e.target.value)}
            value={subTitle}
            className="w-full text-lg sm:text-xl font-sans text-gray-500 dark:text-gray-400 bg-transparent border-none outline-none focus:outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 transition"
            placeholder="Tell your story or write a brief teaser..."
          />
        </div>

        <hr className="border-gray-100 dark:border-gray-800 my-1" />

        {/* Description Editor (Clean Unified Card - No Gaudy Neon Buttons) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Story Content
            </label>
            <span className="text-[11px] text-gray-400">
              Rich editorial formatting enabled
            </span>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-[#090d16] transition-all shadow-xs focus-within:border-purple-500/80 focus-within:ring-2 focus-within:ring-purple-500/10">
            <div ref={editorRef} />
          </div>
        </div>

        {/* Dynamic & Customizable Category Selector */}
        <CategorySelector
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
        />

        {/* 🕒 Publishing Options & Scheduler */}
        <PublishScheduler
          publishMode={publishMode}
          setPublishMode={setPublishMode}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          minDateTime={minDateTime}
        />

        {/* Submit Button */}
        <button
          disabled={isAdding}
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-8 rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>
            {isAdding
              ? "Saving..."
              : publishMode === "schedule"
                ? "Schedule Story"
                : publishMode === "draft"
                  ? "Save as Draft"
                  : "Publish Story Now"}
          </span>
        </button>
      </form>

      {/* ✨ AI Blog Writing Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        title={title}
        content={description}
        onApplyTitle={(newTitle) => setTitle(newTitle)}
        onApplySubtitle={(newSub) => setSubTitle(newSub)}
        onApplyContent={(newHtml) => {
          if (quillRef.current) {
            quillRef.current.root.innerHTML = newHtml;
          }
          setDescription(newHtml);
        }}
        onInsertSummary={(summaryHtml) => {
          if (quillRef.current) {
            const current = quillRef.current.root.innerHTML;
            const updated = `${summaryHtml}<br/>${current}`;
            quillRef.current.root.innerHTML = updated;
            setDescription(updated);
          }
        }}
      />
    </div>
  );
};

export default AddBlog;
