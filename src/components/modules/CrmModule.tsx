import React, { useState } from 'react';
import { 
  Headphones, Plus, Search, Filter, AlertCircle, 
  CheckCircle2, Clock, Calendar, FileText, UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">CRM, Client Relations & Institutional Tenders</h2>
          <p className="text-xs text-slate-500">Service level agreements (SLAs), delivery complaints, chef feedback, and contract renewal watch</p>
        </div>

        {hasPermission('crm', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Client Ticket</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'tickets'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Support & SLA Issues ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'contracts'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Institutional Contracts & Tenders ({contractedCustomers.length})</span>
        </button>
      </div>

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, school/hotel, subject..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Subject & Notes</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{t.ticketNumber}</td>
                    <td className="p-3.5 font-medium text-slate-900">{t.customerName}</td>
                    <td className="p-3.5 text-slate-600">{t.category}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{t.subject}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.description}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge
                        variant={t.priority === 'High' ? 'danger' : t.priority === 'Medium' ? 'amber' : 'neutral'}
                        size="sm"
                      >
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={t.status === 'Resolved' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contracts Tab */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractedCustomers.map(cust => (
            <div key={cust.id} className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{cust.contract?.contractNumber}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{cust.name}</h3>
                </div>
                <Badge variant="emerald" size="sm">{cust.type}</Badge>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <p>Delivery Frequency: <strong>{cust.contract?.deliveryFrequency}</strong></p>
                <p>Contract Discount: <strong className="text-emerald-700">{cust.contract?.specialDiscountPercent}% Off List</strong></p>
                <p>Renewal / Tender Expiry: <strong className="text-slate-800">{cust.contract?.renewalDate}</strong></p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">PO Mandate: {cust.contract?.requiresPo ? 'Yes' : 'No'}</span>
                <span className="text-emerald-700 font-semibold hover:underline cursor-pointer">
                  View Contract Terms →
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
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
              <select
                value={ticketCategory}
                onChange={e => setTicketCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Detailed Description *</label>
            <textarea
              required
              rows={3}
              value={ticketDescription}
              onChange={e => setTicketDescription(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Log Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
