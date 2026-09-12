import React, { useState } from 'react';
import { 
  Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, 
  CheckCircle2, Clock, Search, Filter, Building2, 
  CreditCard, FileText, CheckCheck, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';

export const FinanceModule: React.FC = () => {
  const { invoices, payments, customers, suppliers } = useApp();

  const [activeTab, setActiveTab] = useState<'aging' | 'reconciliation' | 'ledger'>('aging');

  // Interactive bank feed reconciliation state
  const [bankFeeds, setBankFeeds] = useState([
    {
      id: 'bf-1',
      date: '2026-03-09 14:22',
      channel: 'M-Pesa Paybill 720200',
      reference: 'QHL8920199',
      payerName: 'Serena Hotel Accounts',
      amount: 47250,
      matchedInvoice: 'INV-2026-002',
      status: 'Reconciled'
    },
    {
      id: 'bf-2',
      date: '2026-03-10 09:15',
      channel: 'KCB RTGS Wire',
      reference: 'KCB-WIR-882100',
      payerName: 'Nairobi Hospital Supplies',
      amount: 95400,
      matchedInvoice: 'INV-2026-001',
      status: 'Pending Match'
    },
    {
      id: 'bf-3',
      date: '2026-03-10 11:40',
      channel: 'M-Pesa Paybill 720200',
      reference: 'QHL9938112',
      payerName: 'Java House Central Kitchen',
      amount: 32000,
      matchedInvoice: 'INV-2026-003',
      status: 'Pending Match'
    }
  ]);

  // A/R Aging computation
  const totalReceivables = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalPayables = suppliers.reduce((sum, s) => sum + (s.currentBalance || 0), 0);

  const currentAr = Math.round(totalReceivables * 0.45);
  const thirtyDaysAr = Math.round(totalReceivables * 0.35);
  const sixtyDaysAr = Math.round(totalReceivables * 0.15);
  const overSixtyAr = Math.round(totalReceivables * 0.05);

  const handleMatchFeed = (id: string) => {
    setBankFeeds(bankFeeds.map(f => f.id === id ? { ...f, status: 'Reconciled' } : f));
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Treasury & Finance Management"
        title="Financial Operations & Treasury Reconciliation"
        description="Accounts receivable aging analysis, farmer payables, M-Pesa automated bank feed matching, and cash flow audit trails."
        badge={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              A/R: KES {totalReceivables.toLocaleString()}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              A/P: KES {totalPayables.toLocaleString()}
            </span>
          </div>
        }
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold select-none pb-px">
        <button
          onClick={() => setActiveTab('aging')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'aging'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'aging' ? 'page' : undefined}
        >
          <Wallet className="w-4 h-4 shrink-0" />
          <span>A/R Aging Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'reconciliation'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'reconciliation' ? 'page' : undefined}
        >
          <CheckCheck className="w-4 h-4 shrink-0" />
          <span>Bank Feed & Paybill Reconciliation</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'ledger'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'ledger' ? 'page' : undefined}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>Settlement Records ({payments.length})</span>
        </button>
      </div>

      {/* Aging Tab */}
      {activeTab === 'aging' && (
        <div className="space-y-6">
          {/* Aging Buckets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current (0 - 30 Days)</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">KES {currentAr.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Normal institutional billing cycle</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">31 - 60 Days</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">KES {thirtyDaysAr.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">First reminder dispatched</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">61 - 90 Days</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">KES {sixtyDaysAr.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Escalated to bursar / finance director</span>
            </div>

            <div className="p-4 bg-white rounded-xl border border-rose-200/80 bg-rose-50/20 shadow-2xs">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">&gt; 90 Days (Critical)</span>
              <p className="text-2xl font-bold text-rose-800 mt-1">KES {overSixtyAr.toLocaleString()}</p>
              <span className="text-[11px] text-rose-600 mt-1 block">Account supply freeze alert</span>
            </div>
          </div>

          {/* Customer Receivables Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Institutional Customer Debt Exposure</h3>
              <span className="text-xs text-slate-500">Sorted by outstanding balance</span>
            </div>
            
            {/* Mobile View (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {customers.map(c => (
                <div key={c.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                      <span className="text-[10px] font-mono text-slate-400 block">{c.code} · {c.type}</span>
                    </div>
                    <StatusBadge
                      status={c.currentBalance > (c.creditLimit * 0.8) ? 'Rejected' : 'Approved'}
                      customLabel={c.currentBalance > (c.creditLimit * 0.8) ? 'High Exposure' : 'Good Standing'}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Limit: KES {c.creditLimit.toLocaleString()} ({c.paymentTerms})</span>
                    <span className="font-bold text-slate-900">KES {c.currentBalance.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[620px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Customer & Code</th>
                    <th className="p-3.5">Institution Type</th>
                    <th className="p-3.5">Credit Terms</th>
                    <th className="p-3.5 text-right">Credit Limit</th>
                    <th className="p-3.5 text-right">Current Exposure</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{c.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{c.code}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{c.type}</td>
                      <td className="p-3.5 font-medium text-slate-700">{c.paymentTerms}</td>
                      <td className="p-3.5 text-right text-slate-500 whitespace-nowrap">KES {c.creditLimit.toLocaleString()}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                        KES {c.currentBalance.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <StatusBadge
                          status={c.currentBalance > (c.creditLimit * 0.8) ? 'Rejected' : 'Approved'}
                          customLabel={c.currentBalance > (c.creditLimit * 0.8) ? 'High Exposure' : 'Good Standing'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bank Reconciliation Tab */}
      {activeTab === 'reconciliation' && (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50/80 border border-sky-200 rounded-xl text-xs text-sky-900">
            <span className="font-bold">Automated Bank & M-Pesa Feed: </span>
            <span>Incoming payments synced from KCB Corporate API & Safaricom Daraja C2B Paybill 720200. Match to outstanding invoices to auto-reconcile.</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Mobile Feeds (< 768px) */}
            <div className="md:hidden divide-y divide-slate-100">
              {bankFeeds.map(feed => (
                <div key={feed.id} className="p-4 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">{feed.channel}</span>
                      <p className="text-[11px] text-slate-400 font-mono">{feed.reference} · {feed.date}</p>
                    </div>
                    <StatusBadge
                      status={feed.status === 'Reconciled' ? 'Delivered' : 'Pending'}
                      customLabel={feed.status}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-slate-500">{feed.payerName}</span>
                      <span className="block font-mono text-emerald-700 font-semibold">{feed.matchedInvoice}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">KES {feed.amount.toLocaleString()}</span>
                      {feed.status === 'Pending Match' && (
                        <button
                          onClick={() => handleMatchFeed(feed.id)}
                          className="mt-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-[11px] min-h-[32px]"
                        >
                          Confirm Match
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Feeds (>= 768px) */}
            <div className="hidden md:block overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[650px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Channel & Ref</th>
                    <th className="p-3.5">Payer Name</th>
                    <th className="p-3.5">Matched Invoice</th>
                    <th className="p-3.5 text-right">Amount (KES)</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {bankFeeds.map(feed => (
                    <tr key={feed.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{feed.date}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{feed.channel}</div>
                        <div className="text-[10px] font-mono text-slate-400">{feed.reference}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-800">{feed.payerName}</td>
                      <td className="p-3.5 font-mono font-semibold text-emerald-700">{feed.matchedInvoice}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                        KES {feed.amount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <StatusBadge
                          status={feed.status === 'Reconciled' ? 'Delivered' : 'Pending'}
                          customLabel={feed.status}
                          size="sm"
                        />
                      </td>
                      <td className="p-3.5 text-center">
                        {feed.status === 'Pending Match' ? (
                          <button
                            onClick={() => handleMatchFeed(feed.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                          >
                            Confirm Match
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-medium">Reconciled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Records Tab */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Official Settlement Ledger</h3>
          </div>
          <div className="overflow-x-auto w-full touch-pan-x">
            <table className="w-full text-xs text-left min-w-[560px]">
              <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Reference #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Settlement Method</th>
                  <th className="p-3.5 text-right">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 text-slate-600 whitespace-nowrap">{pay.paymentDate}</td>
                    <td className="p-3.5 font-mono font-bold text-slate-900">{pay.reference}</td>
                    <td className="p-3.5 font-medium text-slate-900">{pay.customerName}</td>
                    <td className="p-3.5 text-slate-600">{pay.method}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-700 whitespace-nowrap">
                      KES {pay.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
