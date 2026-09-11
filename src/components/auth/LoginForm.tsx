import React, { useState } from 'react';
import { Mail, ArrowRight, Loader2, KeyRound, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';
import { PasswordField } from './PasswordField';
import { AuthError } from './AuthError';
import { AuthBranding } from './AuthBranding';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: string;
    isBlocked?: boolean;
  }>;
  onForgotPassword?: () => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoDirectory, setShowDemoDirectory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsBlocked(false);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await onSubmit({ email: cleanEmail, password });
      if (!res.success) {
        setErrorMessage(
          res.error || "We couldn't sign you in with those credentials. Please verify and try again."
        );
        setIsBlocked(!!res.isBlocked);
      }
    } catch (err: any) {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Agro2026!Secure');
    setErrorMessage(null);
    setIsBlocked(false);
  };

  const loadingActive = isLoading || isSubmitting;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-between h-full py-2">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-6">
          <AuthBranding />

          <div className="space-y-1.5 pt-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back.
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Sign in to manage operations, inventory, procurement, finance and distribution.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <AuthError
            message={errorMessage}
            isAccountBlocked={isBlocked}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Primary Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Work Email */}
          <div className="space-y-1.5">
            <label htmlFor="auth-email-input" className="block text-xs font-semibold text-slate-700">
              Work email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@agrodeliveries.co.ke"
                required
                disabled={loadingActive}
                autoComplete="email"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <PasswordField
              label="Password"
              id="auth-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              disabled={loadingActive}
            />

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loadingActive}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold tracking-wide shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loadingActive ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing you in...</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Enterprise Notice (Explicitly No Public Signup) */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
          <p className="text-[11px] text-slate-500">
            Internal Enterprise Portal. Authorized personnel only. Contact your system administrator to provision or update credentials.
          </p>
        </div>
      </div>

      {/* Internal Staff Quick Directory (For evaluation & verification of all 8 roles) */}
      <div className="pt-6 border-t border-slate-100 mt-4">
        <button
          type="button"
          onClick={() => setShowDemoDirectory(!showDemoDirectory)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized Internal Staff Accounts (Demo Passwords)</span>
          </span>
          {showDemoDirectory ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {showDemoDirectory && (
          <div className="mt-2.5 p-2.5 bg-slate-100/80 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
              Select pre-authorized role to fill credentials:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => fillCredentials('wanjiku.k@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">Wanjiku K.</div>
                  <div className="text-[10px] text-slate-500">Executive / Director</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('kevin.o@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">Kevin O.</div>
                  <div className="text-[10px] text-slate-500">Operations Manager</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('david.m@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">David M.</div>
                  <div className="text-[10px] text-slate-500">Administrator</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('samuel.k@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">Samuel K.</div>
                  <div className="text-[10px] text-slate-500">Storekeeper / Cold Chain</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('amina.h@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">Amina H.</div>
                  <div className="text-[10px] text-slate-500">Finance Manager</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('brian.m@agrodeliveries.co.ke')}
                className="flex items-center justify-between p-1.5 text-left rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-800">Brian M.</div>
                  <div className="text-[10px] text-slate-500">Sales Representative</div>
                </div>
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
            <p className="text-[9px] text-slate-500 pt-0.5 italic">
              Default demo staff password: <span className="font-mono font-semibold">Agro2026!Secure</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
