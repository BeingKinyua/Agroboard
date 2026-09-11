import React, { useState } from 'react';
import { 
  Boxes, AlertTriangle, ArrowDownUp, Plus, Search, Filter, 
  Calendar, Thermometer, ShieldAlert, CheckCircle2, History 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryBatch, StockAdjustment } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const InventoryModule: React.FC = () => {
  const { 
    inventoryItems, 
    stockAdjustments, 
    addStockAdjustment, 
    hasPermission, 
    products 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'batches' | 'adjustments' | 'coldchain'>('batches');
  const [search, setSearch] = useState('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  const [adjustFormData, setAdjustFormData] = useState<{
    productId: string;
    batchId: string;
    quantity: number;
    reason: StockAdjustment['reason'];
    notes: string;
  }>({
    productId: products[0]?.id || 'prod-1',
    batchId: inventoryItems[0]?.id || 'batch-1',
    quantity: -5,
    reason: 'Spoilage',
    notes: 'Rot observed during morning sorting inspection'
  });

  const filteredBatches = inventoryItems.filter(b => 
    b.productName.toLowerCase().includes(search.toLowerCase()) ||
    b.batchNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.storageBin.toLowerCase().includes(search.toLowerCase())
  );

  const totalValuation = inventoryItems.reduce((acc, item) => acc + (item.quantityAvailable * 70), 0);
  const expiringCount = inventoryItems.filter(i => i.status === 'Near Expiry').length;

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === adjustFormData.productId);
    const batch = inventoryItems.find(b => b.id === adjustFormData.batchId);

    const costImpact = Math.abs(Number(adjustFormData.quantity)) * (product?.baseCost || 60);

    addStockAdjustment({
      productId: adjustFormData.productId,
      productName: product?.name || 'Produce Item',
      batchNumber: batch?.batchNumber || 'BATCH-ADJ',
      quantityDelta: Number(adjustFormData.quantity),
      reason: adjustFormData.reason,
      notes: adjustFormData.notes,
      costImpact,
      requiresApproval: costImpact > 10000
    });

    setIsAdjustModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Inventory & Cold Storage Control</h2>
          <p className="text-xs text-slate-500">Real-time batch traceability, expiry countdowns, storage bins, and wastage logs</p>
        </div>

        {hasPermission('inventory', 'create') && (
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowDownUp className="w-4 h-4" />
            <span>Log Stock Adjustment / Wastage</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Inventory Batches</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inventoryItems.length} Tracked Batches</p>
          <span className="text-xs text-slate-400 mt-1 block">Valuation: ~KES {totalValuation.toLocaleString()}</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cold Storage Sensor Health</span>
          <div className="flex items-center gap-2 mt-1">
            <Thermometer className="w-5 h-5 text-emerald-600" />
            <span className="text-2xl font-bold text-slate-900">+4.2°C</span>
            <Badge variant="success" size="sm">Optimal</Badge>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Cold Rooms A & B inside safe range (2°C - 6°C)</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Expiry & Spoilage Watch</span>
          <p className={`text-2xl font-bold mt-1 ${expiringCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {expiringCount} Batches Near Expiry
          </p>
          <span className="text-xs text-rose-600 font-medium mt-1 block">Priority FIFO dispatch recommended</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'batches'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Active Produce Batches ({inventoryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('adjustments')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'adjustments'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Wastage & Adjustments Log ({stockAdjustments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coldchain')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'coldchain'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Thermometer className="w-4 h-4" />
          <span>Cold Chain & Facility Sensors</span>
        </button>
      </div>

      {/* Content: Batches View */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by produce, batch #, or bin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Batch # & Produce</th>
                    <th className="p-3.5">Storage Bay / Bin</th>
                    <th className="p-3.5">Quality Grade</th>
                    <th className="p-3.5 text-right">Avail / Total</th>
                    <th className="p-3.5">Received Date</th>
                    <th className="p-3.5">Expiry Date</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.map(batch => (
                    <tr key={batch.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{batch.productName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{batch.batchNumber}</div>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">
                        {batch.warehouseId}: {batch.storageBin}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          {batch.inspectionGrade}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-medium">
                        <span className="text-slate-900 font-bold">{batch.quantityAvailable}</span>
                        <span className="text-slate-400"> / {batch.quantityTotal} {batch.unit}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{batch.receivedDate}</td>
                      <td className="p-3.5">
                        <span className={`font-semibold ${batch.status === 'Near Expiry' ? 'text-rose-600' : 'text-slate-700'}`}>
                          {batch.expiryDate}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge
                          variant={
                            batch.status === 'Optimal' ? 'success' :
                            batch.status === 'Near Expiry' ? 'danger' : 'neutral'
                          }
                          size="sm"
                        >
                          {batch.status}
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

      {/* Content: Adjustments & Spoilage Log */}
      {activeTab === 'adjustments' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Stock Variance & Spoilage History</h3>
            <p className="text-[11px] text-slate-500">Every adjustment is tied to an operator, batch, and financial impact</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Adjustment #</th>
                  <th className="p-3.5">Date & Operator</th>
                  <th className="p-3.5">Product & Batch</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5 text-right">Delta</th>
                  <th className="p-3.5 text-right">Financial Cost</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockAdjustments.map(adj => (
                  <tr key={adj.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono font-semibold text-slate-800">{adj.adjustmentNumber}</td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-900">{adj.createdBy}</div>
                      <div className="text-[10px] text-slate-400">{adj.date}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{adj.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{adj.batchNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="amber" size="sm">{adj.reason}</Badge>
                      <p className="text-[10px] text-slate-500 mt-1">{adj.notes}</p>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-600">
                      {adj.quantityDelta}
                    </td>
                    <td className="p-3.5 text-right font-medium text-slate-900">
                      KES {adj.costImpact.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <Badge
                        variant={adj.status === 'Approved' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {adj.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content: Cold Chain Sensors View */}
      {activeTab === 'coldchain' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Cold Room A (Vegetables)</h4>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">+4.2°C</span>
              <span className="text-xs text-slate-500">Target: 3.5°C – 5.0°C</span>
            </div>
            <p className="text-xs text-slate-600">Humidity: 88% RH · Comp 1 Active</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Sensor #SENS-CR-01 · Industrial Area Hub
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Cold Room B (Dairy & Herbs)</h4>
              <Badge variant="success" size="sm">Online</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">+3.1°C</span>
              <span className="text-xs text-slate-500">Target: 2.0°C – 4.0°C</span>
            </div>
            <p className="text-xs text-slate-600">Humidity: 75% RH · Comp 2 Active</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Sensor #SENS-CR-02 · Industrial Area Hub
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Dry Produce & Tuber Bay</h4>
              <Badge variant="neutral" size="sm">Ambient</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-800">+18.5°C</span>
              <span className="text-xs text-slate-500">Ventilation Normal</span>
            </div>
            <p className="text-xs text-slate-600">Humidity: 55% RH · Natural Airflow</p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              Potatoes, Onions, Grains Staging Bay
            </div>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        title="Record Stock Adjustment / Spoilage"
        subtitle="Deduct decayed produce or correct physical audit discrepancies"
        maxWidth="lg"
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Batch to Adjust *</label>
            <select
              value={adjustFormData.batchId}
              onChange={e => {
                const b = inventoryItems.find(i => i.id === e.target.value);
                setAdjustFormData({
                  ...adjustFormData,
                  batchId: e.target.value,
                  productId: b?.productId || adjustFormData.productId
                });
              }}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {inventoryItems.map(b => (
                <option key={b.id} value={b.id}>
                  {b.productName} ({b.batchNumber}) — Avail: {b.quantityAvailable} {b.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Change (Negative for Loss)</label>
              <input
                type="number"
                required
                value={adjustFormData.quantity}
                onChange={e => setAdjustFormData({ ...adjustFormData, quantity: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reason for Variance</label>
              <select
                value={adjustFormData.reason}
                onChange={e => setAdjustFormData({ ...adjustFormData, reason: e.target.value as StockAdjustment['reason'] })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Spoilage">Spoilage / Decayed Produce</option>
                <option value="Transit Damage">Transit / Crushing Damage</option>
                <option value="Count Discrepancy">Physical Audit Count Discrepancy</option>
                <option value="Customer Return">Customer Quality Return</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Detailed Inspection Notes *</label>
            <textarea
              required
              rows={3}
              value={adjustFormData.notes}
              onChange={e => setAdjustFormData({ ...adjustFormData, notes: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="State causes observed, inspector name, or storage temperature context..."
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-[11px] border border-amber-200/70">
            <strong>Policy Check:</strong> Variances with a financial impact exceeding KES 10,000 automatically route to the Operations Manager and Finance Controller for authorization.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
            >
              Post Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
