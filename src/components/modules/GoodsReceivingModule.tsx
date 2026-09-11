import React, { useState } from 'react';
import { 
  ArrowDownToLine, Plus, Search, CheckCircle2, 
  XCircle, Thermometer, ShieldCheck, Calendar, Boxes 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { GoodsReceipt } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Goods Receiving & Quality Inspection (GRN)</h2>
          <p className="text-xs text-slate-500">Intake quality control, temperature logging, moisture verification, and batch bin allocations</p>
        </div>

        {hasPermission('receiving', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Process Incoming Delivery (GRN)</span>
          </button>
        )}
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by GRN #, PO #, or farm supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* GRN Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {filteredReceipts.map(grn => (
                <tr key={grn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">{grn.grnNumber}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{grn.supplierName}</div>
                    <div className="text-[10px] text-slate-400">Inspector: {grn.inspectedBy}</div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{grn.poNumber}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                      {grn.inspectionGrade}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-medium text-emerald-700">{grn.temperatureCheck}</td>
                  <td className="p-3.5 text-right font-medium">
                    <span className="text-slate-900 font-bold">{grn.items[0]?.quantityAccepted}</span>
                    <span className="text-slate-400"> / {grn.items[0]?.quantityReceived} {grn.items[0]?.unit}</span>
                    {grn.items[0]?.quantityRejected > 0 && (
                      <span className="block text-[10px] text-rose-600 font-medium">
                        ({grn.items[0]?.quantityRejected} rejected: {grn.items[0]?.rejectionReason})
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600">{grn.warehouseBin}</td>
                  <td className="p-3.5 text-center">
                    <Badge variant="success" size="sm">{grn.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {purchaseOrders.map(po => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} — {po.supplierName} ({po.items.map(i => i.productName).join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Inspection Grade</label>
              <select
                value={inspectionGrade}
                onChange={e => setInspectionGrade(e.target.value as any)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Warehouse Staging Bin</label>
              <input
                type="text"
                value={storageBin}
                onChange={e => setStorageBin(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Received (Gross)</label>
              <input
                type="number"
                value={quantityReceived}
                onChange={e => {
                  const rcv = Number(e.target.value);
                  setQuantityReceived(rcv);
                  setQuantityAccepted(rcv - quantityRejected);
                }}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Accepted</label>
              <input
                type="number"
                value={quantityAccepted}
                onChange={e => {
                  const acc = Number(e.target.value);
                  setQuantityAccepted(acc);
                  setQuantityRejected(quantityReceived - acc);
                }}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quantity Rejected</label>
              <input
                type="number"
                value={quantityRejected}
                onChange={e => {
                  const rej = Number(e.target.value);
                  setQuantityRejected(rej);
                  setQuantityAccepted(quantityReceived - rej);
                }}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-rose-700"
              />
            </div>
          </div>

          {quantityRejected > 0 && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reason for Rejection *</label>
              <input
                type="text"
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. pest damage, overripe, rot, crushed crates"
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[11px]">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-emerald-600" />
            Posting this GRN will automatically generate a traceable inventory batch and update PO fulfillment tracking.
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
              Confirm & Post GRN
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
