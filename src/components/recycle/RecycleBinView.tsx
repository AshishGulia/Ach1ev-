import React from 'react';
import { Trash2, RotateCcw, AlertTriangle, ArrowLeft, Notebook as NotebookIcon, FileText, CheckCircle2 } from 'lucide-react';
import { Notebook } from '../../types';

export interface DeletedItem {
  id: string;
  title: string;
  type: 'notebook' | 'note-page';
  subject: string;
  deletedAt: string;
  originalNotebookId?: string;
  data?: any;
}

interface RecycleBinViewProps {
  items: DeletedItem[];
  onRestore: (item: DeletedItem) => void;
  onPermanentDelete: (id: string) => void;
  onEmptyBin: () => void;
  onBackToHome: () => void;
}

export const RecycleBinView: React.FC<RecycleBinViewProps> = ({
  items,
  onRestore,
  onPermanentDelete,
  onEmptyBin,
  onBackToHome,
}) => {
  return (
    <div className="themed-workspace-surface flex-1 overflow-y-auto bg-[#f8f7f3] dark:bg-[#110c09] text-stone-800 dark:text-[#efe4d4] p-6 md:p-8 transition-colors select-none">
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-[#352317]">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-1.5 rounded-lg text-stone-500 dark:text-[#a9927b] hover:text-stone-900 dark:hover:text-[#f5ecde] hover:bg-stone-200/50 dark:hover:bg-[#241811] transition-colors"
              title="Back to My Den"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 text-[#7f1d1d] dark:text-[#a93338] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#6e1418] dark:text-[#b0363b] flex items-center gap-2">
                  <span>Trash</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#1c130e] text-stone-600 dark:text-[#b89f85] border border-stone-200/80 dark:border-[#382518]">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </h1>
                <p className="text-xs text-stone-500 dark:text-[#a69079]">
                  Restore deleted medical notebooks and study pages back to your workspace.
                </p>
              </div>
            </div>
          </div>

          {items.length > 0 && (
            <button
              onClick={onEmptyBin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7f1d1d]/10 hover:bg-[#7f1d1d]/18 dark:bg-[#6e171b]/28 dark:hover:bg-[#6e171b]/42 text-[#6e1418] dark:text-[#b53d42] text-xs font-semibold border border-[#7f1d1d]/25 dark:border-[#962d32]/45 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Empty Trash</span>
            </button>
          )}
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="themed-glass-card p-12 text-center rounded-2xl border border-dashed border-stone-200 dark:border-[#382518] bg-white/50 dark:bg-[#18110c]/70">
            <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-[#231811] text-[#7f1d1d] dark:text-[#9f2c30] flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-[#efe4d4]">
              Trash is Empty
            </h3>
            <p className="text-xs text-stone-400 dark:text-[#a69079] max-w-sm mx-auto mt-1">
              Notebooks or clinical notes you delete will be safely stored here for 30 days before permanent deletion.
            </p>
            <button
              onClick={onBackToHome}
              className="themed-accent-btn mt-4 px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-[#4a2b19] text-white dark:text-[#fff6e8] border border-transparent dark:border-[#7c4928] text-xs font-medium hover:opacity-90 transition-opacity"
            >
              Return to My Den
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="themed-glass-card p-3.5 rounded-xl bg-white dark:bg-[#1a120d] border border-stone-200/80 dark:border-[#352317] flex items-center justify-between shadow-2xs hover:border-stone-300 dark:hover:border-[#523724] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-[#251a12] text-stone-500 dark:text-[#b89f85] flex items-center justify-center shrink-0 border border-transparent dark:border-[#382518]">
                    {item.type === 'notebook' ? (
                      <NotebookIcon className="w-4 h-4 text-[#c49257]" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-[#f5ecde] truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-[#d1a46f] border border-stone-200 dark:border-[#422c1d]">
                        {item.subject}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 dark:text-[#967e67] font-mono mt-0.5">
                      Deleted on {item.deletedAt} · {item.type === 'notebook' ? 'Classmate Notebook' : 'Page Note'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onRestore(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-[#382315]/70 hover:bg-amber-100 dark:hover:bg-[#492d1b] text-amber-800 dark:text-[#e3ba82] text-xs font-medium border border-amber-200/80 dark:border-[#5e3a22] transition-colors"
                    title="Restore item"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => onPermanentDelete(item.id)}
                    className="p-1.5 rounded-lg text-[#7f1d1d]/80 dark:text-[#9f2c30] hover:text-[#5c1215] dark:hover:text-[#b83a3f] hover:bg-[#7f1d1d]/10 dark:hover:bg-[#6e171b]/28 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
