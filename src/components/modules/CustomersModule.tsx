import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Phone, Mail, MapPin, 
  FileText, Calendar, DollarSign, AlertCircle, CheckCircle, 
  ExternalLink, Building2, X, Clock, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const CustomersModule: React.FC = () => {
  const { customers, addCustomer, hasPermission, invoices, orders } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New customer form state
  const [formData, setFormData] = useState<{
    name: string;
    type: CustomerType;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    deliveryZone: string;
    paymentTerms: Customer['paymentTerms'];
    creditLimit: number;
    notes: string;
    hasContract: boolean;
    deliveryFrequency: 'Daily 05:00 AM' | 'Mon-Wed-Fri' | 'Weekly Tuesdays' | 'Custom';
    specialDiscountPercent: number;
    requiresPo: boolean;
  }>({
    name: '',
    type: 'School',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    deliveryZone: 'Nairobi North / Runda',
    paymentTerms: 'Net-30',
    creditLimit: 500000,
    notes: '',
    hasContract: true,
    deliveryFrequency: 'Daily 05:00 AM',
    specialDiscountPercent: 10,
    requiresPo: true
  });

  const filtered = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.deliveryZone.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contactPerson) return;

    addCustomer({
      name: formData.name,
      type: formData.type,
      contactPerson: formData.contactPerson,
      email: formData.email || 'info@' + formData.name.toLowerCase().replace(/\s+/g, '') + '.ke',
      phone: formData.phone || '+254 700 000 000',
      address: formData.address || 'Nairobi',
      deliveryZone: formData.deliveryZone,
      paymentTerms: formData.paymentTerms,
      creditLimit: Number(formData.creditLimit) || 500000,
      currentBalance: 0,
      status: 'Active',
      totalOrdersCount: 0,
      contract: formData.hasContract ? {
        contractNumber: `AG-CTR-2026-${formData.type.substring(0, 3).toUpperCase()}`,
        startDate: new Date().toISOString().substring(0, 10),
        renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
        deliveryFrequency: formData.deliveryFrequency,
        specialDiscountPercent: Number(formData.specialDiscountPercent) || 10,
        requiresPo: formData.requiresPo
      } : undefined,
      notes: formData.notes
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Commercial Accounts & CRM"
        title="Institutional Clients & Supply Contracts"
        description="Profiles, credit limits, recurring delivery schedules, and contracts for boarding schools, hospitals, hotels, and caterers."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {customers.length} Accounts Registered
          </span>
        }
        primaryAction={
          hasPermission('customers', 'create')
            ? {
                label: 'Onboard Customer',
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setIsAddModalOpen(true),
                variant: 'primary',
              }
            : undefined
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by school, hospital, zone, code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'School', 'Hospital', 'Hotel', 'Restaurant', 'Corporate', 'NGO'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                selectedType === type
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {type === 'all' ? 'All Accounts' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No customer accounts found"
          description="Try broadening your search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedType('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cust => {
            const custInvoices = invoices.filter(i => i.customerId === cust.id);
            const hasOverdue = custInvoices.some(i => i.status === 'Overdue');
            const isNearCreditLimit = cust.currentBalance > (cust.creditLimit * 0.8);

            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                role="button"
                tabIndex={0}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{cust.code}</span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{cust.name}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {cust.type}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cust.deliveryZone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cust.phone} ({cust.contactPerson})</span>
                    </div>
                    {cust.contract && (
                      <div className="flex items-center gap-2 text-emerald-700 font-medium">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{cust.contract.deliveryFrequency}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">Current Balance</span>
                    <span className={`font-bold ${isNearCreditLimit || hasOverdue ? 'text-rose-700' : 'text-slate-900'}`}>
                      KES {cust.currentBalance.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">Payment Terms</span>
                    <span className="font-semibold text-slate-700">{cust.paymentTerms}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Institutional Client Profile · ${selectedCustomer.code}`}
          maxWidth="3xl"
        >
          <div className="space-y-5 text-xs">
            {/* Quick Profile Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Account Status</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {selectedCustomer.status} ({selectedCustomer.type})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Credit Limit & Terms</span>
                <span className="font-bold text-slate-900 mt-0.5 block">
                  KES {selectedCustomer.creditLimit.toLocaleString()} ({selectedCustomer.paymentTerms})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Outstanding Balance</span>
                <span className="font-bold text-rose-700 mt-0.5 block">
                  KES {selectedCustomer.currentBalance.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Institutional Contract Particulars */}
            {selectedCustomer.contract ? (
              <div className="border border-emerald-200/80 bg-emerald-50/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    Institutional Supply Contract ({selectedCustomer.contract.contractNumber})
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active Contract
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-medium">Delivery Frequency</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.deliveryFrequency}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-medium">Contract Discount</span>
                    <p className="font-semibold text-emerald-700">{selectedCustomer.contract.specialDiscountPercent}% Off List</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-medium">PO Requirement</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.requiresPo ? 'Mandatory PO' : 'Flexible'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-medium">Renewal Date</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.renewalDate}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                No formal annual supply contract attached. Operating on spot/standard retail terms.
              </div>
            )}

            {/* Contacts & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900">Procurement & Kitchen Contact</h4>
                <p className="text-slate-700 font-medium">{selectedCustomer.contactPerson}</p>
                <p className="text-slate-500">{selectedCustomer.email}</p>
                <p className="text-slate-500">{selectedCustomer.phone}</p>
                <p className="text-slate-500">{selectedCustomer.address}</p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900">Operational Instructions & Notes</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCustomer.notes || 'No special kitchen delivery instructions logged.'}
                </p>
              </div>
            </div>

            {/* Recent Orders for this customer */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Recent Order History</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto w-full touch-pan-x">
                  <table className="w-full text-xs text-left min-w-[480px]">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Order #</th>
                        <th className="p-3">Delivery Date</th>
                        <th className="p-3 text-right">Total (KES)</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {orders.filter(o => o.customerId === selectedCustomer.id).map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">{o.orderNumber}</td>
                          <td className="p-3 text-slate-600">{o.deliveryDate} ({o.deliverySlot.split(' - ')[0]})</td>
                          <td className="p-3 text-right font-bold text-slate-900">KES {o.totalAmount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <StatusBadge size="sm" status={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Onboard Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard Customer or Institution"
        subtitle="Create institutional profile, assign delivery zone, and configure credit terms"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Organization Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Peponi House Preparatory School"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as CustomerType })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="School">School / Academy</option>
                <option value="Hospital">Hospital / Medical Center</option>
                <option value="Hotel">Hotel & Resort</option>
                <option value="Restaurant">Restaurant & Cafe</option>
                <option value="Corporate">Corporate Staff Cafeteria</option>
                <option value="NGO">NGO / Relief Organization</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Contact Person *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chef Robert / Bursar"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                placeholder="catering@school.ac.ke"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone *</label>
              <input
                type="text"
                required
                placeholder="+254 7XX XXX XXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Delivery Route Zone</label>
              <select
                value={formData.deliveryZone}
                onChange={e => setFormData({ ...formData, deliveryZone: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Nairobi North / Runda">Nairobi North / Runda & Muthaiga</option>
                <option value="Upper Hill & Hurlingham">Upper Hill & Hurlingham Hospitals</option>
                <option value="Lavington & Kileleshwa">Lavington & Kileleshwa Corridor</option>
                <option value="Nairobi CBD">Nairobi CBD & Riverbank</option>
                <option value="Parklands & Westlands">Parklands & Westlands</option>
                <option value="Kiambu / Kikuyu Corridor">Kiambu / Kikuyu Corridor</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Physical Address / Gate</label>
              <input
                type="text"
                placeholder="e.g. Farasi Lane, Off Limuru Rd"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value as Customer['paymentTerms'] })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Immediate">Immediate / Cash On Delivery</option>
                <option value="Net-7">Net-7 Days</option>
                <option value="Net-15">Net-15 Days</option>
                <option value="Net-30">Net-30 Days (Standard Institutional)</option>
                <option value="Net-60">Net-60 Days (Govt / Boarding)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Credit Limit (KES)</label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={e => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <label className="flex items-center gap-2 font-semibold text-slate-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasContract}
                onChange={e => setFormData({ ...formData, hasContract: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Create Formal Institutional Supply Contract</span>
            </label>

            {formData.hasContract && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Delivery Frequency</span>
                  <select
                    value={formData.deliveryFrequency}
                    onChange={e => setFormData({ ...formData, deliveryFrequency: e.target.value as any })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg min-h-[38px]"
                  >
                    <option value="Daily 05:00 AM">Daily 05:00 AM (Schools/Hosps)</option>
                    <option value="Mon-Wed-Fri">Mon-Wed-Fri</option>
                    <option value="Weekly Tuesdays">Weekly Tuesdays</option>
                    <option value="Custom">Custom Schedule</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 font-medium">Contract Discount (%)</span>
                  <input
                    type="number"
                    value={formData.specialDiscountPercent}
                    onChange={e => setFormData({ ...formData, specialDiscountPercent: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg min-h-[38px]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresPo}
                      onChange={e => setFormData({ ...formData, requiresPo: e.target.checked })}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span className="font-medium">Requires Official PO</span>
                  </label>
                </div>
              </div>
            )}
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
              Onboard Organization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
