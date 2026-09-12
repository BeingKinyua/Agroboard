import React, { useState } from 'react';
import { 
  PackageCheck, CheckCircle2, Clock, CheckSquare, 
  Square, ArrowRight, Printer, AlertTriangle, Boxes, MapPin,
  ChevronRight, ListOrdered
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const FulfillmentModule: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderItems } = useApp();

  const fulfillmentOrders = orders.filter(
    o => o.status === 'Confirmed' || o.status === 'Picking' || o.status === 'Packed'
  );

  const [activeOrderId, setActiveOrderId] = useState<string>(
    fulfillmentOrders[0]?.id || ''
  );

  const activeOrder = orders.find(o => o.id === activeOrderId) || fulfillmentOrders[0];

  const handleTogglePicked = (order: Order, itemId: string) => {
    const updatedItems = order.items.map(item => {
      if (item.id === itemId) {
        const nextState = !item.picked;
        return {
          ...item,
          picked: nextState,
          quantityPicked: nextState ? item.quantityOrdered : 0
        };
      }
      return item;
    });

    updateOrderItems(order.id, updatedItems);

    // If all items picked, advance order status to Packed if not already
    const allPicked = updatedItems.every(i => i.picked);
    if (allPicked && order.status === 'Picking') {
      updateOrderStatus(order.id, 'Packed');
    }
  };

  const handleStartPicking = (orderId: string) => {
    updateOrderStatus(orderId, 'Picking');
  };

  const handlePackAndSeal = (orderId: string) => {
    updateOrderStatus(orderId, 'Packed');
  };

  const handleStageForDispatch = (orderId: string) => {
    updateOrderStatus(orderId, 'Dispatched');
  };

  const pickingCount = fulfillmentOrders.filter(o => o.status === 'Picking').length;
  const packedCount = fulfillmentOrders.filter(o => o.status === 'Packed').length;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Standardized Page Header */}
      <PageHeader
        category="Warehouse Operations"
        title="Fulfillment & Digital Picking"
        description="Pick produce by batch, confirm weighed quantities, and seal crates for dawn dispatch."
        badge={
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              {pickingCount} In Pick
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
              {packedCount} Sealed in Bay
            </span>
          </div>
        }
      />

      {/* Main Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column: Order Queue */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Picking Queue ({fulfillmentOrders.length})
            </h3>
            <span className="text-[11px] text-slate-400">Select order to inspect</span>
          </div>

          {fulfillmentOrders.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200/80 rounded-xl text-center text-xs text-slate-400 shadow-2xs">
              No orders currently pending warehouse picking.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {fulfillmentOrders.map(order => {
                const isSelected = order.id === (activeOrder?.id || activeOrderId);
                const pickedCount = order.items.filter(i => i.picked).length;
                const totalItems = order.items.length;
                const progressPct = Math.round((pickedCount / totalItems) * 100);

                return (
                  <div
                    key={order.id}
                    onClick={() => setActiveOrderId(order.id)}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/10'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                      <StatusBadge status={order.status} size="sm" />
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">{order.customerName}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{order.deliverySlot}</p>

                    {/* Progress bar */}
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">{pickedCount} / {totalItems} produce items</span>
                        <span className="font-bold text-emerald-800">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Picking Sheet & Actions */}
        <div className="lg:col-span-2">
          {activeOrder ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{activeOrder.orderNumber}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-slate-900">{activeOrder.customerName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Slot: {activeOrder.deliverySlot} · Destination: {activeOrder.deliveryAddress} ({activeOrder.deliveryZone})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {activeOrder.status === 'Confirmed' && (
                    <button
                      onClick={() => handleStartPicking(activeOrder.id)}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors min-h-[40px]"
                    >
                      Start Picking
                    </button>
                  )}
                  {activeOrder.status === 'Picking' && (
                    <button
                      onClick={() => handlePackAndSeal(activeOrder.id)}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors min-h-[40px]"
                    >
                      Pack & Seal Crates
                    </button>
                  )}
                  {activeOrder.status === 'Packed' && (
                    <button
                      onClick={() => handleStageForDispatch(activeOrder.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors min-h-[40px]"
                    >
                      Stage in Dispatch Bay
                    </button>
                  )}
                </div>
              </div>

              {/* Kitchen instructions alert */}
              {activeOrder.notes && (
                <div className="px-4 sm:px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Kitchen Delivery Instructions:</strong> {activeOrder.notes}</span>
                </div>
              )}

              {/* Item Picking Checklist */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Produce Picking & Weighing Checklist
                  </h4>
                  <span className="text-[11px] text-slate-400">Tap items to mark picked</span>
                </div>

                <div className="space-y-2.5">
                  {activeOrder.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleTogglePicked(activeOrder, item.id)}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer select-none min-h-[52px] ${
                        item.picked
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                      role="checkbox"
                      aria-checked={item.picked}
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-slate-400 text-emerald-600 shrink-0">
                          {item.picked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div>
                          <p className={`text-xs font-bold transition-all ${item.picked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span>Req: <strong>{item.quantityOrdered} {item.unit}</strong></span>
                            <span>·</span>
                            <span>Storage: Cold Room A (Bin B-02)</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs shrink-0 pl-2">
                        <span className={`font-semibold text-xs ${item.picked ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {item.picked ? `✓ Picked ${item.quantityOrdered} ${item.unit}` : 'Pending Pick'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Staging instructions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Assigned Staging Bay: <strong>Bay 3 (Upper Hill & Westlands)</strong></span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">Barcode Tag #CRT-{activeOrder.orderNumber}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400 shadow-2xs">
              Select an order from the queue to start digital picking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
