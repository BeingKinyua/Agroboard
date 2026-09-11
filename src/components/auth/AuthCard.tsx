import React from 'react';
import { LoginForm } from './LoginForm';
import { AuthVisualPanel } from './AuthVisualPanel';

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
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-300/40 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
        {/* Left Authentication Form Panel (55% on desktop) */}
        <div className="lg:col-span-6 xl:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <LoginForm
            onSubmit={onLoginSubmit}
            onForgotPassword={onForgotPassword}
            isLoading={isLoading}
          />
        </div>

        {/* Right Visual Brand Panel (45% on desktop) */}
        <div className="lg:col-span-6 xl:col-span-6 p-3 sm:p-4 lg:p-4 bg-slate-50 flex items-center justify-center">
          <AuthVisualPanel />
        </div>
      </div>
    </div>
  );
};
