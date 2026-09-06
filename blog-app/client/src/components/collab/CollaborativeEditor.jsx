import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useUpdateMyPresence } from "./liveblocks.config";
import EditorToolbar from "./EditorToolbar";

const CollaborativeEditor = ({
  currentUser,
  onEditorReady,
  onContentChange,
}) => {
  const room = useRoom();
  const updateMyPresence = useUpdateMyPresence();
  const [provider, setProvider] = useState(null);
  const [doc, setDoc] = useState(null);
  const typingTimerRef = useRef(null);

  // Set up Yjs document and Liveblocks provider
  useEffect(() => {
    let yDoc = null;
    let yProvider = null;
    try {
      yDoc = new Y.Doc();
      if (room) {
        yProvider = new LiveblocksYjsProvider(room, yDoc);
      }
      setDoc(yDoc);
      setProvider(yProvider);
    } catch (err) {
      console.warn("Liveblocks provider initialization failed, using local document:", err);
      if (!doc) setDoc(new Y.Doc());
    }

    return () => {
      try {
        if (yDoc) yDoc.destroy();
        if (yProvider) yProvider.destroy();
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
    };
  }, [room]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          // History must be handled by Yjs, so disable StarterKit's built-in history
          history: false,
        }),
        Placeholder.configure({
          placeholder:
            "Write your collaborative masterpiece together... Press Tab to indent, format using the toolbar above.",
          emptyEditorClass: "is-editor-empty",
        }),
        ...(doc && provider
          ? [
              Collaboration.configure({
                document: doc,
              }),
              CollaborationCursor.configure({
                provider: provider,
                user: {
                  name: currentUser?.name || "Author",
                  color: currentUser?.color || "#8B5CF6",
                },
              }),
            ]
          : []),
      ],
      editable: currentUser?.role !== "viewer",
      onUpdate: ({ editor: ed }) => {
        // Broadcast typing indicator
        updateMyPresence({ isTyping: true });
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(() => {
          updateMyPresence({ isTyping: false });
        }, 1200);

        if (onContentChange) {
          onContentChange(ed.getHTML());
        }
      },
      editorProps: {
        attributes: {
          class:
            "prose dark:prose-invert prose-lg max-w-none focus:outline-none min-h-[500px] py-4 text-gray-800 dark:text-gray-100 font-serif leading-relaxed",
        },
      },
    },
    [doc, provider]
  );

  // Update cursor user details and editability when currentUser state changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(currentUser?.role !== "viewer");
    }
    if (provider?.awareness && currentUser) {
      provider.awareness.setLocalStateField("user", {
        name: currentUser.name,
        color: currentUser.color,
      });
    }
  }, [currentUser, editor, provider]);

  const onEditorReadyRef = useRef(onEditorReady);
  useEffect(() => {
    onEditorReadyRef.current = onEditorReady;
  }, [onEditorReady]);

  useEffect(() => {
    if (editor && onEditorReadyRef.current) {
      onEditorReadyRef.current(editor);
    }
  }, [editor]);

  return (
    <div className="w-full flex flex-col">
      {/* Sticky TipTap Toolbar */}
      <EditorToolbar editor={editor} userRole={currentUser?.role} />

      {/* Editor Canvas */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 py-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default CollaborativeEditor;
