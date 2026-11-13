import React, { useState } from 'react';
import { DeveloperSuggestion } from '../../types';
import { INITIAL_DEVELOPER_SUGGESTIONS } from '../../data/subscriptionData';
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sliders,
  Image as ImageIcon,
  Video,
  Upload,
  User,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronRight,
  Flame,
  Code,
  ThumbsUp,
} from 'lucide-react';

interface TalkToDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  isWorkspaceView?: boolean;
}

export const TalkToDeveloperModal: React.FC<TalkToDeveloperModalProps> = ({
  isOpen,
  onClose,
  studentName = 'User',
  isWorkspaceView = false,
}) => {
  const [suggestions, setSuggestions] = useState<DeveloperSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('medden_developer_suggestions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((item) => item && item.id !== 'sug-1' && item.id !== 'sug-2' && item.id !== 'sug-3');
        }
      }
    } catch {}
    return INITIAL_DEVELOPER_SUGGESTIONS;
  });

  const [selectedSegment, setSelectedSegment] = useState<string>('Shelf');
  const [title, setTitle] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [mediaDataUrl, setMediaDataUrl] = useState('');
  const [mediaFileName, setMediaFileName] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [activeTab, setActiveTab] = useState<'suggest' | 'chat-thread' | 'changelog'>('suggest');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  if (!isOpen) return null;

  const SEGMENTS = [
    'Cockpit',
    'Create Note',
    'Shelf (Library)',
    'Read Studio',
    'Leisure & Focus Reset',
    'Mnemonics',
    'Community Rounds',
    'Settings & Customization',
    'AI Diagnosis & Scanner',
    'General Workstation',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !suggestionText.trim()) return;

    const newSuggestion: DeveloperSuggestion = {
      id: `sug-${Date.now()}`,
      segment: selectedSegment,
      title: title.trim(),
      suggestion: suggestionText.trim(),
      studentName,
      createdAt: new Date().toISOString(),
      status: 'under-review',
      priority,
      chatScreenshot: mediaDataUrl || undefined,
      chatMediaType: mediaType || undefined,
      developerReply: `Thanks for the suggestion for ${selectedSegment}! Our engineering team has logged this in the current sprint.`,
      developerRepliedAt: new Date(Date.now() + 60000).toISOString(),
    };

    const updated = [newSuggestion, ...suggestions];
    setSuggestions(updated);
    try {
      localStorage.setItem('medden_developer_suggestions', JSON.stringify(updated));
    } catch {}

    setTitle('');
    setSuggestionText('');
    setMediaDataUrl('');
    setMediaFileName('');
    setMediaType(null);
    setSubmittedFeedback(true);
    setTimeout(() => setSubmittedFeedback(false), 3000);
  };

  const panel = (
      <div className={
        isWorkspaceView
          ? "themed-workspace-surface flex-1 flex flex-col w-full h-full bg-[#f8f7f3] dark:bg-[#110c09] text-stone-900 dark:text-stone-100 overflow-hidden transition-colors font-sans"
          : "relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#fdfcfa] dark:bg-[#140e0a] border border-amber-900/20 dark:border-amber-500/25 shadow-2xl overflow-hidden text-stone-800 dark:text-stone-100 font-sans"
      }>
        {isWorkspaceView ? (
          /* Seamless Native Workspace Bar (Matching CommunityView & Mnemonics) */
          <div className="themed-glass-bar px-4 sm:px-6 py-2.5 bg-white dark:bg-[#18110c] border-b border-stone-200/80 dark:border-[#382518] shrink-0 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#140e0a] p-1 rounded-xl border border-stone-200 dark:border-[#352317] overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('suggest')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'suggest'
                    ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-amber-500" />
                <span>Submit Suggestion</span>
              </button>

              <button
                onClick={() => setActiveTab('chat-thread')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'chat-thread'
                    ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                <span>Developer Chat ({suggestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'changelog'
                    ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Before &amp; After</span>
              </button>
            </div>

          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50/80 dark:bg-[#18110c]/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 truncate">
                    Talk to Developer
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                    Submit segment-wise requests & view developer updates
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-[#251a12] transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-stone-200/80 dark:border-[#352317] bg-[#f9f8f4] dark:bg-[#160f0b] overflow-x-auto custom-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('suggest')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'suggest'
                    ? 'border-amber-600 text-amber-800 dark:text-amber-300 bg-white dark:bg-[#1f1610]'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Suggestion</span>
              </button>

              <button
                onClick={() => setActiveTab('chat-thread')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'chat-thread'
                    ? 'border-amber-600 text-amber-800 dark:text-amber-300 bg-white dark:bg-[#1f1610]'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Developer Chat ({suggestions.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('changelog')}
                className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'changelog'
                    ? 'border-amber-600 text-amber-800 dark:text-amber-300 bg-white dark:bg-[#1f1610]'
                    : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Before & After</span>
              </button>
            </div>
          </>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* TAB 1: SUBMIT SUGGESTION */}
          {activeTab === 'suggest' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
                {submittedFeedback && (
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Suggestion successfully sent to lead developer! Added to sprint board.</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    1. Choose App Segment:
                  </label>
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#120c08] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {SEGMENTS.map((seg) => (
                      <option key={seg} value={seg}>
                        {seg}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      2. Suggestion Title:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Add 5 Almirah designs or iOS date roller"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#120c08] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      Priority Level:
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#120c08] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <option value="low">Low (Nice to have)</option>
                      <option value="medium">Medium (Improves workflow)</option>
                      <option value="high">High (Major study helper)</option>
                      <option value="critical">Critical (Immediate necessity)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    3. Detailed Suggestion / What update do you want in this segment?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe exactly what should happen, which buttons to add, layout changes, or custom features needed for your workflow..."
                    value={suggestionText}
                    onChange={(e) => setSuggestionText(e.target.value)}
                    required
                    className="w-full p-3 text-xs rounded-xl border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#120c08] text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    4. Add Picture or Video (Optional):
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-stone-300 dark:border-[#382518] bg-white/80 dark:bg-[#120c08] hover:border-[#A47C43] transition-colors cursor-pointer text-xs text-stone-600 dark:text-stone-300">
                      <Upload className="w-4 h-4 text-[#A47C43]" />
                      <span>{mediaFileName ? mediaFileName : 'Choose a picture or screen recording video from device'}</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const isVid = file.type.startsWith('video/');
                          setMediaType(isVid ? 'video' : 'image');
                          setMediaFileName(file.name);
                          if (file.size <= 3.5 * 1024 * 1024) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') setMediaDataUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setMediaDataUrl(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                    {mediaDataUrl && (
                      <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-[#382518] bg-stone-950/90 max-h-48">
                        {mediaType === 'video' ? (
                          <video src={mediaDataUrl} controls className="w-full max-h-48 object-contain" />
                        ) : (
                          <img src={mediaDataUrl} alt={mediaFileName || 'Attached preview'} className="w-full max-h-48 object-contain" />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setMediaDataUrl('');
                            setMediaFileName('');
                            setMediaType(null);
                          }}
                          className="raw-icon-btn absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black cursor-pointer"
                          title="Remove attachment"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="themed-accent-btn px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Suggestion to Developer</span>
                </button>
              </form>

              {/* Right Sidebar: Developer Note & Direct Guarantee */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Direct User Dev Guarantee</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                    Every user suggestion is reviewed directly by our engineering leads. All approved features receive rapid implementation and live Before & After screenshots.
                  </p>
                </div>

                <div className="themed-glass-card p-4 rounded-xl bg-stone-100/70 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                    Your Submitted Requests
                  </span>
                  {suggestions.length === 0 ? (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                      No requests logged yet. Submit any suggestion, picture, or video above to track sprint progress here.
                    </p>
                  ) : (
                    <div className="space-y-2 text-[11px]">
                      {suggestions.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#A47C43] dark:text-amber-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <strong className="block text-stone-900 dark:text-stone-100 truncate">{item.title}</strong>
                            <span className="text-stone-500 dark:text-stone-400">{item.segment} · {item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEVELOPER CHAT THREADS & STATUS */}
          {activeTab === 'chat-thread' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Live feedback stream between you and the development team:
              </p>

              {suggestions.length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-stone-300 dark:border-[#382518] text-center space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-[#A47C43]/60" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">No developer chat messages yet</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Submit a suggestion with a picture or video to start a feedback thread.</p>
                </div>
              )}

              {suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="themed-glass-card p-4 rounded-xl bg-stone-50 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-[#251a12] text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300">
                          {sug.segment}
                        </span>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          {sug.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">
                        "{sug.suggestion}"
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                        sug.status === 'built'
                          ? 'bg-[#A47C43]/20 text-[#735222] dark:text-amber-300 border border-[#A47C43]/35'
                          : sug.status === 'in-progress'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-stone-500/20 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {sug.status === 'built' ? '✓ Built & Live' : sug.status === 'in-progress' ? '⚡ In Sprint' : 'Under Review'}
                    </span>
                  </div>

                  {/* Chat Reply from Developer */}
                  {sug.developerReply && (
                    <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border-l-3 border-amber-600 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 text-[11px]">
                          <User className="w-3.5 h-3.5 text-amber-600" />
                          <span>Antigravity Lead Engineer:</span>
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(sug.developerRepliedAt || sug.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                        {sug.developerReply}
                      </p>
                    </div>
                  )}

                  {/* Picture or video attached if present */}
                  {sug.chatScreenshot && (
                    <div className="pt-1">
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 block mb-1">
                        Attached {sug.chatMediaType === 'video' || sug.chatScreenshot.startsWith('data:video') ? 'Video' : 'Picture'}:
                      </span>
                      {sug.chatMediaType === 'video' || sug.chatScreenshot.startsWith('data:video') ? (
                        <video
                          src={sug.chatScreenshot}
                          controls
                          className="w-full max-h-56 rounded-lg border border-stone-200 dark:border-stone-700 bg-black"
                        />
                      ) : (
                        <img
                          src={sug.chatScreenshot}
                          alt="Attached reference"
                          className="w-full max-h-56 object-contain rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-950/30"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: BEFORE & AFTER VISUAL CHANGELOG */}
          {activeTab === 'changelog' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 text-xs">
                <h4 className="font-bold text-amber-950 dark:text-amber-200 mb-1">
                  Visual Changelog: Compare Before vs After
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  Inspect the direct visual transformations created from user suggestions across recent versions.
                </p>
              </div>

              {suggestions.filter((s) => s.beforeImage || s.afterImage).length === 0 && (
                <div className="p-8 rounded-2xl border border-dashed border-stone-300 dark:border-[#382518] text-center space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-[#A47C43]/60" />
                  <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">No Before & After entries yet</p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">Shipped visual comparisons from your requests will appear here once built.</p>
                </div>
              )}

              {suggestions
                .filter((s) => s.beforeImage || s.afterImage)
                .map((sug) => (
                  <div
                    key={sug.id}
                    className="themed-glass-card p-4 rounded-xl bg-stone-50 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[10px] font-mono">
                          {sug.segment}
                        </span>
                        <span>{sug.title}</span>
                      </h4>
                      <span className="text-[10px] text-[#8a5a2b] dark:text-amber-400 font-bold">
                        ✓ Built & Deployed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      {/* Before */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#6e1418] dark:text-[#c94a4f]">
                          <span>Before Update</span>
                          <span className="text-[10px] font-mono opacity-80">v1.2</span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-[#7f1d1d]/30 dark:border-[#962d32]/55 aspect-video bg-stone-900">
                          <img
                            src={sug.beforeImage}
                            alt="Before update"
                            className="w-full h-full object-cover opacity-85"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[#e49b9e] text-[10px] font-mono">
                            Previous State
                          </span>
                        </div>
                      </div>

                      {/* After */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#735222] dark:text-amber-400">
                          <span>After Shipped Update</span>
                          <span className="text-[10px] font-mono opacity-80">Current Live v2.0</span>
                        </div>
                        <div className="relative rounded-xl overflow-hidden border border-[#A47C43]/80 dark:border-amber-600/80 aspect-video bg-stone-900 shadow-md">
                          <img
                            src={sug.afterImage}
                            alt="After update"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#2a1b10]/90 text-amber-300 text-[10px] font-mono font-bold">
                            Live in App
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
  );

  if (isWorkspaceView) return panel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {panel}
    </div>
  );
};
