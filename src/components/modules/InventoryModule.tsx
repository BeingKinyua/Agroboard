import React, { useState } from 'react';
import { 
  Boxes, AlertTriangle, ArrowDownUp, Plus, Search, Filter, 
  Calendar, Thermometer, ShieldAlert, CheckCircle2, History,
  Activity, Layers, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryBatch, StockAdjustment } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

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
    <div className="space-y-5 sm:space-y-6">
      {/* Page Header */}
      <PageHeader
        category="Catalog & Cold-Chain Storage"
        title="Inventory & Cold Storage Control"
        description="Real-time batch traceability, expiry countdowns, warehouse bins, and wastage discrepancy audits."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {inventoryItems.length} Active Batches
          </span>
        }
        primaryAction={
          hasPermission('inventory', 'create')
            ? {
                label: 'Log Stock Adjustment',
                icon: <ArrowDownUp className="w-4 h-4" />,
                onClick: () => setIsAdjustModalOpen(true),
                variant: 'primary',
              }
            : undefined
        }
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Tracked Batches</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inventoryItems.length} Batches</p>
          <span className="text-xs text-slate-400 mt-1 block">Valuation: ~KES {totalValuation.toLocaleString()}</span>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cold Storage Sensor Health</span>
          <div className="flex items-center gap-2 mt-1">
            <Thermometer className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-2xl font-bold text-slate-900">+4.2°C</span>
            <StatusBadge status="Optimal" size="sm" />
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Cold Rooms A & B operating within 2°C – 6°C</span>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Expiry & Spoilage Watch</span>
          <p className={`text-2xl font-bold mt-1 ${expiringCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {expiringCount} Batches Near Expiry
          </p>
          <span className="text-xs text-rose-600 font-semibold mt-1 block">Priority FIFO dispatch active</span>
        </div>
      </div>

      {/* Responsive Horizontal Tabs */}
      <div className="border-b border-slate-200 flex gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold select-none pb-px">
        <button
          onClick={() => setActiveTab('batches')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'batches'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'batches' ? 'page' : undefined}
        >
          <Boxes className="w-4 h-4 shrink-0" />
          <span>Active Batches ({inventoryItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('adjustments')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'adjustments'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'adjustments' ? 'page' : undefined}
        >
          <History className="w-4 h-4 shrink-0" />
          <span>Wastage & Adjustments ({stockAdjustments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coldchain')}
          className={`pb-3 border-b-2 flex items-center gap-2 whitespace-nowrap px-1 transition-colors min-h-[44px] ${
            activeTab === 'coldchain'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          aria-current={activeTab === 'coldchain' ? 'page' : undefined}
        >
          <Thermometer className="w-4 h-4 shrink-0" />
          <span>Facility Telemetry & Cold Chain</span>
        </button>
      </div>

      {/* Content: Batches View */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by produce, batch #, or bin..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
            />
          </div>

          {filteredBatches.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="No produce batches found"
              description="No batches match your search query."
              actionLabel="Clear Search"
              onAction={() => setSearch('')}
            />
          ) : (
            <>
              {/* Mobile Batches Cards (< 768px) */}
              <div className="md:hidden space-y-3">
                {filteredBatches.map(batch => (
                  <div key={batch.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{batch.productName}</h3>
                        <p className="text-[11px] font-mono text-slate-400">{batch.batchNumber}</p>
                      </div>
                      <StatusBadge status={batch.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Location & Bin</span>
                        <span className="font-medium text-slate-800">{batch.warehouseId}: {batch.storageBin}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Quality Grade</span>
                        <span className="font-semibold text-emerald-700">{batch.inspectionGrade}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Available / Total</span>
                        <span className="font-bold text-slate-900">{batch.quantityAvailable} / {batch.quantityTotal} {batch.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Expiry Date</span>
                        <span className={`font-semibold ${batch.status === 'Near Expiry' ? 'text-rose-600' : 'text-slate-700'}`}>
                          {batch.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop/Tablet Horizontal Table (>= 768px) */}
              <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto w-full touch-pan-x">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Batch # & Produce</th>
                        <th className="p-3.5">Storage Bay / Bin</th>
                        <th className="p-3.5">Quality Grade</th>
                        <th className="p-3.5 text-right">Available / Total</th>
                        <th className="p-3.5">Received Date</th>
                        <th className="p-3.5">Expiry Date</th>
                        <th className="p-3.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {filteredBatches.map(batch => (
                        <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{batch.productName}</div>
                            <div className="text-[10px] font-mono text-slate-400">{batch.batchNumber}</div>
                          </td>
                          <td className="p-3.5 font-medium text-slate-700">
                            {batch.warehouseId}: {batch.storageBin}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200/80">
                              {batch.inspectionGrade}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-medium whitespace-nowrap">
                            <span className="text-slate-900 font-bold">{batch.quantityAvailable}</span>
                            <span className="text-slate-400"> / {batch.quantityTotal} {batch.unit}</span>
                          </td>
                          <td className="p-3.5 text-slate-600 whitespace-nowrap">{batch.receivedDate}</td>
                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`font-semibold ${batch.status === 'Near Expiry' ? 'text-rose-600' : 'text-slate-700'}`}>
                              {batch.expiryDate}
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            <StatusBadge status={batch.status} size="sm" />
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

      {/* Content: Adjustments & Spoilage Log */}
      {activeTab === 'adjustments' && (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">Stock Variance & Spoilage History</h3>
            <p className="text-[11px] text-slate-500">Every adjustment is tied to an operator, batch, and financial impact</p>
          </div>
          <div className="overflow-x-auto w-full touch-pan-x">
            <table className="w-full text-xs text-left min-w-[620px]">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Adjustment #</th>
                  <th className="p-3.5">Date & Operator</th>
                  <th className="p-3.5">Product & Batch</th>
                  <th className="p-3.5">Reason</th>
                  <th className="p-3.5 text-right">Quantity Delta</th>
                  <th className="p-3.5 text-right">Cost Impact</th>
                  <th className="p-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stockAdjustments.map(adj => (
                  <tr key={adj.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-mono font-semibold text-slate-900">{adj.adjustmentNumber}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{adj.createdBy}</div>
                      <div className="text-[10px] text-slate-400">{adj.date}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{adj.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{adj.batchNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                        {adj.reason}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 max-w-xs line-clamp-2">{adj.notes}</p>
                    </td>
                    <td className="p-3.5 text-right font-bold text-rose-600 whitespace-nowrap">
                      {adj.quantityDelta}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-slate-900 whitespace-nowrap">
                      KES {adj.costImpact.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center">
                      <StatusBadge status={adj.status} size="sm" />
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
              <StatusBadge status="Delivered" customLabel="Online" size="sm" />
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
              <StatusBadge status="Delivered" customLabel="Online" size="sm" />
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
              <StatusBadge status="Pending" customLabel="Ambient" size="sm" />
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
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            >
              {inventoryItems.map(b => (
                <option key={b.id} value={b.id}>
                  {b.productName} ({b.batchNumber}) — Avail: {b.quantityAvailable} {b.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Change (Negative for Loss)</label>
              <input
                type="number"
                required
                value={adjustFormData.quantity}
                onChange={e => setAdjustFormData({ ...adjustFormData, quantity: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reason for Variance</label>
              <select
                value={adjustFormData.reason}
                onChange={e => setAdjustFormData({ ...adjustFormData, reason: e.target.value as StockAdjustment['reason'] })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
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
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="State causes observed, inspector name, or storage temperature context..."
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-[11px] border border-amber-200/70">
            <strong>Policy Check:</strong> Variances with a financial impact exceeding KES 10,000 automatically route to the Operations Manager and Finance Controller for authorization.
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAdjustModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium min-h-[40px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs min-h-[40px] transition-colors"
            >
              Post Adjustment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
