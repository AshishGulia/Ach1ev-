import React, { useState, useEffect } from 'react';
import { useAuth, SocialProviderId } from '../../contexts/AuthContext';
import { getSupabaseConfig, saveRuntimeSupabaseConfig } from '../../lib/supabaseClient';
import {
  getGoogleClientId,
  saveRuntimeGoogleClientId,
  prefetchGoogleOAuth,
} from '../../services/googleDriveService';
import { AchievBrand, ACHIEV_LOGO_URL } from '../common/AchievBrand';
import {
  Database,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Building2,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Phone,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface AuthPortalProps {
  isModal?: boolean;
  isDarkMode: boolean;
  onToggleDarkMode?: () => void;
  onClose?: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+81', label: '🇯🇵 +81' },
  { code: '+977', label: '🇳🇵 +977' },
  { code: '+880', label: '🇧🇩 +880' },
];

const GoogleLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
    />
  </svg>
);

const AppleLogo = () => (
  <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M1 13h10v10H1z" />
    <path fill="#7fba00" d="M13 1h10v10H13z" />
    <path fill="#ffb900" d="M13 13h10v10H13z" />
  </svg>
);

export const AuthPortal: React.FC<AuthPortalProps> = ({
  isModal = false,
  onClose,
}) => {
  // Opening HTML splash & Login Portal always stay Dark regardless of dashboard Light default
  const isDarkMode = true;

  const {
    supabaseReady,
    authRedirectError,
    clearAuthRedirectError,
    signInWithEmail,
    signUpWithEmail,
    signInWithSocial,
    signInWithPhoneOtp,
    verifyPhoneOtp,
    resetPassword,
    refreshAuthClient,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Contact Number + OTP state
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const [submitting, setSubmitting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Luxury Dark-Chocolate Opening Intro Animation (3 seconds total, no Skip button)
  const [showIntro, setShowIntro] = useState<boolean>(!isModal);

  useEffect(() => {
    if (!showIntro) return;
    const tEnd = window.setTimeout(() => setShowIntro(false), 3000);
    return () => {
      window.clearTimeout(tEnd);
    };
  }, [showIntro]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setTimeout(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    if (authRedirectError) {
      setErrorMsg(authRedirectError);
      clearAuthRedirectError();
    }
  }, [authRedirectError, clearAuthRedirectError]);

  // Optional in-app Supabase & Google OAuth credential configurator for quick local/preview testing
  const currentCfg = getSupabaseConfig();
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [cfgUrl, setCfgUrl] = useState(currentCfg.url);
  const [cfgKey, setCfgKey] = useState(currentCfg.anonKey);
  const [cfgGoogleId, setCfgGoogleId] = useState(() => getGoogleClientId());

  const handleSocialAuth = async (provider: SocialProviderId) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setSubmitting(provider);
    const { error } = await signInWithSocial(provider, false);
    setSubmitting(null);
    if (error) setErrorMsg(error);
  };

  const fullPhone = `${countryCode}${phoneDigits.replace(/[^\d]/g, '')}`;

  const handleSendPhoneOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const digitsOnly = phoneDigits.replace(/[^\d]/g, '');
    if (digitsOnly.length < 7) {
      setErrorMsg('Please enter a valid mobile number (without country code).');
      return;
    }
    setSubmitting('phone-send');
    const { error } = await signInWithPhoneOtp(fullPhone);
    setSubmitting(null);
    if (error) {
      setErrorMsg(error);
    } else {
      setOtpSent(true);
      setResendCooldown(30);
      setSuccessMsg(`Verification code sent via SMS to ${fullPhone}.`);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    if (otpCode.trim().length < 4) {
      setErrorMsg('Enter the 6-digit OTP code sent to your mobile number.');
      return;
    }
    setSubmitting('phone-verify');
    const { error } = await verifyPhoneOtp(fullPhone, otpCode.trim());
    setSubmitting(null);
    if (error) {
      setErrorMsg(error);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your academic or personal email address.');
      return;
    }

    if (mode === 'forgot') {
      setSubmitting('email');
      const { error } = await resetPassword(email);
      setSubmitting(null);
      if (error) setErrorMsg(error);
      else setSuccessMsg('Password reset instructions have been sent to your email.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setSubmitting('email');
    if (mode === 'signin') {
      const { error } = await signInWithEmail(email, password);
      setSubmitting(null);
      if (error) setErrorMsg(error);
    } else {
      if (!fullName.trim()) {
        setSubmitting(null);
        setErrorMsg('Please enter your full name or clinical title.');
        return;
      }
      const { error, needsConfirmation } = await signUpWithEmail({
        email,
        password,
        fullName,
        institution,
      });
      setSubmitting(null);
      if (error) setErrorMsg(error);
      else if (needsConfirmation) {
        setSuccessMsg('Account created! Check your inbox to verify your email and sign in.');
        setMode('signin');
      }
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (cfgUrl.trim() && cfgKey.trim()) {
      saveRuntimeSupabaseConfig(cfgUrl, cfgKey);
    }
    if (cfgGoogleId.trim()) {
      saveRuntimeGoogleClientId(cfgGoogleId);
      void prefetchGoogleOAuth();
    }
    refreshAuthClient();
    setShowConfigDrawer(false);
    setErrorMsg(null);
    setSuccessMsg('Cloud & OAuth credentials saved in browser. You can sign in now.');
  };

  return (
    <div
      className={`${
        isModal
          ? 'fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto'
          : 'min-h-screen w-full relative overflow-y-auto flex items-center justify-center p-4 sm:p-8'
      } transition-colors duration-300 text-[#efe4d4]`}
      style={{
        background:
          'radial-gradient(ellipse 85% 75% at 22% 24%, #261209 0%, #150904 52%, #0c0402 100%)',
      }}
    >
      {/* 3-SECOND BRAND REVEAL INTRO (Always Dark, No Skip Button) */}
      {showIntro && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse 90% 80% at 50% 42%, #2b1309 0%, #170804 50%, #090301 100%)',
            animation: 'loginIntroFadeOut 0.45s ease-in 2.55s both',
          }}
        >
          {/* Horizontal Logo + Name Lockup */}
          <div
            className="relative flex items-center justify-center px-6 py-8"
            style={{ animation: 'loginFinalReveal 0.65s cubic-bezier(0.22, 1, 0.36, 1) both' }}
          >
            <span
              className="relative inline-block select-none"
              style={{ ['--achiev-mask' as string]: `url(${ACHIEV_LOGO_URL})` } as React.CSSProperties}
            >
              <img
                src={ACHIEV_LOGO_URL}
                alt="Ach1ev — Settle Ideas"
                draggable={false}
                className="h-24 sm:h-32 md:h-36 w-auto max-w-[88vw] object-contain select-none achiev-brand-clean"
              />
              <span className="achiev-masked-glare achiev-masked-glare-intro" aria-hidden="true" />
            </span>
          </div>
        </div>
      )}

      {/* Ambient Subtle Warm Orbs behind the frosted glass box */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-28 -left-20 w-[440px] h-[440px] rounded-full blur-3xl animate-pulse bg-[#5c2d16] opacity-30"
          style={{ animationDuration: '9s' }}
        />
        <div
          className="absolute top-1/4 right-[8%] w-[360px] h-[360px] rounded-full blur-3xl animate-pulse bg-[#6b3a1c] opacity-20"
          style={{ animationDuration: '11s' }}
        />
        <div
          className="absolute -bottom-32 -right-16 w-[480px] h-[480px] rounded-full blur-3xl animate-pulse bg-[#3d1c0d] opacity-25"
          style={{ animationDuration: '12s' }}
        />
      </div>

      {/* Modal close button only */}
      {isModal && onClose && (
        <div className="fixed top-4 right-4 z-50 flex items-center">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl backdrop-blur-xl transition-all cursor-pointer shadow-lg bg-[#1a0d07]/80 text-[#efe4d4] hover:bg-[#2a150b]"
            title="Close Authentication Portal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Simple Clean Split Layout: Brand Logo & Name Beside Bevelled Frosted-Glass Login Box */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto">
        {/* Left: Frameless Brand Panel */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start justify-center text-center lg:text-left p-4 sm:p-6 relative">
          <div className="flex flex-col items-center lg:items-start gap-5 w-full">
            <AchievBrand
              variant="lockup"
              isDarkMode={isDarkMode}
              imgClassName="h-20 sm:h-24 md:h-[104px] w-auto max-w-full"
            />

            <p
              className="leading-relaxed max-w-xs italic font-serif text-[#c9b08a] opacity-75"
              style={{ fontSize: 'clamp(0.82rem, 1.5vw, 1rem)' }}
            >
              A quiet space to settle thoughts, write clinical notes, and carry your study desk everywhere.
            </p>
          </div>
        </div>

        {/* Right: Borderless Frosted-Glass Bevelled Login Box (Always Dark) */}
        <div
          className="lg:col-span-7 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl backdrop-saturate-150 flex flex-col justify-between transition-all"
          style={{
            background:
              'linear-gradient(160deg, rgba(36, 18, 10, 0.62) 0%, rgba(18, 8, 4, 0.5) 100%)',
            boxShadow:
              'inset 0 1.5px 1px rgba(255, 224, 178, 0.14), inset 0 -2px 6px rgba(0, 0, 0, 0.45), 0 24px 60px rgba(0, 0, 0, 0.55)',
          }}
        >
          <div>
            {/* Forgot password hint */}
            {mode === 'forgot' && (
              <p className="text-xs opacity-70 mb-4">Receive a secure recovery link in your inbox.</p>
            )}

            {/* Supabase / OAuth Runtime Key Configurator */}
            {(!supabaseReady || showConfigDrawer) && (
              <div className="mb-4 p-3 rounded-2xl border text-xs flex flex-col gap-2 bg-amber-950/30 border-amber-700/40 text-amber-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-amber-500" />
                    {supabaseReady ? 'Runtime Cloud & OAuth Keys' : 'Supabase / OAuth keys not set in .env yet'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowConfigDrawer(!showConfigDrawer)}
                    className="underline font-bold cursor-pointer shrink-0"
                  >
                    {showConfigDrawer ? 'Hide Config' : 'Configure Keys'}
                  </button>
                </div>
                {showConfigDrawer && (
                  <form onSubmit={handleSaveSupabaseConfig} className="space-y-2 pt-1">
                    <input
                      type="url"
                      placeholder="https://your-project.supabase.co"
                      value={cfgUrl}
                      onChange={(e) => setCfgUrl(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none bg-[#110c09] border-[#382518] text-[#efe4d4]"
                    />
                    <input
                      type="password"
                      placeholder="Supabase anon public key"
                      value={cfgKey}
                      onChange={(e) => setCfgKey(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none bg-[#110c09] border-[#382518] text-[#efe4d4]"
                    />
                    <input
                      type="text"
                      placeholder="Google OAuth Client ID (xxx.apps.googleusercontent.com)"
                      value={cfgGoogleId}
                      onChange={(e) => setCfgGoogleId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border text-xs outline-none font-mono bg-[#110c09] border-[#382518] text-[#efe4d4]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-amber-600 text-[#110c09] font-semibold text-xs hover:bg-amber-500 cursor-pointer"
                    >
                      Save Browser Keys
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Status Banners */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-[#6e171b]/35 border border-[#962d32]/50 text-[#f3b6b8] text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
                {errorMsg.toLowerCase().includes('client id') && (
                  <div className="pl-6">
                    <button
                      type="button"
                      onClick={() => setShowConfigDrawer(true)}
                      className="px-2.5 py-1 rounded-lg border border-current/30 font-semibold text-[11px] cursor-pointer hover:opacity-80"
                    >
                      Enter Google Client ID
                    </button>
                  </div>
                )}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-200 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Multi-Provider Social Auth Buttons (Drive checkbox removed — Drive connects inside Cloud & Drive) */}
            {mode !== 'forgot' && (
              <div className="space-y-2.5 mb-3">
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={!!submitting}
                    onClick={() => handleSocialAuth('google')}
                    className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-[#efe4d4]"
                    style={{
                      background: 'linear-gradient(180deg, rgba(48, 30, 20, 0.85) 0%, rgba(28, 17, 11, 0.9) 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,224,178,0.16), inset 0 -1.5px 0 rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.28)',
                    }}
                  >
                    <GoogleLogo />
                    <span>{submitting === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={!!submitting}
                      onClick={() => handleSocialAuth('apple')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-[#efe4d4]"
                      style={{
                        background: 'linear-gradient(180deg, rgba(48, 30, 20, 0.85) 0%, rgba(28, 17, 11, 0.9) 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,224,178,0.16), inset 0 -1.5px 0 rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.28)',
                      }}
                    >
                      <AppleLogo />
                      <span>{submitting === 'apple' ? 'Connecting...' : 'Apple'}</span>
                    </button>

                    <button
                      type="button"
                      disabled={!!submitting}
                      onClick={() => handleSocialAuth('azure')}
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-[#efe4d4]"
                      style={{
                        background: 'linear-gradient(180deg, rgba(48, 30, 20, 0.85) 0%, rgba(28, 17, 11, 0.9) 100%)',
                        boxShadow: 'inset 0 1px 0 rgba(255,224,178,0.16), inset 0 -1.5px 0 rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.28)',
                      }}
                    >
                      <MicrosoftLogo />
                      <span>{submitting === 'azure' ? 'Connecting...' : 'Microsoft'}</span>
                    </button>
                  </div>
                </div>

                {/* Auth Method Switcher: Email & Password vs Contact Number + OTP */}
                <div className="pt-1">
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#120a06]/80 border border-[#3d2517]">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('email');
                        setErrorMsg(null);
                      }}
                      className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        authMethod === 'email'
                          ? 'bg-[#e8cfab] text-[#110c09] shadow-xs'
                          : 'text-[#bfa78a] hover:text-[#efe4d4]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email &amp; Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMethod('phone');
                        setErrorMsg(null);
                      }}
                      className={`py-1.5 px-3 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        authMethod === 'phone'
                          ? 'bg-[#e8cfab] text-[#110c09] shadow-xs'
                          : 'text-[#bfa78a] hover:text-[#efe4d4]'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone + OTP</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* METHOD 1: EMAIL & PASSWORD / SIGNUP / FORGOT FORM */}
            {(authMethod === 'email' || mode === 'forgot') && (
              <form onSubmit={handleSubmitForm} className="space-y-3">
                {mode !== 'forgot' && (
                  <div className="flex items-center justify-between text-[11px] text-[#c9b08a]">
                    <span>{mode === 'signin' ? 'Sign in with email' : 'Create new account'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setErrorMsg(null);
                        setSuccessMsg(null);
                      }}
                      className="text-amber-400 hover:underline font-semibold cursor-pointer"
                    >
                      {mode === 'signin' ? 'New here? Create account' : 'Already have an account? Sign in'}
                    </button>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1 opacity-85">
                        Full Name / Title
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
                        <input
                          type="text"
                          placeholder="Dr. Aarav Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/80 text-[#efe4d4] placeholder-[#8b735c]"
                          style={{
                            boxShadow:
                              'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1 opacity-85">
                        Medical School / Hospital
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
                        <input
                          type="text"
                          placeholder="AIIMS / Johns Hopkins"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/80 text-[#efe4d4] placeholder-[#8b735c]"
                          style={{
                            boxShadow:
                              'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold block mb-1 opacity-85">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
                    <input
                      type="email"
                      placeholder="scholar@medschool.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/80 text-[#efe4d4] placeholder-[#8b735c]"
                      style={{
                        boxShadow:
                          'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                      }}
                      required
                    />
                  </div>
                </div>

                {mode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold opacity-85">Password</label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode('forgot');
                            setErrorMsg(null);
                          }}
                          className="text-[11px] font-medium text-amber-400 hover:underline cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/80 text-[#efe4d4] placeholder-[#8b735c]"
                        style={{
                          boxShadow:
                            'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-55 hover:opacity-100 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!submitting}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(180deg, rgba(168, 108, 62, 0.92) 0%, rgba(126, 74, 38, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow:
                      'inset 0 1.5px 1px rgba(255, 236, 202, 0.5), inset 0 -2px 2px rgba(48, 20, 6, 0.35), 0 10px 24px rgba(132, 84, 42, 0.32)',
                    border: 'none',
                  }}
                >
                  {mode === 'forgot' ? (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{submitting === 'email' ? 'Sending Reset Link...' : 'Send Reset Link'}</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {submitting === 'email'
                          ? 'Authenticating...'
                          : mode === 'signin'
                          ? 'Sign In'
                          : 'Create Account'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {mode === 'forgot' && (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="w-full text-center text-xs font-medium opacity-75 hover:opacity-100 cursor-pointer pt-1"
                  >
                    Back to Sign In
                  </button>
                )}
              </form>
            )}

            {/* METHOD 2: CONTACT NUMBER + SMS OTP VERIFICATION */}
            {authMethod === 'phone' && mode !== 'forgot' && (
              <form
                onSubmit={otpSent ? handleVerifyPhoneOtp : handleSendPhoneOtp}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold block mb-1 opacity-85">
                    Contact Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      disabled={otpSent}
                      aria-label="Country Code"
                      className="px-2.5 py-2.5 rounded-xl text-xs outline-none bg-[#120c08]/85 text-[#efe4d4] border border-[#3d2517] focus:ring-2 focus:ring-amber-500/40 cursor-pointer shrink-0 disabled:opacity-65"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#180d07] text-[#efe4d4]">
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-45" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        value={phoneDigits}
                        disabled={otpSent}
                        onChange={(e) => setPhoneDigits(e.target.value.replace(/[^\d\s-]/g, ''))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/80 text-[#efe4d4] placeholder-[#8b735c] disabled:opacity-65"
                        style={{
                          boxShadow:
                            'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold opacity-85 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>6-Digit OTP Verification Code</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtpCode('');
                          setErrorMsg(null);
                          setSuccessMsg(null);
                        }}
                        className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                      >
                        Change number
                      </button>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit SMS OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-mono tracking-[0.35em] text-center outline-none transition-all focus:ring-2 focus:ring-amber-500/40 bg-[#120c08]/90 text-[#efe4d4] placeholder-[#8b735c] placeholder:tracking-normal"
                      style={{
                        boxShadow:
                          'inset 0 1.5px 3px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,224,178,0.08)',
                      }}
                      required
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#c9b08a]">
                      <span>SMS sent to {fullPhone}</span>
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || submitting === 'phone-send'}
                        onClick={() => handleSendPhoneOtp()}
                        className="flex items-center gap-1 text-amber-400 hover:underline disabled:opacity-45 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>
                          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!submitting}
                  className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(180deg, rgba(168, 108, 62, 0.92) 0%, rgba(126, 74, 38, 0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow:
                      'inset 0 1.5px 1px rgba(255, 236, 202, 0.5), inset 0 -2px 2px rgba(48, 20, 6, 0.35), 0 10px 24px rgba(132, 84, 42, 0.32)',
                    border: 'none',
                  }}
                >
                  <span>
                    {submitting === 'phone-send'
                      ? 'Sending SMS OTP...'
                      : submitting === 'phone-verify'
                      ? 'Verifying OTP...'
                      : otpSent
                      ? 'Verify & Enter Ach1ev'
                      : 'Send OTP'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPortal;

