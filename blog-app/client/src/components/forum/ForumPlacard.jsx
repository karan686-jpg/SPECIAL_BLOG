import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  Compass,
  MessageSquareQuote,
  Flame,
  PenTool,
  Lightbulb,
} from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "Your opinion is valuable. Every deep conversation begins with a courageous voice.",
    author: "Community Spirit",
    highlight: "courageous voice",
  },
  {
    text: "Great minds discuss ideas, not people. Write with clarity, debate with kindness.",
    author: "Intellectual Charter",
    highlight: "discuss ideas",
  },
  {
    text: "Words have power. Shape the narrative with empathy, reason, and conviction.",
    author: "Agora Motto",
    highlight: "empathy & reason",
  },
  {
    text: "Think deeply, write concisely. A sharp argument illuminates without burning.",
    author: "Philosopher's Desk",
    highlight: "illuminates without burning",
  },
];

export default function ForumPlacard({ onStartTopic }) {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIdx];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c101b]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl mb-8">
      {/* Background aesthetic gradients */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-3xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Agora • Open Discourse & Intellectual Exchange</span>
          </div>

          {/* Dynamic Placard Quote Banner */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <MessageSquareQuote className="w-7 h-7 md:w-8 md:h-8 text-indigo-400 shrink-0 mt-1" />
              <blockquote className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 leading-snug">
                "{currentQuote.text}"
              </blockquote>
            </div>
            <p className="text-xs text-indigo-300/70 pl-10 font-medium">
              — {currentQuote.author}
            </p>
          </div>

          {/* Civic Guidelines / Etiquette Charter */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-100 block font-medium">Civic Respect</strong>
                <span className="text-slate-400 text-[11px]">Critique ideas, never people.</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
              <Compass className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <strong className="text-slate-100 block font-medium">Concise & Clear</strong>
                <span className="text-slate-400 text-[11px]">Focus on high-signal thoughts.</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-slate-300">
              <HeartHandshake className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <strong className="text-slate-100 block font-medium">Constructive Truth</strong>
                <span className="text-slate-400 text-[11px]">Listen to learn, not just win.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Topic Call To Action */}
        <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
          <button
            onClick={onStartTopic}
            className="w-full lg:w-56 px-5 py-3.5 rounded-xl font-medium text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            <span>Start a Discussion</span>
          </button>
          
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Writers & readers can share insights freely.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
