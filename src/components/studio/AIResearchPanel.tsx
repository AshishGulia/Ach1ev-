import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  Send,
  Maximize2,
  Minimize2,
  RefreshCw,
  FilePlus,
  Compass,
} from 'lucide-react';

interface AIResearchPanelProps {
  initialTopic?: string;
  initialSnippet?: string;
  onInsertToNote?: (text: string) => void;
  onMakeMainReading?: () => void;
  isMainReading?: boolean;
}

export const AIResearchPanel: React.FC<AIResearchPanelProps> = ({
  initialTopic = 'Osteoporosis Pharmacotherapy',
  initialSnippet = '',
  onInsertToNote,
  onMakeMainReading,
  isMainReading = false,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [researchContent, setResearchContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [queryInput, setQueryInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inserted, setInserted] = useState<boolean>(false);

  // Sync topic when user triggers from book
  useEffect(() => {
    if (initialTopic && initialTopic !== topic) {
      setTopic(initialTopic);
      fetchResearch(initialTopic, initialSnippet);
    }
  }, [initialTopic, initialSnippet]);

  // Initial fetch on mount if empty
  useEffect(() => {
    if (!researchContent && !loading) {
      fetchResearch(topic, initialSnippet);
    }
  }, []);

  const fetchResearch = async (subjectTopic: string, snippet?: string, customQuestion?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: subjectTopic,
          pageSnippet: snippet || '',
          question: customQuestion || '',
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResearchContent(data.content);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load latest clinical research. Check connection or API key.');
      // High-yield fallback content so student is never blocked
      setResearchContent(`
### Clinical Evidence & Research Synthesis: ${subjectTopic}

#### Landmark Trials & Recent Evidence:
- **FREEDOM Trial (NEJM):** Denosumab (60 mg q6m) demonstrated 68% relative risk reduction in new vertebral fractures and 40% reduction in hip fractures over 3 years in postmenopausal osteoporosis. Long-term 10-year extension validated continuous BMD accrual without plateau.
- **FRAME & ARCH Trials (NEJM 2017 & 2018):** Romosozumab (210 mg monthly) vs Alendronate. Demonstrated 73% lower risk of vertebral fractures at 12 months with bone anabolic burst followed by antiresorptive maintenance.
- **HORIZON-PFT Trial:** Intravenous Zoledronic Acid (5 mg yearly) proved significant reduction in clinical vertebral fractures, hip fractures, and overall post-hip-fracture mortality.

#### Critical Clinical Precautions:
- **Denosumab Rebound Warning:** Cessation of denosumab results in rapid osteoclast rebound with elevated bone turnover markers above baseline, predisposing to multiple spontaneous vertebral compression fractures. Transitioning to bisphosphonate (e.g. Zoledronate or Alendronate) is MANDATORY upon discontinuation.
- **Atypical Femoral Fractures (AFF) & ONJ:** Associated with prolonged anti-resorptive suppression (>5 years). Drug holiday evaluation recommended after 3-5 years for moderate-risk patients.
      `);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || loading) return;
    fetchResearch(topic, initialSnippet, queryInput.trim());
    setQueryInput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(researchContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertToNote && researchContent) {
      const formattedHtml = `
        <div style="background:#fdf8ef; border:1px solid #e6d3b3; padding:12px; border-radius:6px; margin:14px 0;">
          <h4 style="color:#6b411b; margin:0 0 8px 0;">🔬 AI Clinical Research Synthesis: ${topic}</h4>
          <div>${researchContent.replace(/\n/g, '<br/>')}</div>
        </div>
      `;
      onInsertToNote(formattedHtml);
      setInserted(true);
      setTimeout(() => setInserted(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-100 dark:bg-[#140e0a] border border-stone-300 dark:border-[#382518] rounded-lg overflow-hidden shadow-sm">
      {/* Header bar */}
      <div className="bg-white dark:bg-[#18110c] border-b border-stone-200 dark:border-[#352317] px-3 py-2 flex items-center justify-between gap-2 text-xs select-none">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-800 dark:text-[#efe4d4] text-[11px] truncate">
              Medical Research & Web AI
            </h3>
            <p className="text-[9px] text-stone-500 dark:text-[#a69079] truncate">
              Topic: <span className="text-sky-600 dark:text-sky-400 font-medium">{topic}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Make Main Reading Swap Button */}
          {onMakeMainReading && (
            <button
              onClick={onMakeMainReading}
              title={isMainReading ? 'Restore Book to Main Reading' : 'Make AI Research the Main Center View'}
              className="px-2 py-1 rounded bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#2b1e15] text-stone-700 dark:text-[#efe4d4] text-[10px] font-medium flex items-center gap-1 border border-stone-200 dark:border-[#382518]"
            >
              {isMainReading ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3 text-sky-500" />}
              <span className="hidden sm:inline">{isMainReading ? 'Reset View' : 'Main View'}</span>
            </button>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-600 dark:text-[#d8c7b0]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Insert directly into active note */}
          {onInsertToNote && (
            <button
              onClick={handleInsert}
              title="Insert findings directly into active Notebook"
              className="px-2 py-1 rounded bg-[#8f5f2c] hover:bg-[#754b20] text-white text-[10px] font-semibold flex items-center gap-1 shadow-xs"
            >
              {inserted ? <Check className="w-3 h-3" /> : <FilePlus className="w-3 h-3" />}
              <span>{inserted ? 'Inserted!' : 'Insert to Note'}</span>
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => fetchResearch(topic, initialSnippet)}
            disabled={loading}
            title="Refresh research"
            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-600 dark:text-[#d8c7b0] disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Quick Search Preset Tags */}
      <div className="bg-stone-50 dark:bg-[#110c09] px-3 py-1.5 border-b border-stone-200 dark:border-[#352317] flex items-center gap-1.5 overflow-x-auto text-[10px]">
        <span className="text-stone-400 dark:text-[#a69079] font-medium shrink-0">Focus:</span>
        {[
          'Landmark Trials',
          'Romosozumab vs Bisphosphonates',
          'ADRs & ONJ Protocol',
          'ASBMR Guidelines',
          'High-Yield Mnemonics',
        ].map((tag) => (
          <button
            key={tag}
            onClick={() => fetchResearch(topic, initialSnippet, `Provide latest clinical details regarding: ${tag}`)}
            className="px-2 py-0.5 rounded-full bg-white dark:bg-[#211711] hover:bg-amber-50 dark:hover:bg-[#2b1e15] text-stone-700 dark:text-[#d8c7b0] border border-stone-200 dark:border-[#382518] whitespace-nowrap"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Research Viewport Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 text-stone-500 dark:text-[#a69079]">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mb-2" />
            <p className="text-xs">Scanning clinical trials & latest literature for "{topic}"...</p>
            <p className="text-[10px] text-stone-400 dark:text-[#8f7964] mt-1">Retrieving evidence from medical knowledge base</p>
          </div>
        ) : error ? (
          <div className="p-3 bg-[#7f1d1d]/10 dark:bg-[#6e171b]/25 border border-[#7f1d1d]/25 dark:border-[#962d32]/45 rounded text-xs text-[#6e1418] dark:text-[#e49b9e]">
            <p className="font-semibold mb-1">Notice:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1a120d] p-5 rounded-lg shadow-sm border border-stone-200 dark:border-[#382518] text-stone-800 dark:text-[#efe4d4] text-xs md:text-sm leading-relaxed prose dark:prose-invert max-w-none">
            {/* Formatted Markdown */}
            <div
              className="space-y-3"
              dangerouslySetInnerHTML={{
                __html: researchContent
                  .replace(/### (.*?)\n/g, '<h3 class="text-base font-bold text-stone-900 dark:text-[#efe4d4] mt-3 mb-1">$1</h3>')
                  .replace(/#### (.*?)\n/g, '<h4 class="text-sm font-semibold text-amber-700 dark:text-amber-300 mt-2 mb-1">$1</h4>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/- (.*?)\n/g, '<li class="ml-4 list-disc text-stone-700 dark:text-[#d8c7b0]">$1</li>')
                  .replace(/\n\n/g, '<br/>'),
              }}
            />
          </div>
        )}
      </div>

      {/* Ask Question / Search Bar */}
      <div className="p-2.5 bg-white dark:bg-[#18110c] border-t border-stone-200 dark:border-[#352317]">
        <form onSubmit={handleCustomSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={`Ask AI research query about ${topic}...`}
            className="flex-1 bg-stone-50 dark:bg-[#251a12] px-3 py-1.5 rounded border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-[#efe4d4] placeholder-stone-400 outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!queryInput.trim() || loading}
            className="p-1.5 rounded bg-amber-700 hover:bg-amber-800 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
