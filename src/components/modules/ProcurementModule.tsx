import React, { useState } from 'react';
import { 
  ShoppingBag, Plus, Search, Filter, Phone, MapPin, 
  CheckCircle2, Clock, DollarSign, TrendingUp, Award, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder, Supplier } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

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

  // Compare tool state
  const [compareCategory, setCompareCategory] = useState('Fresh Vegetables');

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Procurement & Farmer Sourcing Network</h2>
          <p className="text-xs text-slate-500">Manage grower co-operatives, purchase orders, price benchmark comparisons, and delivery SLAs</p>
        </div>

        {hasPermission('procurement', 'create') && (
          <button
            onClick={() => setIsAddPoOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('pos')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'pos'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('suppliers')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'suppliers'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Farmer Co-ops & Suppliers ({suppliers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'compare'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Grower Price & SLA Benchmark</span>
        </button>
      </div>

      {/* PO List Tab */}
      {activeTab === 'pos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by PO # or farm co-op..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">PO #</th>
                    <th className="p-3.5">Grower / Co-op</th>
                    <th className="p-3.5">Items Sourced</th>
                    <th className="p-3.5">Expected Delivery</th>
                    <th className="p-3.5 text-right">Total (KES)</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPos.map(po => (
                    <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{po.poNumber}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{po.supplierName}</div>
                        <div className="text-[10px] text-slate-400">{po.warehouseDestination}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        {po.items.map(i => `${i.productName} (${i.quantityOrdered} ${i.unit})`).join(', ')}
                      </td>
                      <td className="p-3.5 text-slate-600">{po.deliveryExpectedDate}</td>
                      <td className="p-3.5 text-right font-bold text-slate-900">
                        KES {po.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            po.status === 'Approved' ? 'success' :
                            po.status === 'Pending Approval' ? 'warning' : 'neutral'
                          }
                          size="sm"
                        >
                          {po.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Suppliers Directory Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suppliers.map(sup => (
            <div key={sup.id} className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400">{sup.code}</span>
                  <h3 className="text-sm font-bold text-slate-900">{sup.name}</h3>
                </div>
                <Badge variant="emerald" size="sm">{sup.rating} ★ Rating</Badge>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sup.region} ({sup.leadTimeDays} days lead time)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sup.contactPerson} · {sup.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
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
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
            <div>
              <span className="font-bold">Contract Farming & Farmgate Benchmark: </span>
              <span>Compare supplier pricing, freshness grades, and historical delivery punctuality across Kenyan production counties.</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
              Co-operative Sourcing Matrix (Kinangop vs Limuru vs Meru)
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Co-operative / Farm</th>
                  <th className="p-3">Produce Speciality</th>
                  <th className="p-3">Farmgate Price / KG</th>
                  <th className="p-3">Quality Pass Rate</th>
                  <th className="p-3">On-Time SLA</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Kinangop Highland Farmers Co-op</td>
                  <td className="p-3 text-slate-700">Cabbages, Spinach, Potatoes</td>
                  <td className="p-3 font-semibold text-emerald-700">KES 42 / KG</td>
                  <td className="p-3 text-slate-700">97.8% Grade A</td>
                  <td className="p-3 text-slate-700">96.5%</td>
                  <td className="p-3 text-center"><Badge variant="success" size="sm">Tier 1 Certified</Badge></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Limuru Fresh Veg Outgrowers</td>
                  <td className="p-3 text-slate-700">Broccoli, Cauliflower, Herbs</td>
                  <td className="p-3 font-semibold text-emerald-700">KES 85 / KG</td>
                  <td className="p-3 text-slate-700">98.4% Grade A</td>
                  <td className="p-3 text-slate-700">99.1%</td>
                  <td className="p-3 text-center"><Badge variant="success" size="sm">Tier 1 Certified</Badge></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Meru Greens Horticulture Ltd</td>
                  <td className="p-3 text-slate-700">French Beans, Baby Corn</td>
                  <td className="p-3 font-semibold text-emerald-700">KES 120 / KG</td>
                  <td className="p-3 text-slate-700">94.2% Grade A</td>
                  <td className="p-3 text-slate-700">92.0%</td>
                  <td className="p-3 text-center"><Badge variant="amber" size="sm">Tier 2 Regular</Badge></td>
                </tr>
              </tbody>
            </table>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Grower / Co-op *</label>
              <select
                value={selectedSupplierId}
                onChange={e => setSelectedSupplierId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800">Sourced Item & Target Volume</span>
            {poItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Produce Item</label>
                  <select
                    value={item.productId}
                    onChange={e => handlePoItemChange(idx, 'productId', e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
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
                    className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Farmgate Unit Cost (KES)</label>
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={e => handlePoItemChange(idx, 'unitCost', Number(e.target.value))}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Policy rule notice */}
          {totalPoAmount > 50000 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
              <AlertCircle className="w-4 h-4 inline mr-1 text-amber-600" />
              PO Total is <strong>KES {totalPoAmount.toLocaleString()}</strong> (&gt; KES 50,000 threshold). 
              This will automatically be forwarded to the Procurement Lead & Finance Controller for authorization.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddPoOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Submit Purchase Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
