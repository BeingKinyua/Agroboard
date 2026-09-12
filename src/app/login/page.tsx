'use client';

import dynamic from 'next/dynamic';

const LoginClient = dynamic(() => import('./LoginClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function LoginPage() {
  return <LoginClient />;
}
