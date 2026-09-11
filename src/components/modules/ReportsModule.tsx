import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Download, 
  Printer, Calendar, Truck, Package, PieChart, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export const ReportsModule: React.FC = () => {
  const { orders, products, customers, invoices } = useApp();

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

  // Category distribution
  const categoryStats = [
    { category: 'Fresh Vegetables', share: 44, revenue: 'KES 420,000' },
    { category: 'Tubers & Roots', share: 26, revenue: 'KES 248,000' },
    { category: 'Fruits & Berries', share: 18, revenue: 'KES 171,000' },
    { category: 'Dairy & Eggs', share: 12, revenue: 'KES 114,000' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Executive Reports & Business Intelligence</h2>
          <p className="text-xs text-slate-500">Margin benchmarks, fresh produce throughput, on-time SLA metrics, and customer profitability</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as any)}
            className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <option value="today">Today's Dispatch</option>
            <option value="week">Current Week (W10)</option>
            <option value="month">Month to Date (March 2026)</option>
            <option value="quarter">Q1 2026</option>
          </select>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Distribution Sales</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">KES {totalSales.toLocaleString()}</p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">↑ 14.8% vs last period</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Blended Gross Margin</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">26.4%</p>
          <span className="text-xs text-slate-400 mt-1 block">Institutional target: 24% – 28%</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">On-Time Dawn Delivery SLA</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">98.2%</p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Target met (05:00 - 07:00 AM)</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cold Chain Spoilage Rate</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">1.8%</p>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Below 2.5% spoilage cap</span>
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Volume & Revenue Share by Produce Category
          </h3>
          <div className="space-y-4">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <span className="font-bold text-slate-900">{item.revenue} ({item.share}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sector Contribution */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Institutional Segment Margin Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { segment: 'Schools & Academies', margin: '27.8%', volume: '14,200 KG', color: 'bg-emerald-50 text-emerald-800' },
              { segment: 'Hospitals & Healthcare', margin: '29.1%', volume: '8,400 KG', color: 'bg-sky-50 text-sky-800' },
              { segment: 'Hotels & Hospitality', margin: '31.4%', volume: '6,100 KG', color: 'bg-amber-50 text-amber-800' },
              { segment: 'Restaurants & Cafes', margin: '24.2%', volume: '5,000 KG', color: 'bg-slate-100 text-slate-800' }
            ].map((seg, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900">{seg.segment}</p>
                  <p className="text-[11px] text-slate-500">Delivered Volume: {seg.volume}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded font-bold ${seg.color}`}>
                    {seg.margin} Margin
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
