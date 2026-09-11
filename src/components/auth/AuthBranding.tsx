import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';

interface AuthBrandingProps {
  size?: 'default' | 'compact';
}

export const AuthBranding: React.FC<AuthBrandingProps> = ({ size = 'default' }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
        <Sprout className="w-5 h-5 text-emerald-100" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black tracking-tight text-slate-900 uppercase">
            Agro-Deliveries
          </span>
          <span className="text-[11px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 tracking-wider">
            KE.
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <span>Business Operating System</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 flex items-center gap-0.5">
            <ShieldCheck className="w-3 h-3 inline" /> Enterprise
          </span>
        </div>
      </div>
    </div>
  );
};
