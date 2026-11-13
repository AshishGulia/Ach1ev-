import React, { useState } from 'react';
import { SUBSCRIPTION_TIERS } from '../../data/subscriptionData';
import { SubscriptionTier } from '../../types';
import {
  Sparkles,
  Check,
  ShieldCheck,
  X,
  CreditCard,
  Zap,
  Star,
  CheckCircle2,
  Crown,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTierId?: string;
  onUpgradeTier?: (tierId: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTierId = 'free',
  onUpgradeTier,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTier, setActiveTier] = useState<string>(() => {
    return localStorage.getItem('medden_user_tier') || currentTierId;
  });
  const [upgradedFeedback, setUpgradedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectTier = (tier: SubscriptionTier) => {
    setActiveTier(tier.id);
    localStorage.setItem('medden_user_tier', tier.id);
    onUpgradeTier?.(tier.id);
    setUpgradedFeedback(tier.name);
    setTimeout(() => setUpgradedFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#fdfcfa] dark:bg-[#140e0a] border border-amber-900/20 dark:border-amber-500/25 shadow-2xl overflow-hidden text-stone-800 dark:text-stone-100 font-sans">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50/80 dark:bg-[#18110c]/95">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                <Crown className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                Ach1ev Academic Membership &amp; Subscriptions
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Choose the ideal tier for foundational study, clinical residency, or department research
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-[#251a12] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billing Toggle & Alert */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/60 dark:border-[#352317] bg-[#f9f8f4] dark:bg-[#160f0b]">
          {upgradedFeedback && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0" />
              <span>Subscription upgraded to <strong>{upgradedFeedback}</strong>! All features unlocked.</span>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              Billing Interval:
            </span>
            <div className="flex items-center p-1 rounded-xl bg-stone-200/80 dark:bg-[#231912]">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-[#140e0a] text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400'
                }`}
              >
                <span>Annual</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 font-mono">
                  Save 30%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Tiers Grid */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUBSCRIPTION_TIERS.map((tier) => {
              const isCurrent = activeTier === tier.id;
              const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
              const unit = billingCycle === 'annual' ? '/ year' : '/ month';

              return (
                <div
                  key={tier.id}
                  className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                    tier.highlight
                      ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                      : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d]'
                  }`}
                >
                  <div>
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          tier.highlight
                            ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                            : 'bg-stone-100 dark:bg-[#251a12] text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        {tier.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-[#8f5f2c] dark:text-amber-400 flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Active
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50">
                      {tier.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 min-h-[34px] leading-tight">
                      {tier.description}
                    </p>

                    {/* Price */}
                    <div className="my-4 pb-3 border-b border-stone-200 dark:border-[#352317]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                          {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                        </span>
                        {price > 0 && (
                          <span className="text-xs text-stone-500 dark:text-stone-400">
                            {unit}
                          </span>
                        )}
                      </div>
                      {billingCycle === 'annual' && price > 0 && (
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mt-0.5">
                          Approx ₹{Math.round(price / 12)} / month billed annually
                        </span>
                      )}
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 text-xs">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-[11px] leading-snug">
                          <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                          <span className="text-stone-700 dark:text-stone-300">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-3 border-t border-stone-100 dark:border-[#352317]">
                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => handleSelectTier(tier)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 cursor-default'
                          : tier.highlight
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : 'bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Current Active Plan</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>{price === 0 ? 'Downgrade to Free' : 'Activate Plan'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
