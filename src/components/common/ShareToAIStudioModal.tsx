import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Download,
  Share2,
  Cloud,
  FileCode,
  ShieldCheck,
  X,
  Radio,
  Cpu,
} from 'lucide-react';

interface ShareToAIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareToAIStudioModal: React.FC<ShareToAIStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const APPLET_ID = '7deea275-4fca-404e-b629-b4af401b1f96';
  const AI_STUDIO_APPLET_URL = `https://aistudio.google.com/app/applet/${APPLET_ID}`;
  const PRIMARY_DOMAIN_URL = 'https://ach1ev.com';
  const SECONDARY_VERCEL_URL = 'https://achievx.vercel.app';
  const DOWNLOAD_ZIP_URL = '/api/export/aistudio';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const AI_STUDIO_SYSTEM_INSTRUCTION = `You are Ach1ev Studio Assistant ("Settle Ideas"), an expert medical professor and clinical pharmacologist integrated into the Ach1ev (ACH1EV) workspace.
Current Project: Ach1ev — Settle Ideas (Primary Domain: https://ach1ev.com | Applet ID: ${APPLET_ID}).
Model: gemini-3-flash-preview / gemini-3.1-flash-lite with server-side clinical search and reasoning.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-stone-900 border border-amber-500/30 rounded-2xl shadow-2xl text-stone-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 shadow-md">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-100">Share Ach1ev Workspace</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                  ach1ev.com Primary
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Primary domain, secondary Vercel mirror, Applet ID, and export bundle for Ach1ev
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Primary Action: Direct Google AI Studio Applet Link */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                  1. Google AI Studio Applet
                </span>
                <p className="text-sm font-bold text-stone-100 mt-0.5">
                  Open Project Directly in Google AI Studio
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Applet ID: <code className="text-amber-300 bg-stone-950 px-1.5 py-0.5 rounded font-mono">{APPLET_ID}</code>
                </p>
              </div>

              <a
                href={AI_STUDIO_APPLET_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-lg shrink-0 hover:scale-105 active:scale-95"
              >
                <span>Open in AI Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300">
              <span className="truncate flex-1">{AI_STUDIO_APPLET_URL}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(AI_STUDIO_APPLET_URL, 'applet')}
                className="p-1 text-stone-400 hover:text-amber-400 transition"
                title="Copy AI Studio URL"
              >
                {copiedKey === 'applet' ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. Download Offline ZIP Archive for AI Studio */}
          <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                  2. Project Bundle (.zip)
                </span>
                <p className="text-sm font-bold text-stone-200 mt-0.5">
                  Download Complete Ach1ev Export ZIP
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Complete repository with source, brand assets, metadata.json, and server.ts
                </p>
              </div>

              <a
                href={DOWNLOAD_ZIP_URL}
                download="Ach1ev-AI-Studio-Export.zip"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition border border-stone-700 shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Download ZIP</span>
              </a>
            </div>
          </div>

          {/* 3. Live Deployment URLs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Primary Public Domain */}
            <div className="p-3.5 rounded-xl bg-stone-950/40 border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-amber-300">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Primary Public Domain</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 font-mono">
                  PRIMARY
                </span>
              </div>
              <p className="text-[11px] text-stone-300 truncate font-mono">
                {PRIMARY_DOMAIN_URL}
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href={PRIMARY_DOMAIN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 text-center rounded-lg bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 text-[11px] font-semibold border border-amber-800/40 transition"
                >
                  Open ach1ev.com ↗
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(PRIMARY_DOMAIN_URL, 'primary')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition"
                  title="Copy Primary Domain"
                >
                  {copiedKey === 'primary' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Secondary Vercel Mirror */}
            <div className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-300">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-sky-400" />
                  <span>Vercel Deployment</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 font-mono">
                  SECONDARY
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate font-mono">
                {SECONDARY_VERCEL_URL}
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href={SECONDARY_VERCEL_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-1.5 px-2 text-center rounded-lg bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 text-[11px] font-semibold border border-sky-800/40 transition"
                >
                  Visit Vercel ↗
                </a>
                <button
                  type="button"
                  onClick={() => copyToClipboard(SECONDARY_VERCEL_URL, 'vercel')}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] transition"
                  title="Copy Secondary URL"
                >
                  {copiedKey === 'vercel' ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. AI Studio System Instruction Copier */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>AI Studio Prompt & System Instructions</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(AI_STUDIO_SYSTEM_INSTRUCTION, 'prompt')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 text-[11px] font-medium transition"
              >
                {copiedKey === 'prompt' ? (
                  <>
                    <Check className="w-3 h-3 text-amber-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Instructions</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[10px] text-stone-400 bg-stone-900 p-2.5 rounded-lg font-mono whitespace-pre-wrap leading-relaxed border border-stone-800">
              {AI_STUDIO_SYSTEM_INSTRUCTION}
            </pre>
          </div>

          {/* 5. 3-Step Import Guide */}
          <div className="p-3.5 rounded-xl bg-stone-950/30 border border-stone-800/60 text-xs text-stone-400 space-y-1.5">
            <span className="font-bold text-stone-300 block mb-1">Quick Steps to Import in AI Studio:</span>
            <p>1. Click <strong className="text-amber-400">"Open in AI Studio"</strong> or go to <strong className="text-stone-200">aistudio.google.com</strong>.</p>
            <p>2. In your workspace, open the applet using ID <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded font-mono">{APPLET_ID}</code> or upload the downloaded ZIP.</p>
            <p>3. Add your <code className="text-stone-200 bg-stone-900 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> in environment variables for live real-time clinical AI synthesis.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Google GenAI SDK `@google/genai` Configured</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
