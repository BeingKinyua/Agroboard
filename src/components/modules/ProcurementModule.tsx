import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Search, Filter, Phone, MapPin, 
  CheckCircle2, Clock, DollarSign, TrendingUp, Award, AlertCircle,
  Building2, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder, Supplier } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const ProcurementModule: React.FC = () => {
  const { 
    suppliers, 
    purchaseOrders, 
    addPurchaseOrder, 
    hasPermission, 
    products 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pos' | 'suppliers' | 'compare'>('pos');
  const [search, setSearch] = useState('');
  const [isAddPoOpen, setIsAddPoOpen] = useState(false);

  // New PO state
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState<{ productId: string; quantity: number; unitCost: number }[]>([
    { productId: products[0]?.id || '', quantity: 200, unitCost: 45 }
  ]);
  const [deliveryExpectedDate, setDeliveryExpectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().substring(0, 10)
  );

  const filteredPos = purchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
    po.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  const handlePoItemChange = (idx: number, field: string, val: any) => {
    const updated = [...poItems];
    updated[idx] = { ...updated[idx], [field]: val };
    setPoItems(updated);
  };

  const calculatedPoItems = poItems.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const qty = Number(item.quantity) || 1;
    const cost = Number(item.unitCost) || 50;
    return {
      productId: item.productId,
      productName: prod?.name || 'Produce',
      quantityOrdered: qty,
      quantityReceived: 0,
      unit: prod?.unit || 'KG',
      unitCost: cost,
      totalCost: qty * cost
    };
  });

  const totalPoAmount = calculatedPoItems.reduce((sum, it) => sum + it.totalCost, 0);

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    addPurchaseOrder({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      items: calculatedPoItems,
      totalAmount: totalPoAmount,
      status: totalPoAmount > 50000 ? 'Pending Approval' : 'Approved',
      deliveryExpectedDate,
      warehouseDestination: 'Central Cold Storage - Cold Room A',
      requiresApproval: totalPoAmount > 50000
    });

    setIsAddPoOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Sourcing & Supply Chain"
        title="Procurement & Grower Network"
        description="Direct-from-farm contracts, co-operative purchase orders, farmgate price benchmarks, and quality audits."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {suppliers.length} Certified Co-ops
          </span>
        }
        primaryAction={
          hasPermission('procurement', 'create')
            ? {
                label: 'Create Purchase Order',
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setIsAddPoOpen(true),
                variant: 'primary',
              }
            : undefined
        }
      />

      {/* Modern Horizontal Navigation Tabs */}
      <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold select-none pb-px">
        <button
          onClick={() => setActiveTab('pos')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'pos'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'pos' ? 'page' : undefined}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'suppliers'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'suppliers' ? 'page' : undefined}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span>Farmer Co-ops ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'compare'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'compare' ? 'page' : undefined}
        >
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span>Grower Price Benchmark</span>
        </button>
      </div>

      {/* PO List Tab */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by PO # or farm co-op..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
              />
            </div>
          </div>

          {filteredPos.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No purchase orders found"
              description={search ? 'No orders match your search query.' : 'Create a purchase order to record farm procurement.'}
              actionLabel={search ? 'Clear Search' : 'Create PO'}
              onAction={search ? () => setSearch('') : () => setIsAddPoOpen(true)}
            />
          ) : (
            <>
              {/* Mobile PO Cards (< 768px) */}
              <div className="md:hidden space-y-3">
                {filteredPos.map(po => (
                  <div key={po.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs text-slate-900">{po.poNumber}</span>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight mt-0.5">{po.supplierName}</h3>
                        <p className="text-[11px] text-slate-400">{po.warehouseDestination}</p>
                      </div>
                      <StatusBadge status={po.status} size="sm" />
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">Items Sourced</span>
                      <p className="line-clamp-2 mt-0.5">
                        {po.items.map(i => `${i.productName} (${i.quantityOrdered} ${i.unit})`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Expected Delivery</span>
                        <span className="font-medium text-slate-800">{po.deliveryExpectedDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] block">Total PO Value</span>
                        <span className="font-bold text-slate-900">KES {po.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Horizontal Table (>= 768px) */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto w-full touch-pan-x">
                  <table className="w-full text-xs text-left min-w-[620px]">
                    <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">PO #</th>
                        <th className="p-3.5">Grower / Co-op</th>
                        <th className="p-3.5">Items Sourced</th>
                        <th className="p-3.5">Expected Delivery</th>
                        <th className="p-3.5 text-right">Total (KES)</th>
                        <th className="p-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredPos.map(po => (
                        <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{po.poNumber}</td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{po.supplierName}</div>
                            <div className="text-[10px] text-slate-400">{po.warehouseDestination}</div>
                          </td>
                          <td className="p-3.5 text-slate-600 max-w-xs truncate">
                            {po.items.map(i => `${i.productName} (${i.quantityOrdered} ${i.unit})`).join(', ')}
                          </td>
                          <td className="p-3.5 text-slate-600 whitespace-nowrap">{po.deliveryExpectedDate}</td>
                          <td className="p-3.5 text-right font-bold text-slate-900 whitespace-nowrap">
                            KES {po.totalAmount.toLocaleString()}
                          </td>
                          <td className="p-3.5 text-center">
                            <StatusBadge status={po.status} size="sm" />
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

      {/* Suppliers Directory Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(sup => (
            <div key={sup.id} className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{sup.code}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{sup.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {sup.rating} ★ Rating
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sup.region} ({sup.leadTimeDays} days lead time)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sup.contactPerson} · {sup.phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Pay Terms: <strong>{sup.paymentTerms}</strong></span>
                <span className="text-slate-500">Balance: <strong className="text-slate-900">KES {sup.currentBalance.toLocaleString()}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grower Benchmark Tab */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            <span className="font-bold">Contract Farming & Farmgate Benchmark: </span>
            <span>Compare supplier pricing, freshness grades, and historical delivery punctuality across Kenyan production counties.</span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
              Co-operative Sourcing Matrix (Kinangop vs Limuru vs Meru)
            </div>
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[560px]">
                <thead className="bg-slate-50/90 text-slate-500 border-b border-slate-200 font-semibold text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Co-operative / Farm</th>
                    <th className="p-3.5">Produce Speciality</th>
                    <th className="p-3.5">Farmgate Price / KG</th>
                    <th className="p-3.5">Quality Pass Rate</th>
                    <th className="p-3.5">On-Time SLA</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Kinangop Highland Farmers Co-op</td>
                    <td className="p-3.5 text-slate-700">Cabbages, Spinach, Potatoes</td>
                    <td className="p-3.5 font-semibold text-emerald-700 whitespace-nowrap">KES 42 / KG</td>
                    <td className="p-3.5 text-slate-700">97.8% Grade A</td>
                    <td className="p-3.5 text-slate-700">96.5%</td>
                    <td className="p-3.5 text-center">
                      <StatusBadge status="Approved" customLabel="Tier 1 Certified" size="sm" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Limuru Fresh Veg Outgrowers</td>
                    <td className="p-3.5 text-slate-700">Broccoli, Cauliflower, Herbs</td>
                    <td className="p-3.5 font-semibold text-emerald-700 whitespace-nowrap">KES 85 / KG</td>
                    <td className="p-3.5 text-slate-700">98.4% Grade A</td>
                    <td className="p-3.5 text-slate-700">99.1%</td>
                    <td className="p-3.5 text-center">
                      <StatusBadge status="Approved" customLabel="Tier 1 Certified" size="sm" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Meru Greens Horticulture Ltd</td>
                    <td className="p-3.5 text-slate-700">French Beans, Baby Corn</td>
                    <td className="p-3.5 font-semibold text-emerald-700 whitespace-nowrap">KES 120 / KG</td>
                    <td className="p-3.5 text-slate-700">94.2% Grade A</td>
                    <td className="p-3.5 text-slate-700">92.0%</td>
                    <td className="p-3.5 text-center">
                      <StatusBadge status="Pending Approval" customLabel="Tier 2 Regular" size="sm" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      <Modal
        isOpen={isAddPoOpen}
        onClose={() => setIsAddPoOpen(false)}
        title="Issue Purchase Order"
        subtitle="Sourcing requisition to grower co-operative"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePo} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Grower / Co-op *</label>
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Delivery Date *</label>
              <input
                type="date"
                required
                value={deliveryExpectedDate}
                onChange={e => setDeliveryExpectedDate(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800">Sourced Item & Target Volume</span>
            {poItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Produce Item</label>
                  <select
                    value={item.productId}
                    onChange={e => handlePoItemChange(idx, 'productId', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs min-h-[38px]"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Order Volume (Qty)</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={e => handlePoItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs min-h-[38px]"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Farmgate Unit Cost (KES)</label>
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={e => handlePoItemChange(idx, 'unitCost', Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs min-h-[38px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Policy rule notice */}
          {totalPoAmount > 50000 && (
            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-900">
              <AlertCircle className="w-4 h-4 inline mr-1.5 text-amber-600 shrink-0" />
              PO Total is <strong>KES {totalPoAmount.toLocaleString()}</strong> (&gt; KES 50,000 threshold). 
              This will automatically be forwarded to the Procurement Lead & Finance Controller for authorization.
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddPoOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs min-h-[40px] transition-colors"
            >
              Submit Purchase Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
