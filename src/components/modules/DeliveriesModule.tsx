import React, { useState } from 'react';
import { 
  Truck, Plus, Search, MapPin, Calendar, Clock, 
  Phone, UserCheck, CheckCircle2, AlertCircle, FileText 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryRun, DeliveryRunStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const DeliveriesModule: React.FC = () => {
  const { 
    deliveryRuns, 
    addDeliveryRun, 
    updateDeliveryRunStatus, 
    hasPermission, 
    orders 
  } = useApp();

  const [selectedRun, setSelectedRun] = useState<DeliveryRun | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);

  // New run form
  const [routeZone, setRouteZone] = useState('Nairobi North / Runda');
  const [driverName, setDriverName] = useState('Kamau Njoroge');
  const [driverPhone, setDriverPhone] = useState('+254 711 345 678');
  const [vehicleReg, setVehicleReg] = useState('KDA 482M (Isuzu Refrigerated 3T)');
  const [departureTime, setDepartureTime] = useState('05:30 AM');

  // POD form
  const [podReceiverName, setPodReceiverName] = useState('Chef Robert Wanjala');
  const [podReceiverPhone, setPodReceiverPhone] = useState('+254 722 998 877');
  const [podNotes, setPodNotes] = useState('All 4 crates verified fresh, seal unbroken.');

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault();
    addDeliveryRun({
      routeZone,
      driverName,
      driverPhone,
      vehicleRegistration: vehicleReg,
      departureTime,
      status: 'Planned',
      orderCount: 4,
      orders: ['ORD-2026-001', 'ORD-2026-004']
    });
    setIsAddModalOpen(false);
  };

  const handleAdvanceStatus = (run: DeliveryRun, nextStatus: DeliveryRunStatus) => {
    updateDeliveryRunStatus(run.id, nextStatus);
    if (selectedRun && selectedRun.id === run.id) {
      setSelectedRun({ ...selectedRun, status: nextStatus });
    }
  };

  const handleCompletePod = () => {
    if (!selectedRun) return;
    updateDeliveryRunStatus(selectedRun.id, 'Completed');
    setSelectedRun({ ...selectedRun, status: 'Completed' });
    setIsPodModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Fleet & Delivery Route Dispatch</h2>
          <p className="text-xs text-slate-500">Route sequencing, cold chain vehicle dispatch, driver handoffs, and digital POD signoffs</p>
        </div>

        {hasPermission('deliveries', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Delivery Run</span>
          </button>
        )}
      </div>

      {/* Delivery Runs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryRuns.map(run => (
          <div
            key={run.id}
            onClick={() => setSelectedRun(run)}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">{run.runCode}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{run.routeZone}</h3>
                </div>
                <Badge
                  variant={
                    run.status === 'Completed' ? 'success' :
                    run.status === 'In Transit' ? 'sky' :
                    run.status === 'Loading' ? 'amber' : 'neutral'
                  }
                  size="sm"
                >
                  {run.status}
                </Badge>
              </div>

              <div className="mt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Departure: <strong className="text-slate-800">{run.departureTime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{run.vehicleRegistration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{run.driverName} ({run.driverPhone})</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{run.orderCount} Institutional Stops</span>
              <span className="text-emerald-700 font-semibold hover:underline">
                Inspect Route & POD →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Run Drawer / Modal */}
      {selectedRun && (
        <Modal
          isOpen={!!selectedRun}
          onClose={() => setSelectedRun(null)}
          title={`Delivery Dispatch: ${selectedRun.runCode}`}
          subtitle={`${selectedRun.routeZone} · Driver: ${selectedRun.driverName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Status advancement bar */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Route Progression</span>
                <span className="font-bold text-sm text-slate-900 mt-0.5 block">{selectedRun.status}</span>
              </div>

              <div className="flex items-center gap-2">
                {selectedRun.status === 'Planned' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedRun, 'Loading')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Start Vehicle Loading
                  </button>
                )}
                {selectedRun.status === 'Loading' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedRun, 'In Transit')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Gate Departure (In Transit)
                  </button>
                )}
                {selectedRun.status === 'In Transit' && (
                  <button
                    onClick={() => setIsPodModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Record Proof of Delivery (POD)
                  </button>
                )}
                {selectedRun.status === 'Completed' && (
                  <Badge variant="success" size="md">Route Completed & Verified</Badge>
                )}
              </div>
            </div>

            {/* Vehicle & Driver Specs */}
            <div className="grid grid-cols-2 gap-3 p-3.5 border border-slate-200 rounded-lg">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Assigned Vehicle</span>
                <p className="font-bold text-slate-900">{selectedRun.vehicleRegistration}</p>
                <p className="text-[11px] text-slate-500">Equipped with Thermo King Chiller (+4°C)</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Assigned Driver</span>
                <p className="font-bold text-slate-900">{selectedRun.driverName}</p>
                <p className="text-[11px] text-slate-500">{selectedRun.driverPhone}</p>
              </div>
            </div>

            {/* Stops Breakdown */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Customer Stops on this Route</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                {selectedRun.orders.map((ordNum, idx) => {
                  const match = orders.find(o => o.orderNumber === ordNum);
                  return (
                    <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-bold text-slate-800">{ordNum}</span>
                          <span className="font-semibold text-slate-900">{match?.customerName || 'Institutional Customer'}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 ml-7">{match?.deliveryAddress || 'Delivery Address'}</p>
                      </div>
                      <Badge variant={selectedRun.status === 'Completed' ? 'success' : 'neutral'} size="sm">
                        {selectedRun.status === 'Completed' ? 'Delivered' : 'En Route'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Proof of Delivery Modal */}
      <Modal
        isOpen={isPodModalOpen}
        onClose={() => setIsPodModalOpen(false)}
        title="Electronic Proof of Delivery (e-POD)"
        subtitle="Capture kitchen receiving signoff and confirm condition"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Receiving Officer / Chef Name *</label>
            <input
              type="text"
              value={podReceiverName}
              onChange={e => setPodReceiverName(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Receiver Phone Number *</label>
            <input
              type="text"
              value={podReceiverPhone}
              onChange={e => setPodReceiverPhone(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Inspection & Seal Notes</label>
            <textarea
              rows={3}
              value={podNotes}
              onChange={e => setPodNotes(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-800">
            <CheckCircle2 className="w-4 h-4 inline-block mr-1 text-emerald-600" />
            Upon signoff confirmation, related customer orders will update to <strong>Delivered</strong>, trigger invoice release, and notify sales.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsPodModalOpen(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCompletePod}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
            >
              Confirm e-POD Signoff
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Run Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Delivery Run"
        subtitle="Group pending kitchen orders into an optimized route"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Delivery Zone</label>
            <select
              value={routeZone}
              onChange={e => setRouteZone(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Nairobi North / Runda">Nairobi North / Runda & Muthaiga</option>
              <option value="Upper Hill & Hurlingham">Upper Hill & Hurlingham Hospitals</option>
              <option value="Lavington & Kileleshwa">Lavington & Kileleshwa Corridor</option>
              <option value="Nairobi CBD">Nairobi CBD & Riverbank</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Driver Name *</label>
              <input
                type="text"
                required
                value={driverName}
                onChange={e => setDriverName(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Driver Phone *</label>
              <input
                type="text"
                required
                value={driverPhone}
                onChange={e => setDriverPhone(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vehicle Registration</label>
              <input
                type="text"
                value={vehicleReg}
                onChange={e => setVehicleReg(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Departure Time</label>
              <input
                type="text"
                value={departureTime}
                onChange={e => setDepartureTime(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
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
              Dispatch Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
