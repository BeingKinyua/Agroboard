import React from 'react';
import { AlertCircle, ShieldAlert, X } from 'lucide-react';

interface AuthErrorProps {
  message: string | null;
  onDismiss?: () => void;
  isAccountBlocked?: boolean;
}

export const AuthError: React.FC<AuthErrorProps> = ({
  message,
  onDismiss,
  isAccountBlocked = false
}) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in duration-200 ${
        isAccountBlocked
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-rose-50 border-rose-200 text-rose-900'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isAccountBlocked ? (
          <ShieldAlert className="w-4 h-4 text-amber-700" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-600" />
        )}
      </div>

      <div className="flex-1 space-y-1">
        <p className="font-semibold">
          {isAccountBlocked ? 'Access Denied' : 'Authentication Notice'}
        </p>
        <p className="text-[11px] leading-relaxed opacity-90">{message}</p>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
