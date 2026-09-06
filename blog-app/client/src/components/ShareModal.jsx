import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Twitter,
} from "lucide-react";
import { toast } from "react-hot-toast";

const ShareModal = ({ isOpen, onClose, blog }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !blog) return null;

  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = blog.title || "Check out this article";
  const shareText = `"${title}" on Blogify`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-emerald-500 hover:bg-emerald-600 text-white",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText + " " + url
      )}`,
    },
    {
      name: "Twitter / X",
      icon: Twitter,
      color: "bg-black hover:bg-gray-800 text-white dark:bg-gray-800 dark:hover:bg-gray-700",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
    },
    {
      name: "Reddit",
      icon: Share2,
      color: "bg-orange-600 hover:bg-orange-700 text-white",
      href: `https://reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-lg">
            <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Share Story</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Social Share Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
              Share to platforms
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {shareOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <a
                    key={opt.name}
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl font-medium text-xs transition-all duration-150 active:scale-95 shadow-sm ${opt.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{opt.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Copy Link Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Article Link
            </label>
            <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
              <input
                type="text"
                readOnly
                value={url}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 outline-none truncate font-mono"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-all duration-200 ${
                  copied
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </div>

          {/* Live OpenGraph Preview Card */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Social Card Preview (OpenGraph)
            </label>
            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-36 object-cover"
                />
              )}
              <div className="p-3">
                <span className="text-[10px] font-mono font-semibold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  blogify.app • {blog.category}
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                  {blog.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {blog.subtitle || "Read this article on Blogify, the platform for modern writers."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
