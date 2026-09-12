import React from 'react';
import { 
  TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  Wallet, ShieldCheck, ArrowRight, CheckCircle2, Clock, 
  AlertCircle, PackageCheck, UserCheck, Calendar, Activity, 
  ChevronRight, ArrowUpRight, DollarSign, Building2, ShoppingBag,
  Sparkles, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardModule: React.FC = () => {
  const { 
    currentUser, 
    orders, 
    inventoryItems, 
    deliveryRuns, 
    approvals, 
    invoices, 
    customers, 
    setActiveModule, 
    auditLogs,
    selectedBranch,
    setIsAiAssistantOpen
  } = useApp();

  // Metrics calculations
  const totalRevenueToday = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const activeRuns = deliveryRuns.filter(r => r.status === 'In Transit' || r.status === 'Loading');
  const criticalStockItems = inventoryItems.filter(i => i.status === 'Near Expiry' || i.quantityAvailable < 20);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome Banner & Command Context */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-xs border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {currentUser.roleTitle}
            </span>
            <span className="text-xs text-slate-400">· {selectedBranch.split(' ')[0]} Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Cold storage and dispatch routing are operating at 94% on-time efficiency. 
            {pendingApprovals.length > 0 && ` ${pendingApprovals.length} critical actions await your authorization.`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => setActiveModule('approvals')}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approvals ({pendingApprovals.length})</span>
            </button>
          )}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Ops Copilot</span>
          </button>
        </div>
      </div>

      {/* Critical Attention Bar (Operational Alerts) */}
      {(criticalStockItems.length > 0 || overdueInvoices.length > 0 || pendingApprovals.length > 0) && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="p-1.5 bg-amber-200/70 rounded-md text-amber-800 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Operational Alert: </span>
              <span>
                {criticalStockItems.length} produce batches require immediate inspection or refrigeration check. 
                {overdueInvoices.length > 0 && ` KES ${overdueAmount.toLocaleString()} overdue in customer receivables.`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {criticalStockItems.length > 0 && (
              <button
                onClick={() => setActiveModule('inventory')}
                className="font-semibold text-amber-900 hover:text-amber-950 underline text-xs"
              >
                Inspect Inventory
              </button>
            )}
            {overdueInvoices.length > 0 && (
              <>
                <span className="text-amber-400">•</span>
                <button
                  onClick={() => setActiveModule('finance')}
                  className="font-semibold text-amber-900 hover:text-amber-950 underline text-xs"
                >
                  View Overdue A/R
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Primary Operational KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Today's Active Orders"
          value={`KES ${totalRevenueToday.toLocaleString()}`}
          subtitle={`${orders.length} institutional orders scheduled`}
          icon={ShoppingCart}
          trend={{ value: '18.4%', isPositive: true, label: 'vs last week' }}
          accentColor="emerald"
          onClick={() => setActiveModule('orders')}
        />

        <StatCard
          title="Fleet Dispatch Status"
          value={`${activeRuns.length} Active Runs`}
          subtitle={`${deliveryRuns.length} distribution routes mapped`}
          icon={Truck}
          trend={{ value: '98.2%', isPositive: true, label: 'on-time rate' }}
          accentColor="sky"
          onClick={() => setActiveModule('deliveries')}
        />

        <StatCard
          title="Outstanding Receivables"
          value={`KES ${totalReceivables.toLocaleString()}`}
          subtitle={`KES ${overdueAmount.toLocaleString()} overdue (>30 days)`}
          icon={Wallet}
          trend={{ value: 'KES 250k', isPositive: false, label: 'overdue' }}
          accentColor="amber"
          onClick={() => setActiveModule('finance')}
        />

        <StatCard
          title="Stock & Cold Storage"
          value={`${inventoryItems.length} Active Batches`}
          subtitle={`${criticalStockItems.length} batches near expiry`}
          icon={AlertCircle}
          trend={{ value: `${criticalStockItems.length} alerts`, isPositive: false }}
          accentColor="rose"
          onClick={() => setActiveModule('inventory')}
        />
      </div>

      {/* Main Grid: Operational Workflows & Strategic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Core Operational Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Order Fulfillment Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Order Fulfillment Pipeline</h3>
                <p className="text-xs text-slate-500">Live order progression through warehouse gates</p>
              </div>
              <button
                onClick={() => setActiveModule('fulfillment')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
              >
                <span>Fulfillment Desk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Stage Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 my-4">
              {[
                { stage: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, border: 'border-slate-200 bg-slate-50/70 text-slate-800' },
                { stage: 'Picking', count: orders.filter(o => o.status === 'Picking').length, border: 'border-amber-200 bg-amber-50/60 text-amber-800' },
                { stage: 'Packed', count: orders.filter(o => o.status === 'Packed').length, border: 'border-sky-200 bg-sky-50/60 text-sky-800' },
                { stage: 'Dispatched', count: orders.filter(o => o.status === 'Dispatched').length, border: 'border-emerald-200 bg-emerald-50/60 text-emerald-800' }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-center transition-all ${item.border}`}>
                  <p className="text-xl sm:text-2xl font-bold tracking-tight">{item.count}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5 opacity-90">{item.stage}</p>
                </div>
              ))}
            </div>

            {/* Orders Table Snapshot (Responsive Container) */}
            <div className="overflow-x-auto w-full touch-pan-x -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-left text-xs min-w-[540px]">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-2.5">Order #</th>
                    <th className="pb-2.5">Customer & Institution</th>
                    <th className="pb-2.5">Slot</th>
                    <th className="pb-2.5">Items</th>
                    <th className="pb-2.5 text-right">Amount</th>
                    <th className="pb-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {orders.slice(0, 4).map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-900">{o.orderNumber}</td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{o.customerName}</div>
                        <div className="text-[11px] text-slate-400">{o.customerType}</div>
                      </td>
                      <td className="py-3 text-slate-500 whitespace-nowrap">{o.deliverySlot.split(' - ')[0]}</td>
                      <td className="py-3 text-slate-600 whitespace-nowrap">{o.items.length} produce types</td>
                      <td className="py-3 text-right font-semibold text-slate-900 whitespace-nowrap">
                        KES {o.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <StatusBadge status={o.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Runs Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delivery Routes Today</h3>
                <p className="text-xs text-slate-500">Live dispatch runs and vehicle assignments</p>
              </div>
              <button
                onClick={() => setActiveModule('deliveries')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
              >
                <span>Dispatch Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {deliveryRuns.map(run => (
                <div 
                  key={run.id} 
                  className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">{run.runCode}</span>
                        <span className="font-semibold text-xs text-slate-800">{run.routeZone}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Driver: {run.driverName} ({run.driverPhone}) · Vehicle: {run.vehicleRegistration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                    <span className="text-xs text-slate-500 font-medium">{run.orderCount} stops</span>
                    <StatusBadge status={run.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Alerts, Approvals & Live Activity Stream */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Pending Approvals</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingApprovals.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-1">
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No pending authorizations.</p>
              ) : (
                pendingApprovals.map(app => (
                  <div key={app.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-mono">{app.code}</span>
                      <StatusBadge status={app.priority} size="sm" />
                    </div>
                    <p className="text-xs text-slate-800 font-medium">{app.type}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{app.details}</p>
                    {app.amount && (
                      <p className="text-xs font-bold text-emerald-700">
                        KES {app.amount.toLocaleString()}
                      </p>
                    )}
                    <button
                      onClick={() => setActiveModule('approvals')}
                      className="mt-1 text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1 focus-visible:outline-none"
                    >
                      <span>Review & Authorize</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock & Expiry Alerts */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Cold Chain & Alerts</h3>
              </div>
              <button
                onClick={() => setActiveModule('inventory')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                All Inventory
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {criticalStockItems.slice(0, 3).map(it => (
                <div key={it.id} className="p-3 rounded-lg border border-rose-100 bg-rose-50/40 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{it.productName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{it.batchNumber}</p>
                    </div>
                    <StatusBadge status={it.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-rose-100/80">
                    <span>Avail: <strong className="text-slate-900">{it.quantityAvailable} {it.unit}</strong></span>
                    <span>Expires: <strong className="text-rose-700">{it.expiryDate}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Operational Audit Feed */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
              </div>
              <button
                onClick={() => setActiveModule('audit')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Audit Log
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs border-l-2 border-emerald-500 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  <span className="inline-block text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    {log.module} · {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
