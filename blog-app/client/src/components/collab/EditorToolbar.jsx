import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Terminal,
  Lock,
} from "lucide-react";

const EditorToolbar = ({ editor, userRole = "editor" }) => {
  if (!editor) return null;

  const isViewer = userRole === "viewer";

  const buttonClass = (isActive) =>
    `p-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center cursor-pointer ${
      isActive
        ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold shadow-xs"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
    } ${isViewer ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`;

  return (
    <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-1 p-2 bg-white/95 dark:bg-[#0f131f]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs transition-colors">
      <div className="flex flex-wrap items-center gap-1">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => {
            if (typeof editor.chain().focus().undo === "function") {
              editor.chain().focus().undo().run();
            }
          }}
          disabled={
            isViewer ||
            (typeof editor.can?.()?.undo === "function" ? !editor.can().undo() : false)
          }
          className={buttonClass(false)}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            if (typeof editor.chain().focus().redo === "function") {
              editor.chain().focus().redo().run();
            }
          }}
          disabled={
            isViewer ||
            (typeof editor.can?.()?.redo === "function" ? !editor.can().redo() : false)
          }
          className={buttonClass(false)}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

        {/* Inline formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={buttonClass(editor.isActive("code"))}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

        {/* Lists & Blocks */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={buttonClass(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          <Terminal className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={buttonClass(false)}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {isViewer && (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-semibold">
          <Lock className="w-3.5 h-3.5" />
          <span>View Only Mode (Read & Comment)</span>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
