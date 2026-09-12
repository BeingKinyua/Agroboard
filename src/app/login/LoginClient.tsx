'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/context/AppContext';
import { LoginPage } from '@/components/auth/LoginPage';

function LoginInner() {
  const { isAuthenticated, authLoading, login } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
          <div className="w-4 h-4 rounded-full bg-emerald-400" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-white tracking-wide">AGRO-DELIVERIES KE. BOS</p>
          <p className="text-[11px] text-slate-400">Verifying secure enterprise session...</p>
        </div>
      </div>
    );
  }

  return (
    <LoginPage
      onLogin={async (credentials) => {
        const res = await login(credentials);
        if (res.success) {
          router.push('/');
        }
        return res;
      }}
    />
  );
}

export default function LoginClient() {
  return (
    <AppProvider>
      <LoginInner />
    </AppProvider>
  );
}
