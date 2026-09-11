import React, { useState } from 'react';
import { AuthCard } from './AuthCard';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Shield, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: string;
    isBlocked?: boolean;
  }>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await onLogin(credentials);
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 relative flex flex-col justify-between p-4 sm:p-6 lg:p-10 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Restrained Atmospheric Background Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Subtle Status Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 text-[11px] text-slate-500 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-700">Agro-Deliveries Ke. Gateway</span>
          <span className="text-slate-300">•</span>
          <span className="hidden sm:inline text-slate-500">Node: Nairobi-Central-01</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-slate-600 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted Session (TLS 1.3 / Supabase SSR)</span>
          </span>
        </div>
      </header>

      {/* Center Floating Split Card Container */}
      <main className="w-full my-auto py-6 relative z-10">
        <AuthCard
          onLoginSubmit={handleLoginSubmit}
          onForgotPassword={() => setIsForgotModalOpen(true)}
          isLoading={isLoading}
        />
      </main>

      {/* Footer Credentials & Compliance Line */}
      <footer className="w-full max-w-5xl mx-auto text-center py-2 text-[11px] text-slate-400 space-y-1 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>&copy; {new Date().getFullYear()} Agro-Deliveries Ke. All rights reserved.</span>
          <span>•</span>
          <span>Authoritative Role-Based Access Control (RBAC)</span>
          <span>•</span>
          <span>Internal Distribution System</span>
        </div>
      </footer>

      {/* Forgot Password Flow Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
