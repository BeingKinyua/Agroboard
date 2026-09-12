import React, { useState } from 'react';
import { 
  Headphones, Plus, Search, Filter, AlertCircle, 
  CheckCircle2, Clock, Calendar, FileText, UserCheck, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const CrmModule: React.FC = () => {
  const { tickets, addTicket, hasPermission, customers } = useApp();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'tickets' | 'contracts'>('tickets');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New ticket state
  const [ticketCustomerId, setTicketCustomerId] = useState(customers[0]?.id || '');
  const [ticketCategory, setTicketCategory] = useState<SupportTicket['category']>('Quality Concern');
  const [ticketPriority, setTicketPriority] = useState<SupportTicket['priority']>('High');
  const [ticketSubject, setTicketSubject] = useState('Tomatoes delivery grading check');
  const [ticketDescription, setTicketDescription] = useState('Head Chef reported 2 crates contained bruised Roma tomatoes.');

  const filteredTickets = tickets.filter(t => 
    t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const contractedCustomers = customers.filter(c => !!c.contract);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find(c => c.id === ticketCustomerId) || customers[0];

    addTicket({
      customerId: cust.id,
      customerName: cust.name,
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDescription,
      priority: ticketPriority,
      status: 'Open'
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Customer Relations & Tenders"
        title="Client Relations & Institutional Contracts"
        description="Institutional service level agreements (SLAs), delivery feedback, chef issue logging, and tender renewal monitoring."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {tickets.filter(t => t.status !== 'Resolved').length} Active Client Issues
          </span>
        }
        primaryAction={
          hasPermission('crm', 'create')
            ? {
                label: 'Log Client Ticket',
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setIsAddModalOpen(true),
                variant: 'primary'
              }
            : undefined
        }
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold select-none pb-px">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'tickets'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'tickets' ? 'page' : undefined}
        >
          <Headphones className="w-4 h-4 shrink-0" />
          <span>Support & SLA Issues ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'contracts'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'contracts' ? 'page' : undefined}
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Institutional Contracts & Tenders ({contractedCustomers.length})</span>
        </button>
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, school/hotel, subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <EmptyState
              icon={Headphones}
              title="No tickets found"
              description="No customer support tickets match your search parameters."
              actionLabel="Clear Search"
              onAction={() => setSearch('')}
            />
          ) : (
            <>
              {/* Mobile Tickets Cards (< 768px) */}
              <div className="md:hidden space-y-3">
                {filteredTickets.map(t => (
                  <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{t.ticketNumber}</span>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5">{t.customerName}</h3>
                      </div>
                      <StatusBadge status={t.status === 'Resolved' ? 'Delivered' : 'Pending'} customLabel={t.status} size="sm" />
                    </div>

                    <div className="py-1">
                      <span className="text-xs font-semibold text-slate-900 block">{t.subject}</span>
                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{t.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500">{t.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {t.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table (>= 768px) */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto w-full touch-pan-x">
                  <table className="w-full text-xs text-left min-w-[650px]">
                    <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Ticket #</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Subject & Notes</th>
                        <th className="p-3.5">Priority</th>
                        <th className="p-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredTickets.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">{t.ticketNumber}</td>
                          <td className="p-3.5 font-semibold text-slate-900">{t.customerName}</td>
                          <td className="p-3.5 text-slate-600">{t.category}</td>
                          <td className="p-3.5 max-w-xs">
                            <div className="font-semibold text-slate-900">{t.subject}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.description}</div>
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              t.priority === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                              t.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <StatusBadge
                              status={t.status === 'Resolved' ? 'Delivered' : 'Pending'}
                              customLabel={t.status}
                              size="sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractedCustomers.map(cust => (
            <div key={cust.id} className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{cust.contract?.contractNumber}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{cust.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {cust.type}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 py-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Frequency:</span>
                  <strong className="text-slate-900">{cust.contract?.deliveryFrequency}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contract Discount:</span>
                  <strong className="text-emerald-700">{cust.contract?.specialDiscountPercent}% Off List</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tender Renewal:</span>
                  <strong className="text-slate-800">{cust.contract?.renewalDate}</strong>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">PO Mandate: {cust.contract?.requiresPo ? 'Required' : 'Optional'}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  Active Contract <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Ticket Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Client Support / Quality Ticket"
        subtitle="Record complaints regarding delivery time, produce grading, or invoices"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Customer / Institution *</label>
            <select
              value={ticketCustomerId}
              onChange={e => setTicketCustomerId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Quality Concern">Quality Concern (Produce Grading)</option>
                <option value="Delivery Delay">Delivery Delay / Missed Dawn Window</option>
                <option value="Missing Item">Missing Crate / Item Discrepancy</option>
                <option value="Billing Discrepancy">Billing / Invoice Query</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Priority Level</label>
              <select
                value={ticketPriority}
                onChange={e => setTicketPriority(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Low">Low (General Inquiry)</option>
                <option value="Medium">Medium (Regular Issue)</option>
                <option value="High">High (Kitchen Meal Impacted)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Subject *</label>
            <input
              type="text"
              required
              value={ticketSubject}
              onChange={e => setTicketSubject(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              value={ticketDescription}
              onChange={e => setTicketDescription(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs min-h-[40px] transition-colors"
            >
              Log Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
