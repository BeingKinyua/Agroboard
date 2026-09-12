import React from 'react';
import { AlertCircle, RefreshCw, ArrowLeft, Home } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Operation Could Not Complete',
  message = "An unexpected error occurred while communicating with the enterprise service. Please try again or switch facility node.",
  onRetry,
  onSecondaryAction,
  secondaryActionLabel = 'Return to Dashboard',
  className = '',
}) => {
  return (
    <div className={`p-8 sm:p-12 bg-white rounded-2xl border border-rose-200 shadow-xs max-w-lg mx-auto text-center space-y-4 my-8 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">{message}</p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}

        {onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{secondaryActionLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
};
