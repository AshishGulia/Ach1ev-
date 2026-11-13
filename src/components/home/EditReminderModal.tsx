import React, { useState, useEffect } from 'react';
import { ClinicalReminder } from '../../types';
import {
  Bell,
  BellRing,
  Volume2,
  Clock,
  Calendar,
  X,
  Check,
  Trash2,
  AlertTriangle,
  Repeat,
  Tag,
  Sparkles,
  ShieldAlert,
  Flame,
} from 'lucide-react';

interface EditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ClinicalReminder | null;
  onSaveReminder: (updated: ClinicalReminder) => void;
  onDeleteReminder?: (id: string) => void;
}

export const REMINDER_PRESETS = [
  {
    title: 'Ward Rounds Case Presentation',
    category: 'Ward Rounds' as const,
    priority: 'critical' as const,
    dueTime: '08:30 AM',
    recurrence: 'daily' as const,
    alertTiming: '30m-before' as const,
  },
  {
    title: 'Check Vancomycin Trough & Serum Cr',
    category: 'Drug Review' as const,
    priority: 'critical' as const,
    dueTime: '02:00 PM',
    recurrence: 'every-4h' as const,
    alertTiming: '10m-before' as const,
  },
  {
    title: 'USMLE Step 1 QBank (40 High-Yield Questions)',
    category: 'Study Goal' as const,
    priority: 'high' as const,
    dueTime: '06:00 PM',
    recurrence: 'daily' as const,
    alertTiming: 'at-time' as const,
  },
  {
    title: 'Hydration & 20-20-20 Eye Stretch Rest',
    category: 'Wellness & Rest' as const,
    priority: 'wellness' as const,
    dueTime: 'Every 2 Hours',
    recurrence: 'every-4h' as const,
    alertTiming: 'at-time' as const,
  },
  {
    title: 'Review Digoxin vs Hypokalemia Board Trap',
    category: 'Exam Trap' as const,
    priority: 'high' as const,
    dueTime: 'Tomorrow, 09:00 AM',
    recurrence: 'none' as const,
    alertTiming: '10m-before' as const,
  },
];

export const EditReminderModal: React.FC<EditReminderModalProps> = ({
  isOpen,
  onClose,
  reminder,
  onSaveReminder,
  onDeleteReminder,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(reminder?.title || '');
  const [dueTime, setDueTime] = useState(reminder?.dueTime || 'Today, 05:00 PM');
  const [dueDate, setDueDate] = useState(reminder?.dueDate || new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ClinicalReminder['category']>(reminder?.category || 'Ward Rounds');
  const [priority, setPriority] = useState<ClinicalReminder['priority']>(reminder?.priority || 'high');
  const [notificationEnabled, setNotificationEnabled] = useState(reminder ? reminder.notificationEnabled : true);
  const [notificationType, setNotificationType] = useState<ClinicalReminder['notificationType']>(reminder?.notificationType || 'both');
  const [alertTiming, setAlertTiming] = useState<ClinicalReminder['alertTiming']>(reminder?.alertTiming || '10m-before');
  const [recurrence, setRecurrence] = useState<ClinicalReminder['recurrence']>(reminder?.recurrence || 'none');
  const [notes, setNotes] = useState(reminder?.notes || '');

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title);
      setDueTime(reminder.dueTime);
      setDueDate(reminder.dueDate || new Date().toISOString().split('T')[0]);
      setCategory(reminder.category);
      setPriority(reminder.priority);
      setNotificationEnabled(reminder.notificationEnabled);
      setNotificationType(reminder.notificationType);
      setAlertTiming(reminder.alertTiming);
      setRecurrence(reminder.recurrence);
      setNotes(reminder.notes || '');
    } else {
      setTitle('');
      setDueTime('Today, 05:00 PM');
      setCategory('Ward Rounds');
      setPriority('high');
      setNotificationEnabled(true);
      setNotificationType('both');
      setAlertTiming('10m-before');
      setRecurrence('none');
      setNotes('');
    }
  }, [reminder]);

  const handleApplyPreset = (preset: typeof REMINDER_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setPriority(preset.priority);
    setDueTime(preset.dueTime);
    setRecurrence(preset.recurrence);
    setAlertTiming(preset.alertTiming);
    setNotificationEnabled(true);
  };

  const playTibetanChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, ctx.currentTime);
      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1056, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.6);
      osc2.stop(ctx.currentTime + 1.6);
    } catch (err) {
      console.warn('Audio chime error:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updated: ClinicalReminder = {
      id: reminder?.id || `rem-${Date.now()}`,
      title: title.trim(),
      dueTime: dueTime.trim(),
      dueDate,
      category,
      priority,
      notificationEnabled,
      notificationType,
      alertTiming,
      recurrence,
      notes: notes.trim() || undefined,
      completed: reminder?.completed || false,
    };

    onSaveReminder(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fcfbf8] dark:bg-[#160f0b] border border-stone-200/90 dark:border-[#382518] rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-[#efe4d4] transition-colors">
        
        {/* Header */}
        <div className="bg-stone-50 dark:bg-[#1e140e] px-5 py-3.5 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {reminder ? 'Edit Clinical Reminder & Notifications' : 'New Clinical Reminder'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Configure alert timing, sound notifications, priorities & recurring ward schedules
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Quick Preset Templates */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Quick Medical Presets:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {REMINDER_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium bg-stone-100 dark:bg-[#241912] hover:bg-stone-200 dark:hover:bg-[#312218] border border-stone-200 dark:border-[#3d291c] text-stone-700 dark:text-[#d8c7b0] transition-colors truncate max-w-[200px]"
                  title={p.title}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
              Reminder Title & Clinical Purpose:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Check Vancomycin peak & trough at 14:00"
              className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Time & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Due Time / Timing:</span>
              </label>
              <input
                type="text"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                placeholder="e.g. Today, 05:00 PM or 08:30 AM"
                className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Date:</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#efe4d4] outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#efe4d4] outline-none"
              >
                <option value="Ward Rounds">Ward Rounds</option>
                <option value="Drug Review">Drug Review & Kinetics</option>
                <option value="Study Goal">Study Goal & MCQs</option>
                <option value="Wellness & Rest">Wellness, Eye Rest & Hydration</option>
                <option value="Exam Trap">USMLE / NEET-PG Exam Trap</option>
                <option value="General">General Medical Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
                Priority Urgency:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-[#efe4d4] outline-none"
              >
                <option value="critical">🚨 Critical (Urgent Ward Alert)</option>
                <option value="high">🔥 High-Yield (Core Exam Topic)</option>
                <option value="routine">📋 Routine (Daily Review)</option>
                <option value="wellness">💧 Wellness (Rest & Recovery)</option>
              </select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="p-3.5 rounded-xl bg-stone-100/80 dark:bg-[#1e140e] border border-stone-200/90 dark:border-[#382518] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-[#f2e7d6]">
                  Notification & Alert Settings
                </span>
                <button
                  type="button"
                  onClick={playTibetanChime}
                  className="ml-1 px-2 py-0.5 rounded-md bg-stone-200 dark:bg-[#2b1d14] hover:bg-amber-100 dark:hover:bg-[#3d291c] text-[10px] font-semibold text-stone-700 dark:text-[#d8c7b0] hover:text-amber-600 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Test Tibetan bowl notification chime"
                >
                  <Volume2 className="w-3 h-3 text-sky-500" />
                  <span>Test Chime</span>
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationEnabled}
                  onChange={(e) => setNotificationEnabled(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span className="text-xs text-stone-600 dark:text-[#d8c7b0] font-medium">
                  {notificationEnabled ? 'Alert Active' : 'Muted'}
                </span>
              </label>
            </div>

            {notificationEnabled && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 border-t border-stone-200/70 dark:border-[#352317]">
                {/* Notification Type */}
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block mb-1">Alert Channel:</span>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-lg px-2 py-1.5 text-[11px] text-stone-800 dark:text-[#efe4d4] outline-none"
                  >
                    <option value="both">🔔 Sound + Toast Banner</option>
                    <option value="sound">🔊 Tibetan Bowl Chime Only</option>
                    <option value="banner">💬 On-Screen Toast Only</option>
                  </select>
                </div>

                {/* Pre-alert Timing */}
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block mb-1">Alert Timing:</span>
                  <select
                    value={alertTiming}
                    onChange={(e) => setAlertTiming(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-lg px-2 py-1.5 text-[11px] text-stone-800 dark:text-[#efe4d4] outline-none"
                  >
                    <option value="at-time">At exact due time</option>
                    <option value="10m-before">10 minutes before</option>
                    <option value="30m-before">30 minutes before</option>
                    <option value="1h-before">1 hour before</option>
                  </select>
                </div>

                {/* Recurrence */}
                <div>
                  <span className="text-[10px] font-mono text-stone-400 block mb-1">Recurrence:</span>
                  <select
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as any)}
                    className="w-full bg-white dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-lg px-2 py-1.5 text-[11px] text-stone-800 dark:text-[#efe4d4] outline-none"
                  >
                    <option value="none">One-Time Only</option>
                    <option value="daily">Daily at 08:00 AM</option>
                    <option value="every-4h">Every 4 Hours</option>
                    <option value="weekly">Weekly on Mondays</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-[#d8c7b0] mb-1">
              Clinical Pearl / Notes (Optional):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Always check eGFR < 30 before administering. Titrate dose slowly."
              className="w-full bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] rounded-xl p-2.5 text-xs text-stone-900 dark:text-[#efe4d4] outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 dark:border-[#352317]">
            {reminder && onDeleteReminder ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteReminder(reminder.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#7f1d1d]/10 hover:bg-[#7f1d1d]/18 dark:bg-[#6e171b]/25 dark:hover:bg-[#6e171b]/40 text-[#7f1d1d] dark:text-[#b0363b] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                {reminder ? 'Save Reminder' : 'Create Reminder'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
