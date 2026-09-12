import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Download, 
  Printer, Calendar, Truck, Package, PieChart, ShieldCheck,
  Percent, AlertCircle, Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../common/PageHeader';
import { StatCard } from '../common/StatCard';

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
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Executive Analytics & Operations BI"
        title="Executive Reports & Business Intelligence"
        description="Gross margin benchmarks, produce category volume throughput, on-time SLA fulfillment metrics, and segment profitability."
        primaryAction={{
          label: 'Print Briefing',
          icon: <Printer className="w-4 h-4" />,
          onClick: () => window.print(),
          variant: 'secondary'
        }}
      />

      {/* Date Range Selection Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <span className="text-xs font-semibold text-slate-700">Reporting Horizon & Cohort:</span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'today', label: "Today's Dispatch" },
            { id: 'week', label: 'Current Week (W10)' },
            { id: 'month', label: 'Month to Date (March)' },
            { id: 'quarter', label: 'Q1 2026 Fiscal' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setDateRange(r.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                dateRange === r.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Gross Distribution Sales"
          value={`KES ${totalSales.toLocaleString()}`}
          subtitle="Orders delivered & pending"
          icon={TrendingUp}
          trend={{ value: '14.8%', isPositive: true, label: 'vs last period' }}
          accentColor="emerald"
        />

        <StatCard
          title="Blended Gross Margin"
          value="26.4%"
          subtitle="Institutional target: 24% – 28%"
          icon={Percent}
          trend={{ value: '+1.2%', isPositive: true, label: 'above baseline' }}
          accentColor="sky"
        />

        <StatCard
          title="Dawn Delivery SLA"
          value="98.2%"
          subtitle="05:00 - 07:00 AM window"
          icon={Truck}
          trend={{ value: '98.2%', isPositive: true, label: 'on-time rate' }}
          accentColor="emerald"
        />

        <StatCard
          title="Cold Chain Spoilage Rate"
          value="1.8%"
          subtitle="Strict cap at 2.5%"
          icon={AlertCircle}
          trend={{ value: '-0.7%', isPositive: true, label: 'reduction' }}
          accentColor="emerald"
        />
      </div>

      {/* Category Performance Breakdown & Institutional Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Category Share */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Volume & Revenue Share by Produce Category</h3>
              <p className="text-xs text-slate-500">Distribution across major agricultural categories</p>
            </div>
            <PieChart className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.category}</span>
                  <span className="font-bold text-slate-900">{item.revenue} ({item.share}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Sector Contribution */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Institutional Segment Margin Breakdown</h3>
              <p className="text-xs text-slate-500">Realized margins and total delivered bulk volume</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3">
            {[
              { segment: 'Schools & Academies', margin: '27.8%', volume: '14,200 KG', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              { segment: 'Hospitals & Healthcare', margin: '29.1%', volume: '8,400 KG', color: 'bg-sky-50 text-sky-800 border-sky-200' },
              { segment: 'Hotels & Hospitality', margin: '31.4%', volume: '6,100 KG', color: 'bg-amber-50 text-amber-800 border-amber-200' },
              { segment: 'Restaurants & Cafes', margin: '24.2%', volume: '5,000 KG', color: 'bg-slate-100 text-slate-800 border-slate-200' }
            ].map((seg, idx) => (
              <div key={idx} className="p-3.5 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                <div>
                  <p className="font-bold text-slate-900">{seg.segment}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Delivered Bulk Volume: {seg.volume}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full font-bold border text-xs ${seg.color}`}>
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
