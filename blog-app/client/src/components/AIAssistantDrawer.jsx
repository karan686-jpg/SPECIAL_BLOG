import React, { useState, useContext } from "react";
import {
  Sparkles,
  X,
  Heading,
  CheckCheck,
  BookOpen,
  FileText,
  Search,
  Tag,
  ShieldAlert,
  Loader2,
  Copy,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const TABS = [
  { id: "titles", label: "Title Ideas", icon: Heading, desc: "Generate catchy, high-CTR blog titles" },
  { id: "grammar", label: "Grammar Check", icon: CheckCheck, desc: "Detect & fix grammar, typos, and phrasing" },
  { id: "readability", label: "Readability", icon: BookOpen, desc: "Polish article flow, tone, and clarity" },
  { id: "summarize", label: "TL;DR Summary", icon: FileText, desc: "Create an executive summary & key takeaways" },
  { id: "seo", label: "SEO Meta", icon: Search, desc: "Craft 160-char meta description & focus keywords" },
  { id: "tags", label: "Suggest Tags", icon: Tag, desc: "Discover trending tags and topic classifications" },
  { id: "duplicate", label: "Duplicate Check", icon: ShieldAlert, desc: "Analyze similarity vs existing articles" },
];

const AIAssistantDrawer = ({
  isOpen,
  onClose,
  title,
  content,
  onApplyTitle,
  onApplySubtitle,
  onApplyContent,
  onInsertSummary,
}) => {
  const { axios } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("titles");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const runAssistantAction = async (action) => {
    // Check if content has enough text
    const cleanText = (content || "").replace(/<[^>]*>?/gm, " ").trim();
    if (cleanText.length < 8) {
      toast.error("Please write at least a sentence in the blog editor first!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/blog/ai-assist", {
        action,
        title,
        text: content,
      });

      if (data.success) {
        setResults((prev) => ({
          ...prev,
          [action]: action === "readability" ? data.content : data.data,
        }));
        toast.success("AI generated successfully!");
      } else {
        toast.error(data.message || "Failed to generate AI suggestions.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const currentResult = results[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs transition-opacity duration-300">
      <div className="w-full max-w-xl h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col transition-all">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                AI Writing Assistant
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800">
                  Gemini 2.0
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enhance, optimize, and polish your draft in real-time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation list */}
        <div className="flex items-center gap-1.5 p-2 px-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-none bg-gray-50/50 dark:bg-gray-950/50">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Description & Run Action Bar */}
        <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border-b border-purple-100/50 dark:border-purple-900/20 flex items-center justify-between gap-3">
          <p className="text-xs text-purple-900/80 dark:text-purple-300 font-medium">
            {TABS.find((t) => t.id === activeTab)?.desc}
          </p>
          <button
            onClick={() => runAssistantAction(activeTab)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentResult ? "Re-generate" : "Generate"}</span>
              </>
            )}
          </button>
        </div>

        {/* Content & Results Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {!currentResult && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 mb-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">
                Ready to assist with {TABS.find((t) => t.id === activeTab)?.label}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                Click the Generate button above to let AI analyze your blog content.
              </p>
              <button
                onClick={() => runAssistantAction(activeTab)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                Analyze Now
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-purple-200 dark:border-purple-900 border-t-purple-600 rounded-full animate-spin"></div>
                <Sparkles className="w-4 h-4 text-purple-600 absolute inset-0 m-auto" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                Gemini is crafting suggestions for your blog...
              </p>
            </div>
          )}

          {/* 1. Title Suggestions Result */}
          {activeTab === "titles" && currentResult && Array.isArray(currentResult) && (
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Click any title to apply it to your article:
              </p>
              {currentResult.map((t, idx) => (
                <div
                  key={idx}
                  className="group p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-500 bg-white dark:bg-gray-800/60 hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">
                    {t}
                  </p>
                  <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(t, `title-${idx}`)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Copy"
                    >
                      {copiedIndex === `title-${idx}` ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        onApplyTitle(t);
                        toast.success("Applied to Title!");
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-all"
                    >
                      Apply <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. Grammar Suggestions Result */}
          {activeTab === "grammar" && currentResult && (
            <div className="space-y-3">
              {Array.isArray(currentResult) && currentResult.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                  <CheckCheck className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-green-900 dark:text-green-300">
                    Flawless Grammar!
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    No grammar, typo, or phrasing issues detected in your draft.
                  </p>
                </div>
              ) : (
                Array.isArray(currentResult) &&
                currentResult.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="line-through text-red-500 font-medium px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/50">
                        {item.original}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-green-600 dark:text-green-400 font-semibold px-2 py-0.5 rounded bg-green-50 dark:bg-green-950/50">
                        {item.suggestion}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {item.explanation}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 3. Readability & Polish Result */}
          {activeTab === "readability" && currentResult && typeof currentResult === "string" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-purple-900 dark:text-purple-300">
                    Polished Article Draft
                  </h5>
                  <p className="text-xs text-purple-700 dark:text-purple-400">
                    Enhanced flow, better transitions, and engaging tone.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onApplyContent(currentResult);
                    toast.success("Editor updated with polished content!");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
                >
                  Apply to Editor
                </button>
              </div>

              <div
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-sm prose dark:prose-invert max-w-none max-h-80 overflow-y-auto text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: currentResult }}
              />
            </div>
          )}

          {/* 4. Summarize (TL;DR) Result */}
          {activeTab === "summarize" && currentResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Executive Summary (TL;DR)
                  </span>
                  <button
                    onClick={() => {
                      const summaryHtml = `<blockquote><strong>TL;DR:</strong> ${currentResult.tldr}</blockquote>`;
                      onInsertSummary(summaryHtml);
                      toast.success("Summary inserted into top of article!");
                    }}
                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Insert in Blog Intro
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {currentResult.tldr}
                </p>

                {currentResult.keyTakeaways && (
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 space-y-1.5">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
                      Key Takeaways:
                    </span>
                    <ul className="list-disc list-inside text-xs text-gray-700 dark:text-gray-300 space-y-1">
                      {currentResult.keyTakeaways.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. SEO Description & Keywords Result */}
          {activeTab === "seo" && currentResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Meta Description ({currentResult.metaDescription?.length || 0} chars)
                  </span>
                  <button
                    onClick={() => {
                      onApplySubtitle(currentResult.metaDescription);
                      toast.success("Applied to Subtitle!");
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Apply as Subtitle
                  </button>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800 font-sans">
                  {currentResult.metaDescription}
                </p>

                {currentResult.focusKeywords && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-1.5">
                      Focus Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.focusKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-100 dark:border-purple-900/40"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentResult.seoTip && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200/50 dark:border-amber-900/30">
                    💡 <strong>Tip:</strong> {currentResult.seoTip}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 6. Suggest Tags Result */}
          {activeTab === "tags" && currentResult && Array.isArray(currentResult) && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Recommended Tag Categories:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentResult.map((tagItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all hover:bg-purple-100"
                  >
                    <span>#{tagItem}</span>
                    <button
                      onClick={() => copyToClipboard(tagItem, `tag-${idx}`)}
                      className="text-gray-400 hover:text-purple-700"
                      title="Copy tag"
                    >
                      {copiedIndex === `tag-${idx}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Duplicate Content Checker Result */}
          {activeTab === "duplicate" && currentResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border ${
                  currentResult.riskLevel === "Low"
                    ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50"
                    : currentResult.riskLevel === "Moderate"
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                    : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Plagiarism / Duplication Risk
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      currentResult.riskLevel === "Low"
                        ? "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100"
                        : currentResult.riskLevel === "Moderate"
                        ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-100"
                        : "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100"
                    }`}
                  >
                    {currentResult.riskLevel} Risk • {currentResult.similarityScore || 0}%
                  </span>
                </div>
                <p className="text-sm font-semibold mb-2">
                  {currentResult.verdict}
                </p>
                {currentResult.recommendation && (
                  <p className="text-xs opacity-90">
                    <strong>Recommendation:</strong> {currentResult.recommendation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantDrawer;
