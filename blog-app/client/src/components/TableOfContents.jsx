import React, { useEffect, useState } from "react";
import { AlignLeft, ChevronDown, ChevronUp } from "lucide-react";

const TableOfContents = ({ contentContainerSelector = ".blog-content" }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Wait for DOM to render content
    const timer = setTimeout(() => {
      const container = document.querySelector(contentContainerSelector);
      if (!container) return;

      const elements = Array.from(container.querySelectorAll("h2, h3"));
      const items = elements.map((el, index) => {
        let id = el.id;
        if (!id) {
          // Slugify text or fallback to heading-index
          const slug = el.textContent
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-")
            .replace(/^-+|-+$/g, "");
          id = slug || `section-${index + 1}`;
          el.id = id;
        }
        return {
          id,
          text: el.textContent,
          level: el.tagName.toLowerCase(),
        };
      });

      setHeadings(items);

      if (items.length > 0) {
        setActiveId(items[0].id);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [contentContainerSelector]);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%", threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // account for fixed navbar & progress bar
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of Contents"
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm sticky top-24 transition-colors"
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none pb-3 border-b border-gray-100 dark:border-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-bold text-sm tracking-wide uppercase">
          <AlignLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>Table of Contents</span>
        </div>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Toggle Table of Contents"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <ul className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2 text-sm">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li
                key={h.id}
                className={`${
                  h.level === "h3" ? "pl-4 text-xs" : "pl-1 text-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => scrollToHeading(h.id)}
                  className={`text-left w-full py-1 px-2 rounded-lg transition-all duration-200 line-clamp-2 ${
                    isActive
                      ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-semibold border-l-2 border-purple-600 dark:border-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {h.text}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default TableOfContents;
