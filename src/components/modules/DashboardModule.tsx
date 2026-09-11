import React from 'react';
import { 
  TrendingUp, ShoppingCart, Truck, AlertTriangle, 
  Wallet, ShieldCheck, ArrowRight, CheckCircle2, Clock, 
  AlertCircle, PackageCheck, UserCheck, Calendar, Activity, 
  ChevronRight, ArrowUpRight, DollarSign, Building2, ShoppingBag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';

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
    auditLogs 
  } = useApp();

  // Metrics calculations
  const totalRevenueToday = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'Overdue');
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const activeRuns = deliveryRuns.filter(r => r.status === 'In Transit' || r.status === 'Loading');
  const criticalStockItems = inventoryItems.filter(i => i.status === 'Near Expiry' || i.quantityAvailable < 20);

  const isExecutive = currentUser.role === 'executive' || currentUser.role === 'admin';
  const isOperations = currentUser.role === 'operations_manager' || currentUser.role === 'storekeeper';

  return (
    <div className="space-y-6">
      {/* Role Banner & Attention Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              {currentUser.roleTitle}
            </Badge>
            <span className="text-xs text-slate-400">· Today's Operational Briefing</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Nairobi Central Cold Storage & Dispatch are running at 94% on-time delivery. 
            {pendingApprovals.length > 0 && ` You have ${pendingApprovals.length} critical approvals requiring action.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingApprovals.length > 0 && (
            <button
              onClick={() => setActiveModule('approvals')}
              className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Review Approvals ({pendingApprovals.length})</span>
            </button>
          )}
          <button
            onClick={() => setActiveModule('orders')}
            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Live Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical Attention Bar (What needs attention now) */}
      {(criticalStockItems.length > 0 || overdueInvoices.length > 0 || pendingApprovals.length > 0) && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-200/60 rounded-md text-amber-800 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Attention Required: </span>
              <span>
                {criticalStockItems.length} produce batches nearing expiry or critical stock level. 
                {overdueInvoices.length > 0 && ` KES ${overdueAmount.toLocaleString()} overdue in customer receivables.`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {criticalStockItems.length > 0 && (
              <button
                onClick={() => setActiveModule('inventory')}
                className="underline font-semibold hover:text-amber-950"
              >
                Inspect Inventory
              </button>
            )}
            {overdueInvoices.length > 0 && (
              <span className="text-amber-300">|</span>
            )}
            {overdueInvoices.length > 0 && (
              <button
                onClick={() => setActiveModule('finance')}
                className="underline font-semibold hover:text-amber-950"
              >
                View Overdue A/R
              </button>
            )}
          </div>
        </div>
      )}

      {/* Primary KPI Grid (Adapts based on role emphasis) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Active Orders"
          value={`KES ${totalRevenueToday.toLocaleString()}`}
          subtitle={`${orders.length} orders scheduled for fulfillment`}
          icon={ShoppingCart}
          trend={{ value: '18.4%', isPositive: true, label: 'vs last week' }}
          accentColor="emerald"
          onClick={() => setActiveModule('orders')}
        />

        <StatCard
          title="Fleet Dispatch Status"
          value={`${activeRuns.length} Active Runs`}
          subtitle={`${deliveryRuns.length} total delivery routes planned`}
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
          subtitle={`${criticalStockItems.length} batches nearing expiry`}
          icon={AlertCircle}
          trend={{ value: `${criticalStockItems.length} alert`, isPositive: false }}
          accentColor="rose"
          onClick={() => setActiveModule('inventory')}
        />
      </div>

      {/* Main Grid: Operational Workflows & Strategic Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Core Operational Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Order Fulfillment Pipeline */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Order Fulfillment Pipeline</h3>
                <p className="text-xs text-slate-500">Live progression from receipt to dispatch</p>
              </div>
              <button
                onClick={() => setActiveModule('fulfillment')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Fulfillment Workspace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Stages */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
              {[
                { stage: 'Confirmed', count: orders.filter(o => o.status === 'Confirmed').length, color: 'border-slate-300 text-slate-700' },
                { stage: 'Picking', count: orders.filter(o => o.status === 'Picking').length, color: 'border-amber-400 text-amber-700 bg-amber-50/40' },
                { stage: 'Packed', count: orders.filter(o => o.status === 'Packed').length, color: 'border-blue-400 text-blue-700 bg-blue-50/40' },
                { stage: 'Dispatched', count: orders.filter(o => o.status === 'Dispatched').length, color: 'border-emerald-500 text-emerald-700 bg-emerald-50/40' }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-center ${item.color}`}>
                  <p className="text-2xl font-bold">{item.count}</p>
                  <p className="text-xs font-medium uppercase tracking-wider mt-0.5">{item.stage}</p>
                </div>
              ))}
            </div>

            {/* Orders Table Snapshot */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-2">Order #</th>
                    <th className="pb-2">Customer & Institution</th>
                    <th className="pb-2">Slot</th>
                    <th className="pb-2">Items</th>
                    <th className="pb-2 text-right">Amount</th>
                    <th className="pb-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.slice(0, 4).map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-800">{o.orderNumber}</td>
                      <td className="py-3">
                        <div className="font-medium text-slate-900">{o.customerName}</div>
                        <div className="text-[11px] text-slate-400">{o.customerType}</div>
                      </td>
                      <td className="py-3 text-slate-500">{o.deliverySlot.split(' - ')[0]}</td>
                      <td className="py-3 text-slate-600">{o.items.length} produce types</td>
                      <td className="py-3 text-right font-medium text-slate-900">
                        KES {o.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <Badge 
                          variant={
                            o.status === 'Delivered' ? 'success' :
                            o.status === 'Dispatched' ? 'sky' :
                            o.status === 'Picking' || o.status === 'Packed' ? 'amber' : 'neutral'
                          } 
                          size="sm"
                        >
                          {o.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delivery Runs Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delivery Routes Today</h3>
                <p className="text-xs text-slate-500">Live dispatch runs and vehicle assignments</p>
              </div>
              <button
                onClick={() => setActiveModule('deliveries')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Dispatch Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {deliveryRuns.map(run => (
                <div key={run.id} className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-slate-500">{run.orderCount} stops</span>
                    <Badge 
                      variant={
                        run.status === 'Completed' ? 'success' :
                        run.status === 'In Transit' ? 'sky' : 'amber'
                      }
                      size="sm"
                    >
                      {run.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Alerts, Approvals & Live Activity Stream */}
        <div className="space-y-6">
          {/* Pending Approvals Widget */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Pending Approvals</h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingApprovals.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {pendingApprovals.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No pending approvals.</p>
              ) : (
                pendingApprovals.map(app => (
                  <div key={app.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{app.code}</span>
                      <Badge variant={app.priority === 'Urgent' ? 'danger' : 'amber'} size="sm">
                        {app.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">{app.type}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{app.details}</p>
                    {app.amount && (
                      <p className="text-xs font-bold text-emerald-700 mt-1">
                        KES {app.amount.toLocaleString()}
                      </p>
                    )}
                    <button
                      onClick={() => setActiveModule('approvals')}
                      className="mt-2 text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      Review & Authorize <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock & Expiry Alerts */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Cold Chain & Expiry Alerts</h3>
              </div>
              <button
                onClick={() => setActiveModule('inventory')}
                className="text-xs text-emerald-700 font-medium hover:underline"
              >
                All Inventory
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {criticalStockItems.slice(0, 3).map(it => (
                <div key={it.id} className="p-3 rounded-lg border border-rose-100 bg-rose-50/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{it.productName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{it.batchNumber}</p>
                    </div>
                    <Badge variant="danger" size="sm">{it.status}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>Avail: <strong className="text-slate-900">{it.quantityAvailable} {it.unit}</strong></span>
                    <span>Expires: <strong className="text-rose-700">{it.expiryDate}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Operational Audit Feed */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">Live Activity Feed</h3>
              </div>
              <button
                onClick={() => setActiveModule('audit')}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Audit Log
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs border-l-2 border-slate-200 pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{log.details}</p>
                  <span className="inline-block text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded">
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
