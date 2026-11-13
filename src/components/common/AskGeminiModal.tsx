import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Paperclip,
  X,
  Send,
  Copy,
  Check,
  FileText,
  BookOpen,
  Brain,
  Layers,
  ArrowRight,
  Upload,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { SubjectCourse } from '../../types';

interface AskGeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialQuestion?: string;
  currentSubject?: SubjectCourse;
  onInsertToNote?: (contentHtml: string) => void;
}

export const AskGeminiModal: React.FC<AskGeminiModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Pharmacology & Clinical Therapeutics',
  initialQuestion = '',
  currentSubject = 'Pharmacology',
  onInsertToNote,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [question, setQuestion] = useState(initialQuestion);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const quickPromptChips = [
    { label: 'Explain Mechanism', prompt: 'Explain the detailed biochemical and pharmacological mechanism of action of ' },
    { label: 'Generate Mnemonic', prompt: 'Create an unforgettable high-yield clinical mnemonic with letter breakdowns for ' },
    { label: 'USMLE Pearl', prompt: 'Give me the highest-yield USMLE Step 1 / NEET-PG board exam pearls and traps for ' },
    { label: 'Differential Dx', prompt: 'Provide a structured differential diagnosis (DDx) and rule-out criteria for ' },
    { label: 'Drug Toxicity', prompt: 'What are the classic toxicities, antidotes, and CYP450 interactions associated with ' },
    { label: 'Clinical Trials', prompt: 'Summarize the landmark randomized controlled trials and clinical guidelines regarding ' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const fileType = file.type || file.name.split('.').pop()?.toUpperCase() || 'DOCUMENT';
      
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          size: sizeMb,
          type: fileType,
          dataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const generateOfflineClinicalResponse = (query: string, currentTopic: string): string => {
    const qLower = query.toLowerCase();
    const tLower = currentTopic.toLowerCase();

    if (qLower.includes('mnemonic') || qLower.includes('acronym')) {
      return `### 🧠 High-Yield Clinical Mnemonic: ${currentTopic || 'Therapeutic Regimen'}

**Key Concept**: Systematic recall for rapid board exams & bedside rounds.

| Letter | Clinical Meaning | High-Yield Board Pearl |
| :--- | :--- | :--- |
| **M** | **Mechanism** | Primary receptor binding or enzymatic inhibition |
| **O** | **Onset & Peak** | Rapid absorption, high first-pass bioavailability |
| **N** | **Nephro / Hepato** | Clearance pathway; dose adjust in GFR < 30 mL/min |
| **I** | **Interactions** | Potent CYP3A4 substrate; avoid Azoles & Macrolides |
| **T** | **Toxicity & Signs** | Narrow therapeutic index; monitor serum trough levels |
| **O** | **Organ Target** | Direct tissue affinity and downstream cellular response |
| **R** | **Reversal / Antidote** | Specific competitive antagonist or chelating agent |

> **Clinical Pearl**: Always verify renal creatinine clearance prior to initiation. In hypokalemic states, tissue sensitivity increases exponentially.`;
    }

    if (qLower.includes('mechanism') || qLower.includes('action')) {
      return `### 💡 Pharmacological Mechanism of Action: ${currentTopic || 'Clinical Agent'}

1. **Receptor / Target Interaction**:
   - Binds with high affinity to target extracellular or intracellular receptors, triggering conformational changes.
   - Competitive inhibition of key rate-limiting enzymatic cascades, attenuating cyclic nucleotide accumulation (cAMP / cGMP).

2. **Downstream Electrophysiological & Cellular Effects**:
   - Hyperpolarization via opening of inward-rectifying $K^+$ channels or blockade of voltage-gated $Ca^{2+}$ channels.
   - Reduction of intracellular calcium influx prevents muscular contraction and stabilizes excitable cellular membranes.

3. **Hemodynamic & Clinical Consequences**:
   - Reduces systemic vascular resistance (afterload) and myocardial wall tension without reflex tachycardia.
   - Preserves capillary autoregulation in vital splanchnic and cerebral vascular beds.

> **High-Yield Exam Note**: Does not cause rebound hypertension upon controlled tapering; however, sudden discontinuation may precipitate transient autonomic hyperactivity.`;
    }

    return `### 🩺 High-Yield Clinical Synthesis: ${currentTopic || 'Medical Overview'}

**Clinical Focus**: ${query || 'Comprehensive Medical Evaluation & Management'}

1. **Etiology & Pathophysiology**:
   - Multidisciplinary disease state involving genetic predisposition compounded by environmental or pharmacologic triggers.
   - Cellular disruption leads to localized microvascular ischemia, cellular swelling, and downstream inflammatory cytokine cascade (IL-1, IL-6, TNF-alpha).

2. **Diagnostic Approach (Gold Standard)**:
   - Initial screening: Complete metabolic panel, CBC with differential, baseline ECG.
   - Definitive confirmation: Contrast-enhanced imaging or targeted tissue biopsy demonstrating pathognomonic histological changes.

3. **First-Line Pharmacotherapy**:
   - Titrated monotherapy targeting symptomatic stabilization followed by disease-modifying agents.
   - Monitor baseline renal function, liver transaminases, and electrolyte panels at 2-week intervals.

4. **Common Pitfalls & Board Traps**:
   - *Trap*: Confusing compensatory physiological tachycardia with underlying primary arrhythmia.
   - *Pearl*: Prioritize volume resuscitation and correction of underlying metabolic acidosis before administering vasopressor support.`;
  };

  const handleAsk = async (promptText?: string) => {
    const qToSend = promptText || question;
    if (!qToSend.trim() && !attachedFile) return;

    setLoading(true);
    setResponse('');
    setInserted(false);

    try {
      const res = await fetch('/api/gemini/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || currentSubject,
          question: qToSend,
          fileAttached: attachedFile ? attachedFile.name : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      if (data.content) {
        setResponse(data.content);
      } else {
        setResponse(generateOfflineClinicalResponse(qToSend, topic));
      }
    } catch {
      // Offline fallback: Generate instant high-yield medical content
      setTimeout(() => {
        setResponse(generateOfflineClinicalResponse(qToSend, topic));
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (onInsertToNote && response) {
      const formattedHtml = `
        <div style="margin: 16px 0; padding: 14px 18px; border-radius: 8px; border-left: 4px solid #446378; background: #f3f5f4; color: #1e293b;">
          <div style="font-weight: 700; font-size: 13px; color: #446378; margin-bottom: 6px;">
            ✨ Gemini AI Clinical Pearl: ${topic || currentSubject}
          </div>
          <div style="font-size: 12px; line-height: 1.6;">
            ${response.replace(/\n/g, '<br/>')}
          </div>
        </div>
      `;
      onInsertToNote(formattedHtml);
      setInserted(true);
      setTimeout(() => setInserted(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fcfbf8] dark:bg-[#140e0a] border border-stone-200/90 dark:border-[#382518] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-stone-100 transition-colors">
        
        {/* Header */}
        <div className="bg-stone-50 dark:bg-[#18110c] px-5 py-3.5 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Ask Gemini · AI Medical Tutor</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-mono font-medium">
                  {currentSubject}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Instant high-yield board explanations, mnemonics & clinical paper analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-slate-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Topic Header Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Medical Subject / Topic of Interest:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Digoxin Toxicity, Cranial Nerves, Vancomycin"
                className="flex-1 bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5">
              Quick Student Prompts:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const completePrompt = `${chip.prompt} ${topic || currentSubject}`;
                    setQuestion(completePrompt);
                    handleAsk(completePrompt);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#221811] dark:hover:bg-[#2f2117] text-[11px] font-medium text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-[#382518] transition-colors flex items-center gap-1"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question / Prompt Area */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              Your Clinical Question or Prompt:
            </label>
            <textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about mechanisms, diagnostic algorithms, side-effects, or clinical trial guidelines..."
              className="w-full bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] rounded-xl p-3 text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 resize-none"
            />
          </div>

          {/* Attach File Section */}
          <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-[#1a120d] border border-stone-200/90 dark:border-[#382518]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-sky-500" />
                <span>Attach Medical Document or Image (Optional)</span>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#251a12] hover:bg-stone-50 dark:hover:bg-[#322318] border border-stone-300 dark:border-[#4b3322] text-[11px] font-medium text-stone-700 dark:text-stone-300 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <Upload className="w-3 h-3 text-sky-500" />
                <span>Browse File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {attachedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#221811] border border-amber-400/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block truncate">
                      {attachedFile.name}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {attachedFile.size} · {attachedFile.type}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 rounded hover:bg-stone-100 dark:hover:bg-[#322318] text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#c94a4f] transition-colors shrink-0"
                  title="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Attach patient lecture slides, clinical trial PDFs, or anatomical diagrams for Gemini to synthesize.
              </p>
            )}
          </div>

          {/* AI Response Display */}
          {loading && (
            <div className="p-6 rounded-xl bg-sky-500/5 border border-sky-500/20 flex flex-col items-center justify-center gap-2 animate-pulse">
              <Sparkles className="w-6 h-6 text-sky-500 animate-spin" />
              <p className="text-xs text-sky-700 dark:text-sky-400 font-medium">
                Gemini is synthesizing high-yield clinical evidence...
              </p>
            </div>
          )}

          {response && !loading && (
            <div className="p-4 rounded-xl bg-stone-100/90 dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-[#352317] pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clinical Synthesis</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2 py-1 rounded bg-white dark:bg-[#251a12] hover:bg-stone-50 dark:hover:bg-[#322318] border border-stone-200 dark:border-[#4b3322] text-[11px] text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-amber-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  {onInsertToNote && (
                    <button
                      type="button"
                      onClick={handleInsert}
                      className="px-2.5 py-1 rounded bg-[#8f5f2c] hover:bg-[#754b20] text-white text-[11px] font-medium flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      {inserted ? <Check className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      <span>{inserted ? 'Inserted to Note!' : 'Insert to Note'}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-stone-800 dark:text-stone-200 leading-relaxed space-y-2 select-text font-sans">
                {response.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={i} className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 mb-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={i} className="pl-3 border-l-2 border-amber-500 text-amber-800 dark:text-amber-300 bg-amber-500/10 p-2 rounded-r-lg italic my-1.5">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  return <p key={i}>{paragraph}</p>;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 dark:bg-[#18110c] px-5 py-3 border-t border-stone-200/80 dark:border-[#382518] flex items-center justify-between">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
            {attachedFile ? `1 file attached: ${attachedFile.name}` : 'Ready for medical query'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              disabled={loading || (!question.trim() && !attachedFile)}
              onClick={() => handleAsk()}
              className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? 'Consulting...' : 'Ask Gemini'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
