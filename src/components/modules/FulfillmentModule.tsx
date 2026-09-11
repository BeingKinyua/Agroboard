import React, { useState } from 'react';
import { 
  PackageCheck, CheckCircle2, Clock, CheckSquare, 
  Square, ArrowRight, Printer, AlertTriangle, Boxes, MapPin 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { Badge } from '../common/Badge';

export const FulfillmentModule: React.FC = () => {
  const { orders, updateOrderStatus, updateOrderItems } = useApp();

  const fulfillmentOrders = orders.filter(
    o => o.status === 'Confirmed' || o.status === 'Picking' || o.status === 'Packed'
  );

  const [activeOrderId, setActiveOrderId] = useState<string>(
    fulfillmentOrders[0]?.id || ''
  );

  const activeOrder = orders.find(o => o.id === activeOrderId);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Warehouse Fulfillment & Digital Picking</h2>
          <p className="text-xs text-slate-500">Pick produce by batch, confirm weighed quantities, and seal crates for dawn dispatch</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            {fulfillmentOrders.filter(o => o.status === 'Picking').length} Active In Pick
          </Badge>
          <Badge variant="sky" size="md">
            {fulfillmentOrders.filter(o => o.status === 'Packed').length} Sealed in Staging Bay
          </Badge>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Queue */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Picking Queue</h3>
          
          {fulfillmentOrders.length === 0 ? (
            <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
              No orders currently in fulfillment queue.
            </div>
          ) : (
            fulfillmentOrders.map(order => {
              const isSelected = order.id === activeOrderId;
              const pickedCount = order.items.filter(i => i.picked).length;
              const totalItems = order.items.length;
              const progressPct = Math.round((pickedCount / totalItems) * 100);

              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrderId(order.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/40 border-emerald-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">{order.orderNumber}</span>
                    <Badge
                      variant={
                        order.status === 'Packed' ? 'sky' :
                        order.status === 'Picking' ? 'amber' : 'neutral'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-xs text-slate-800 mt-1">{order.customerName}</h4>
                  <p className="text-[11px] text-slate-500">{order.deliverySlot}</p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-500">{pickedCount} of {totalItems} items picked</span>
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
            })
          )}
        </div>

        {/* Right Column: Picking Sheet & Actions */}
        <div className="lg:col-span-2">
          {activeOrder ? (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{activeOrder.orderNumber}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-bold text-slate-800">{activeOrder.customerName}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Slot: {activeOrder.deliverySlot} · Destination: {activeOrder.deliveryAddress} ({activeOrder.deliveryZone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {activeOrder.status === 'Confirmed' && (
                    <button
                      onClick={() => handleStartPicking(activeOrder.id)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                    >
                      Start Picking
                    </button>
                  )}
                  {activeOrder.status === 'Picking' && (
                    <button
                      onClick={() => handlePackAndSeal(activeOrder.id)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                    >
                      Pack & Seal Crates
                    </button>
                  )}
                  {activeOrder.status === 'Packed' && (
                    <button
                      onClick={() => handleStageForDispatch(activeOrder.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
                    >
                      Stage in Dispatch Bay
                    </button>
                  )}
                </div>
              </div>

              {/* Kitchen instructions alert */}
              {activeOrder.notes && (
                <div className="px-5 py-2.5 bg-amber-50/70 border-b border-amber-100 text-xs text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Customer Delivery Note:</strong> {activeOrder.notes}</span>
                </div>
              )}

              {/* Item Picking Checklist */}
              <div className="p-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Produce Picking & Weighing Checklist
                </h4>

                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleTogglePicked(activeOrder, item.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        item.picked
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {item.picked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <p className={`text-xs font-bold ${item.picked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                            {item.productName}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span>Req: <strong>{item.quantityOrdered} {item.unit}</strong></span>
                            <span>·</span>
                            <span>Storage: Cold Room A (Bin B-02)</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <span className={`font-semibold ${item.picked ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {item.picked ? `Picked: ${item.quantityOrdered} ${item.unit}` : 'Unpicked'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Staging instructions */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-slate-400" />
                    <span>Assigned Staging Bay: <strong>Bay 3 (Upper Hill & Westlands)</strong></span>
                  </div>
                  <span className="font-mono text-[11px]">Barcode Crate Tag #CRT-{activeOrder.orderNumber}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
              Select an order from the queue to start digital picking.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
