import React, { useState } from "react";
import { History, X, RotateCcw, Clock, CheckCircle2, BookmarkPlus } from "lucide-react";
import { toast } from "react-hot-toast";

const VersionHistoryModal = ({
  isOpen,
  onClose,
  versions = [],
  onSaveSnapshot,
  onRestoreVersion,
  currentUser,
}) => {
  const [newVersionName, setNewVersionName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(versions[0] || null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;

    onSaveSnapshot(newVersionName.trim());
    setNewVersionName("");
    toast.success("Named version saved to history!");
  };

  const handleRestore = (ver) => {
    if (
      window.confirm(
        `Are you sure you want to restore "${ver.name}"? Current document content will be updated for all collaborators.`
      )
    ) {
      onRestoreVersion(ver);
      toast.success(`Restored "${ver.name}"!`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Version History & Snapshots
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Inspect revision points or restore previous drafts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 overflow-hidden">
          {/* Version List (Left 2 cols) */}
          <div className="md:col-span-2 border-r border-gray-200 dark:border-gray-800 p-4 overflow-y-auto flex flex-col justify-between">
            <div>
              <form onSubmit={handleSave} className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Name Current State
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    placeholder="e.g. Pre-review draft"
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-purple-600"
                  />
                  <button
                    type="submit"
                    disabled={!newVersionName.trim()}
                    className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-lg transition"
                    title="Save Snapshot"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Saved Checkpoints ({versions.length})
              </span>

              <div className="space-y-2">
                {versions.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    No snapshots recorded yet. Auto-snapshots are generated periodically.
                  </p>
                ) : (
                  versions.map((ver) => (
                    <div
                      key={ver.id}
                      onClick={() => setSelectedVersion(ver)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        selectedVersion?.id === ver.id
                          ? "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40"
                          : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                          {ver.name}
                        </span>
                        {ver.isCurrent && (
                          <span className="text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>{ver.timestamp}</span>
                        <span>•</span>
                        <span>{ver.author}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Preview & Restore Panel (Right 3 cols) */}
          <div className="md:col-span-3 p-5 overflow-y-auto flex flex-col justify-between bg-gray-50/50 dark:bg-gray-950/50">
            {selectedVersion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {selectedVersion.name}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Authored by {selectedVersion.author} at{" "}
                      {selectedVersion.timestamp}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(selectedVersion)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore This Version</span>
                  </button>
                </div>

                {/* HTML/Text Preview Container */}
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 min-h-[220px] max-h-[360px] overflow-y-auto text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-serif">
                  {selectedVersion.html ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedVersion.html }}
                    />
                  ) : (
                    <p className="text-gray-400 italic">Empty snapshot content</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-xs">
                Select a version on the left to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryModal;
