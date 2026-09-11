import React from 'react';
import { Sprout, Layers, Truck, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const AuthVisualPanel: React.FC = () => {
  return (
    <div className="relative h-full min-h-[460px] lg:min-h-[600px] w-full rounded-2xl lg:rounded-3xl overflow-hidden bg-slate-900 flex flex-col justify-between p-6 lg:p-8 text-white select-none">
      {/* Background Image: Clean, high-resolution fresh produce & agricultural logistics */}
      <img
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=85"
        alt="Agro-Deliveries Ke. Fresh Produce Operations"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 filter brightness-[0.72] contrast-[1.08] transition-transform duration-700 hover:scale-100"
      />

      {/* Atmospheric Vignette & Contrast Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/35 to-slate-950/60 pointer-events-none" />
      <div className="absolute inset-0 bg-emerald-950/20 mix-blend-multiply pointer-events-none" />

      {/* Top Floating Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-medium text-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] tracking-wide">Cold-Chain Network Live</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Internal Access Only</span>
        </div>
      </div>

      {/* Floating Contextual Labels (Inspired by the Reference Card Layout) */}
      <div className="relative z-10 my-auto space-y-3 max-w-xs">
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg transform hover:-translate-y-0.5 transition-transform">
          <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sourcing</div>
            <div className="font-semibold text-white">Fresh produce cooperatives</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg ml-6 transform hover:-translate-y-0.5 transition-transform">
          <div className="p-1 rounded-lg bg-teal-500/20 text-teal-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Inventory</div>
            <div className="font-semibold text-white">Real-time batch & cold storage</div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/70 backdrop-blur-md border border-white/15 text-xs text-white shadow-lg transform hover:-translate-y-0.5 transition-transform">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Distribution</div>
            <div className="font-semibold text-white">Institutional delivery routes</div>
          </div>
        </div>
      </div>

      {/* Bottom Panel Caption & Operational Values */}
      <div className="relative z-10 space-y-2 pt-4 border-t border-white/15">
        <div className="flex items-baseline justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white tracking-tight">
              Enterprise Supply Infrastructure
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
              Connecting Kenyan horticultural farmers directly with institutional schools, hospitals, hotels, and corporate hubs.
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors inline-block text-white">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-emerald-300 font-semibold tracking-wider uppercase pt-1">
          <span>Sourcing</span>
          <span>•</span>
          <span>Distribution</span>
          <span>•</span>
          <span>Operations</span>
          <span>•</span>
          <span>Growth</span>
        </div>
      </div>
    </div>
  );
};
