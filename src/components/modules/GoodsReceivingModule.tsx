import React, { useState } from 'react';
import { 
  ArrowDownToLine, Plus, Search, CheckCircle2, 
  XCircle, Thermometer, ShieldCheck, Calendar, Boxes,
  Building2, ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoodsReceipt } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const GoodsReceivingModule: React.FC = () => {
  const { 
    goodsReceipts, 
    addGoodsReceipt, 
    hasPermission, 
    purchaseOrders, 
    products 
  } = useApp();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New GRN form state
  const [selectedPoId, setSelectedPoId] = useState(purchaseOrders[0]?.id || '');
  const [inspectionGrade, setInspectionGrade] = useState<GoodsReceipt['inspectionGrade']>('Grade A');
  const [temperatureCheck, setTemperatureCheck] = useState('+4.8°C');
  const [quantityReceived, setQuantityReceived] = useState(250);
  const [quantityAccepted, setQuantityAccepted] = useState(245);
  const [quantityRejected, setQuantityRejected] = useState(5);
  const [rejectionReason, setRejectionReason] = useState('Minor transit bruising on 5kg crate');
  const [storageBin, setStorageBin] = useState('Cold Room A (Bin B-03)');

  const filteredReceipts = goodsReceipts.filter(grn => 
    grn.grnNumber.toLowerCase().includes(search.toLowerCase()) ||
    grn.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    grn.poNumber.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPo = purchaseOrders.find(p => p.id === selectedPoId) || purchaseOrders[0];

  const handleCreateGrn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPo) return;

    addGoodsReceipt({
      poId: selectedPo.id,
      poNumber: selectedPo.poNumber,
      supplierName: selectedPo.supplierName,
      receivedDate: new Date().toISOString().substring(0, 10),
      items: [
        {
          productId: selectedPo.items[0]?.productId || 'prod-1',
          productName: selectedPo.items[0]?.productName || 'Fresh Produce',
          quantityReceived: Number(quantityReceived),
          quantityAccepted: Number(quantityAccepted),
          quantityRejected: Number(quantityRejected),
          unit: selectedPo.items[0]?.unit || 'KG',
          rejectionReason: Number(quantityRejected) > 0 ? rejectionReason : undefined
        }
      ],
      inspectionGrade,
      temperatureCheck,
      warehouseBin: storageBin,
      status: 'Verified & Stocked'
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Quality Assurance & Inbound Receiving"
        title="Goods Receiving & QA Inspection (GRN)"
        description="Gate quality inspection, temperature validation, moisture checks, and automatic batch bin creation."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {goodsReceipts.length} Intake GRNs Logged
          </span>
        }
        primaryAction={
          hasPermission('receiving', 'create')
            ? {
                label: 'Process Inbound GRN',
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setIsAddModalOpen(true),
                variant: 'primary',
              }
            : undefined
        }
      />

      {/* Filter and Search */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by GRN #, PO #, or farm supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>
      </div>

      {/* GRN View */}
      {filteredReceipts.length === 0 ? (
        <EmptyState
          icon={ArrowDownToLine}
          title="No goods receipts found"
          description="No inbound deliveries match your search query."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <>
          {/* Mobile GRN Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredReceipts.map(grn => (
              <div key={grn.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{grn.grnNumber}</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{grn.supplierName}</h3>
                    <p className="text-[11px] text-slate-500">PO: {grn.poNumber} · Inspector: {grn.inspectedBy}</p>
                  </div>
                  <StatusBadge status="Delivered" customLabel={grn.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Inspection Grade</span>
                    <span className="font-semibold text-emerald-800">{grn.inspectionGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Temperature Log</span>
                    <span className="font-mono font-bold text-slate-800">{grn.temperatureCheck}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Accepted / Received</span>
                    <span className="font-bold text-slate-900">
                      {grn.items[0]?.quantityAccepted} / {grn.items[0]?.quantityReceived} {grn.items[0]?.unit}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{grn.warehouseBin}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">GRN #</th>
                    <th className="p-3.5">Farm / Co-operative</th>
                    <th className="p-3.5">PO Ref</th>
                    <th className="p-3.5">Inspection Grade</th>
                    <th className="p-3.5">Temp Log</th>
                    <th className="p-3.5 text-right">Accepted / Rcvd</th>
                    <th className="p-3.5">Storage Bay</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReceipts.map(grn => (
                    <tr key={grn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">{grn.grnNumber}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{grn.supplierName}</div>
                        <div className="text-[10px] text-slate-400">Inspector: {grn.inspectedBy}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{grn.poNumber}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                          {grn.inspectionGrade}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-medium text-emerald-700">{grn.temperatureCheck}</td>
                      <td className="p-3.5 text-right font-medium whitespace-nowrap">
                        <span className="text-slate-900 font-bold">{grn.items[0]?.quantityAccepted}</span>
                        <span className="text-slate-400"> / {grn.items[0]?.quantityReceived} {grn.items[0]?.unit}</span>
                        {grn.items[0]?.quantityRejected > 0 && (
                          <span className="block text-[10px] text-rose-600 font-medium">
                            ({grn.items[0]?.quantityRejected} rej: {grn.items[0]?.rejectionReason})
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600">{grn.warehouseBin}</td>
                      <td className="p-3.5 text-center">
                        <StatusBadge status="Delivered" customLabel={grn.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* New GRN Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Intake Inspection & Goods Receipt Note"
        subtitle="Record physical intake from grower transport truck"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateGrn} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Purchase Order *</label>
            <select
              value={selectedPoId}
              onChange={e => setSelectedPoId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
            >
              {purchaseOrders.map(po => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} — {po.supplierName} ({po.items.map(i => i.productName).join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Inspection Grade</label>
              <select
                value={inspectionGrade}
                onChange={e => setInspectionGrade(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Grade A">Grade A (Premium Institutional)</option>
                <option value="Grade 1">Grade 1 (Standard Commercial)</option>
                <option value="Grade 2">Grade 2 (Process Grade)</option>
                <option value="Rejected">Rejected (Unfit for Kitchens)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Truck Core Temp (°C)</label>
              <input
                type="text"
                value={temperatureCheck}
                onChange={e => setTemperatureCheck(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Warehouse Staging Bin</label>
              <input
                type="text"
                value={storageBin}
                onChange={e => setStorageBin(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Received (Gross)</label>
              <input
                type="number"
                value={quantityReceived}
                onChange={e => setQuantityReceived(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Accepted</label>
              <input
                type="number"
                value={quantityAccepted}
                onChange={e => setQuantityAccepted(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-emerald-800 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Rejected</label>
              <input
                type="number"
                value={quantityRejected}
                onChange={e => setQuantityRejected(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-rose-700 font-bold min-h-[42px]"
              />
            </div>
          </div>

          {quantityRejected > 0 && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Rejection Reason</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. Broken cold seal, pest damage, discoloration"
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          )}

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
              Generate GRN & Update Stock
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
