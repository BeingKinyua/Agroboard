import React, { useState } from 'react';
import { 
  Receipt, Plus, Search, Filter, Calendar, 
  DollarSign, FileText, Printer, CheckCircle, Clock, AlertTriangle, Eye,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const InvoicingModule: React.FC = () => {
  const { invoices, addPayment, hasPermission } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Payment form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'M-Pesa Paybill' | 'Bank Transfer' | 'Cheque'>('Bank Transfer');
  const [payRef, setPayRef] = useState('KCB-TXN-998822');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const handleOpenPay = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setPayAmount(inv.balanceDue);
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice || payAmount <= 0) return;

    addPayment({
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.invoiceNumber,
      customerId: selectedInvoice.customerId,
      customerName: selectedInvoice.customerName,
      amount: Number(payAmount),
      method: payMethod,
      reference: payRef,
      allocatedToInvoices: [selectedInvoice.invoiceNumber]
    });

    setIsPayModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Finance & Commercial Accounts"
        title="Invoicing & Receivables Management"
        description="Official KRA-compliant tax invoices, institutional debtor statements, credit tracking, and automated reconciliations."
        badge={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Open Receivables:</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              KES {totalOutstanding.toLocaleString()}
            </span>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, school/hotel, order #..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'Issued', 'Partially Paid', 'Paid', 'Overdue'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {st === 'all' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices View */}
      {filteredInvoices.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No tax invoices found"
          description="No invoices match your selected search or status criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedStatus('all');
          }}
        />
      ) : (
        <>
          {/* Mobile Invoice Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredInvoices.map(inv => (
              <div key={inv.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono font-bold text-xs text-slate-900">{inv.invoiceNumber}</span>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight mt-0.5">{inv.customerName}</h3>
                    <p className="text-[11px] text-slate-400">Order: {inv.orderNumber} · Terms: {inv.paymentTerms}</p>
                  </div>
                  <StatusBadge status={inv.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Due Date</span>
                    <span className={`font-semibold ${inv.status === 'Overdue' ? 'text-rose-600' : 'text-slate-800'}`}>
                      {inv.dueDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Total Amount</span>
                    <span className="font-semibold text-slate-800">KES {inv.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Balance Due</span>
                    <span className="text-sm font-bold text-rose-700">KES {inv.balanceDue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 min-h-[36px]"
                    >
                      View
                    </button>
                    {inv.balanceDue > 0 && (
                      <button
                        onClick={() => handleOpenPay(inv)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs min-h-[36px]"
                      >
                        Record Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Horizontal Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[760px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Invoice #</th>
                    <th className="p-3.5">Customer & Institution</th>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Issue Date</th>
                    <th className="p-3.5">Due Date</th>
                    <th className="p-3.5 text-right">Total (KES)</th>
                    <th className="p-3.5 text-right">Balance Due</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{inv.customerName}</div>
                        <div className="text-[10px] text-slate-400">Terms: {inv.paymentTerms}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{inv.orderNumber}</td>
                      <td className="p-3.5 text-slate-600 whitespace-nowrap">{inv.issueDate}</td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`font-semibold ${inv.status === 'Overdue' ? 'text-rose-600' : 'text-slate-700'}`}>
                          {inv.dueDate}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-medium text-slate-900 whitespace-nowrap">
                        KES {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right font-bold text-rose-700 whitespace-nowrap">
                        KES {inv.balanceDue.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <StatusBadge status={inv.status} size="sm" />
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="View Official Tax Invoice"
                            aria-label={`View tax invoice ${inv.invoiceNumber}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {inv.balanceDue > 0 && (
                            <button
                              onClick={() => handleOpenPay(inv)}
                              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-md hover:bg-emerald-100 text-[11px] border border-emerald-200 transition-colors"
                            >
                              Pay
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Tax Invoice Document Preview Modal */}
      {selectedInvoice && !isPayModalOpen && (
        <Modal
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          title={`Tax Invoice: ${selectedInvoice.invoiceNumber}`}
          subtitle="Official Kenya Revenue Authority (KRA) Compliant Document"
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs text-slate-800 p-1">
            {/* Header & Company Brand */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-slate-200 gap-4">
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900">AGRO-DELIVERIES KE. LTD</h1>
                <p className="text-xs text-slate-600 mt-0.5">Fresh Farm Produce Distribution & Institutional Logistics</p>
                <p className="text-[11px] text-slate-500">Commercial Street, Industrial Area, P.O. Box 45120-00100 Nairobi</p>
                <p className="text-[11px] text-slate-500">KRA PIN: <strong className="text-slate-800">P051982734K</strong> · VAT Reg: <strong className="text-slate-800">0192847B</strong></p>
              </div>

              <div className="text-left sm:text-right">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider">
                  TAX INVOICE
                </span>
                <p className="font-mono font-bold text-sm text-slate-900 mt-2">{selectedInvoice.invoiceNumber}</p>
                <p className="text-slate-500 text-[11px]">Issued: {selectedInvoice.issueDate}</p>
                <p className="text-rose-600 font-semibold text-[11px]">Due: {selectedInvoice.dueDate}</p>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Billed To (Institutional Client)</span>
                <p className="font-bold text-slate-900 text-sm">{selectedInvoice.customerName}</p>
                <p className="text-slate-600 mt-0.5">Contract Channel: Direct Institutional Supply</p>
                <p className="text-slate-600">Credit Terms: {selectedInvoice.paymentTerms}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Delivery Reference</span>
                <p className="font-mono font-bold text-slate-900">{selectedInvoice.orderNumber}</p>
                <p className="text-slate-600 text-[11px]">Certified Delivery Note Attached</p>
                <div className="mt-1.5 sm:flex sm:justify-end">
                  <StatusBadge status={selectedInvoice.status} size="sm" />
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto w-full touch-pan-x">
                <table className="w-full text-xs text-left min-w-[500px]">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Produce Description</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Unit Rate (KES)</th>
                      <th className="p-3 text-right">VAT Rate</th>
                      <th className="p-3 text-right">Total (KES)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoice.items.map(it => (
                      <tr key={it.id}>
                        <td className="p-3 font-medium text-slate-900">{it.description}</td>
                        <td className="p-3 text-right font-bold">{it.quantity} {it.unit}</td>
                        <td className="p-3 text-right text-slate-600">KES {it.unitPrice.toLocaleString()}</td>
                        <td className="p-3 text-right text-slate-500 font-mono">0% (Zero-Rated Fresh)</td>
                        <td className="p-3 text-right font-bold text-slate-900">KES {it.totalAmount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="p-3 text-right uppercase text-slate-600 text-[11px]">Invoice Total:</td>
                      <td className="p-3 text-right text-slate-900 text-sm">KES {selectedInvoice.totalAmount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="p-3 text-right uppercase text-slate-600 text-[11px]">Paid to Date:</td>
                      <td className="p-3 text-right text-emerald-700">KES {selectedInvoice.paidAmount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-t border-slate-200 bg-slate-100/60">
                      <td colSpan={4} className="p-3 text-right uppercase text-slate-800 font-bold">Outstanding Balance:</td>
                      <td className="p-3 text-right text-rose-700 text-base font-bold">
                        KES {selectedInvoice.balanceDue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment banking instructions */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Approved Settlement Channels</h4>
                <p className="text-slate-700"><strong>Bank:</strong> Kenya Commercial Bank (KCB) · Industrial Area Branch</p>
                <p className="text-slate-700"><strong>Account Name:</strong> Agro-Deliveries Ke. Limited</p>
                <p className="text-slate-700"><strong>Account Number:</strong> 1184 9283 0019</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">M-Pesa Paybill</h4>
                <p className="text-slate-700"><strong>Business No:</strong> 720200</p>
                <p className="text-slate-700"><strong>Account Ref:</strong> {selectedInvoice.invoiceNumber}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Record Payment Allocation"
        subtitle={`Allocate funds against ${selectedInvoice?.invoiceNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
            <select
              value={payMethod}
              onChange={e => setPayMethod(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            >
              <option value="M-Pesa Paybill">M-Pesa Paybill (720200)</option>
              <option value="Bank Transfer">Bank Wire / RTGS Transfer (KCB)</option>
              <option value="Cheque">Institutional Cheque</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Transaction Reference / Cheque # *</label>
            <input
              type="text"
              required
              value={payRef}
              onChange={e => setPayRef(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Payment Amount (KES) *</label>
            <input
              type="number"
              required
              max={selectedInvoice?.balanceDue}
              value={payAmount}
              onChange={e => setPayAmount(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-emerald-800 min-h-[42px]"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Max balance due: KES {selectedInvoice?.balanceDue.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPayModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs min-h-[40px] transition-colors"
            >
              Record & Reconcile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
