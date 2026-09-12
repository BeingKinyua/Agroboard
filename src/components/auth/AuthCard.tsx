import React from 'react';
import { LoginForm } from './LoginForm';
import { AuthVisualPanel } from './AuthVisualPanel';
import { ShieldCheck } from 'lucide-react';

interface AuthCardProps {
  onLoginSubmit: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: string;
    isBlocked?: boolean;
  }>;
  onForgotPassword: () => void;
  isLoading?: boolean;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onLoginSubmit,
  onForgotPassword,
  isLoading,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/30 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[640px]">
        {/* Mobile/Small Tablet Compact Visual Banner */}
        <div className="lg:hidden relative h-36 sm:h-44 w-full overflow-hidden bg-slate-900 select-none">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
            alt="Agro-Deliveries Ke. Fresh Produce Operations"
            className="w-full h-full object-cover brightness-70 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-xs tracking-tight">Cold-Chain Network Live</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Enterprise Node</span>
            </div>
          </div>
        </div>

        {/* Authentication Form Panel */}
        <div className="lg:col-span-6 xl:col-span-6 p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <LoginForm
            onSubmit={onLoginSubmit}
            onForgotPassword={onForgotPassword}
            isLoading={isLoading}
          />
        </div>

        {/* Desktop Split Visual Brand Panel */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-6 p-3 sm:p-4 bg-slate-50 items-center justify-center">
          <AuthVisualPanel />
        </div>
      </div>
    </div>
  );
};
