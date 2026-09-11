import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Phone, Mail, MapPin, 
  FileText, Calendar, DollarSign, AlertCircle, CheckCircle, 
  ExternalLink, Building, X, Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerType } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

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
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Customer & Institutional Accounts</h2>
          <p className="text-xs text-slate-500">Manage institutional supply contracts, credit terms, and delivery zones</p>
        </div>

        {hasPermission('customers', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Customer / Institution</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by school, hospital, zone, code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'School', 'Hospital', 'Hotel', 'Restaurant'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Types' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(cust => {
          const custInvoices = invoices.filter(i => i.customerId === cust.id);
          const hasOverdue = custInvoices.some(i => i.status === 'Overdue');
          const isNearCreditLimit = cust.currentBalance > (cust.creditLimit * 0.8);

          return (
            <div
              key={cust.id}
              onClick={() => setSelectedCustomer(cust)}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:border-emerald-500/50 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{cust.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{cust.name}</h3>
                  </div>
                  <Badge 
                    variant={
                      cust.type === 'School' ? 'emerald' :
                      cust.type === 'Hospital' ? 'sky' :
                      cust.type === 'Hotel' ? 'amber' : 'neutral'
                    }
                    size="sm"
                  >
                    {cust.type}
                  </Badge>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{cust.deliveryZone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  {cust.contract && (
                    <div className="flex items-center gap-2 text-emerald-700 font-medium">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{cust.contract.deliveryFrequency}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Current Balance</span>
                  <span className={`font-bold ${isNearCreditLimit || hasOverdue ? 'text-rose-700' : 'text-slate-900'}`}>
                    KES {cust.currentBalance.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Terms</span>
                  <span className="font-medium text-slate-700">{cust.paymentTerms}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Institutional Client Profile · ${selectedCustomer.code}`}
          maxWidth="3xl"
        >
          <div className="space-y-6">
            {/* Quick Profile Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
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
              <div className="border border-emerald-200/80 bg-emerald-50/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Institutional Supply Contract ({selectedCustomer.contract.contractNumber})
                  </span>
                  <Badge variant="success" size="sm">Active Contract</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Delivery Frequency</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.deliveryFrequency}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Contract Discount</span>
                    <p className="font-semibold text-emerald-700">{selectedCustomer.contract.specialDiscountPercent}% Off List</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">PO Requirement</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.requiresPo ? 'Mandatory PO' : 'Flexible'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase">Renewal Date</span>
                    <p className="font-semibold text-slate-900">{selectedCustomer.contract.renewalDate}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500">
                No formal annual supply contract attached. Operating on spot/standard retail terms.
              </div>
            )}

            {/* Contacts & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <h4 className="font-bold text-slate-900">Procurement & Kitchen Contact</h4>
                <p className="text-slate-700">{selectedCustomer.contactPerson}</p>
                <p className="text-slate-500">{selectedCustomer.email}</p>
                <p className="text-slate-500">{selectedCustomer.phone}</p>
                <p className="text-slate-500">{selectedCustomer.address}</p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2">
                <h4 className="font-bold text-slate-900">Operational Instructions & Notes</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCustomer.notes || 'No special kitchen delivery instructions logged.'}
                </p>
              </div>
            </div>

            {/* Recent Orders for this customer */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Recent Order History</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Order #</th>
                      <th className="p-2.5">Delivery Date</th>
                      <th className="p-2.5">Total (KES)</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.filter(o => o.customerId === selectedCustomer.id).map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono font-semibold text-slate-800">{o.orderNumber}</td>
                        <td className="p-2.5 text-slate-600">{o.deliveryDate} ({o.deliverySlot.split(' - ')[0]})</td>
                        <td className="p-2.5 font-medium text-slate-900">KES {o.totalAmount.toLocaleString()}</td>
                        <td className="p-2.5">
                          <Badge size="sm" variant={o.status === 'Delivered' ? 'success' : 'neutral'}>
                            {o.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as CustomerType })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                placeholder="catering@school.ac.ke"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Delivery Route Zone</label>
              <select
                value={formData.deliveryZone}
                onChange={e => setFormData({ ...formData, deliveryZone: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value as Customer['paymentTerms'] })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={formData.hasContract}
                onChange={e => setFormData({ ...formData, hasContract: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              Create Formal Institutional Supply Contract
            </label>

            {formData.hasContract && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1">Delivery Frequency</span>
                  <select
                    value={formData.deliveryFrequency}
                    onChange={e => setFormData({ ...formData, deliveryFrequency: e.target.value as any })}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded"
                  >
                    <option value="Daily 05:00 AM">Daily 05:00 AM (Schools/Hosps)</option>
                    <option value="Mon-Wed-Fri">Mon-Wed-Fri</option>
                    <option value="Weekly Tuesdays">Weekly Tuesdays</option>
                    <option value="Custom">Custom Schedule</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Contract Discount (%)</span>
                  <input
                    type="number"
                    value={formData.specialDiscountPercent}
                    onChange={e => setFormData({ ...formData, specialDiscountPercent: Number(e.target.value) })}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded"
                  />
                </div>
                <div className="flex items-center pt-4">
                  <label className="flex items-center gap-1.5 text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.requiresPo}
                      onChange={e => setFormData({ ...formData, requiresPo: e.target.checked })}
                      className="rounded text-emerald-600"
                    />
                    Requires Official PO
                  </label>
                </div>
              </div>
            )}
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
              Onboard Organization
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
