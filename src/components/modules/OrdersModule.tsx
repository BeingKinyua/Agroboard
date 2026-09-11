import React, { useState } from 'react';
import { 
  ShoppingCart, Plus, Search, Filter, Calendar, 
  MapPin, CheckCircle2, Clock, Truck, FileText, 
  Trash2, ArrowRight, UserCheck, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderItem, OrderStatus } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const OrdersModule: React.FC = () => {
  const { 
    orders, 
    addOrder, 
    updateOrderStatus, 
    hasPermission, 
    customers, 
    products, 
    setActiveModule 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New order form
  const [newOrderCustomerId, setNewOrderCustomerId] = useState<string>(customers[0]?.id || '');
  const [deliveryDate, setDeliveryDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [deliverySlot, setDeliverySlot] = useState<string>('05:00 AM - 07:00 AM (Dawn Kitchen)');
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: number }[]>([
    { productId: products[0]?.id || '', quantity: 50 }
  ]);
  const [orderNotes, setOrderNotes] = useState<string>('Deliver via kitchen rear loading dock.');

  const statuses: (OrderStatus | 'all')[] = [
    'all',
    'Confirmed',
    'Picking',
    'Packed',
    'Dispatched',
    'Delivered',
    'Invoiced'
  ];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.deliveryZone.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddItemRow = () => {
    setOrderItems([...orderItems, { productId: products[0]?.id || '', quantity: 20 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', val: any) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: val };
    setOrderItems(updated);
  };

  // Calculate order items with customer discount
  const selectedCustomer = customers.find(c => c.id === newOrderCustomerId) || customers[0];
  const discountPercent = selectedCustomer?.contract?.specialDiscountPercent || 0;

  const calculatedItems: OrderItem[] = orderItems.map((item, idx) => {
    const prod = products.find(p => p.id === item.productId);
    const unitPrice = prod ? prod.institutionalPrice : 100;
    const discountedPrice = Math.round(unitPrice * (1 - discountPercent / 100));
    const qty = Number(item.quantity) || 1;
    return {
      id: `item-${idx + 1}`,
      productId: item.productId,
      productName: prod ? prod.name : 'Produce Item',
      quantityOrdered: qty,
      quantityPicked: 0,
      unit: prod ? prod.unit : 'KG',
      unitPrice: discountedPrice,
      totalPrice: discountedPrice * qty,
      picked: false
    };
  });

  const totalOrderAmount = calculatedItems.reduce((sum, it) => sum + it.totalPrice, 0);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || calculatedItems.length === 0) return;

    addOrder({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerType: selectedCustomer.type,
      channel: 'Institutional Contract',
      items: calculatedItems,
      totalAmount: totalOrderAmount,
      status: 'Confirmed',
      deliveryDate,
      deliverySlot,
      deliveryAddress: selectedCustomer.address,
      deliveryZone: selectedCustomer.deliveryZone,
      notes: orderNotes
    });

    setIsAddModalOpen(false);
  };

  const handleAdvanceStatus = (order: Order, nextStatus: OrderStatus) => {
    updateOrderStatus(order.id, nextStatus);
    setSelectedOrder({ ...order, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Order Processing & Dispatch Board</h2>
          <p className="text-xs text-slate-500">Track and fulfill institutional produce supply schedules and deliveries</p>
        </div>

        {hasPermission('orders', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Customer Order</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order #, school/hotel, route..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Order #</th>
                <th className="p-3.5">Customer & Institution</th>
                <th className="p-3.5">Delivery Time Slot</th>
                <th className="p-3.5">Route Zone</th>
                <th className="p-3.5">Line Items</th>
                <th className="p-3.5 text-right">Total (KES)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="p-3.5 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{order.customerName}</div>
                    <div className="text-[10px] text-slate-400">{order.customerType} · {order.channel}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <div className="font-medium text-slate-800">{order.deliveryDate}</div>
                    <div className="text-[10px] text-slate-500">{order.deliverySlot}</div>
                  </td>
                  <td className="p-3.5 text-slate-600 truncate max-w-[160px]">{order.deliveryZone}</td>
                  <td className="p-3.5 text-slate-600">{order.items.length} items</td>
                  <td className="p-3.5 text-right font-bold text-slate-900">
                    KES {order.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge
                      variant={
                        order.status === 'Delivered' ? 'success' :
                        order.status === 'Dispatched' ? 'sky' :
                        order.status === 'Picking' || order.status === 'Packed' ? 'amber' : 'neutral'
                      }
                      size="sm"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.orderNumber}`}
          subtitle={`${selectedOrder.customerName} · KES ${selectedOrder.totalAmount.toLocaleString()}`}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs">
            {/* Status & Lifecycle Progression */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-semibold block">Fulfillment Progression</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={selectedOrder.status === 'Delivered' ? 'success' : 'amber'}
                    size="md"
                  >
                    {selectedOrder.status}
                  </Badge>
                  <span className="text-slate-500 text-xs">Slot: {selectedOrder.deliverySlot}</span>
                </div>
              </div>

              {/* Lifecycle Advance Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedOrder.status === 'Confirmed' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Picking')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Start Picking
                  </button>
                )}
                {selectedOrder.status === 'Picking' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Packed')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Pack & Seal
                  </button>
                )}
                {selectedOrder.status === 'Packed' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Dispatched')}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Dispatch with Driver
                  </button>
                )}
                {selectedOrder.status === 'Dispatched' && (
                  <button
                    onClick={() => handleAdvanceStatus(selectedOrder, 'Delivered')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                  >
                    Confirm Delivery (POD)
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Particulars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <h4 className="font-bold text-slate-900">Delivery Address & Zone</h4>
                <p className="text-slate-700">{selectedOrder.deliveryAddress}</p>
                <p className="text-slate-500 font-medium">{selectedOrder.deliveryZone}</p>
                {selectedOrder.notes && (
                  <p className="text-slate-600 pt-1 text-[11px] italic">"{selectedOrder.notes}"</p>
                )}
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                <h4 className="font-bold text-slate-900">Commercial Account</h4>
                <p className="text-slate-700">{selectedOrder.customerName} ({selectedOrder.customerType})</p>
                <p className="text-slate-500">Channel: {selectedOrder.channel}</p>
                {selectedOrder.invoiceId ? (
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      setActiveModule('invoicing');
                    }}
                    className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 pt-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Linked Invoice ({selectedOrder.invoiceId})
                  </button>
                ) : (
                  <span className="text-slate-400 text-[11px] block pt-1">Invoice will be issued upon delivery confirmation.</span>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Order Line Items</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-medium">
                    <tr>
                      <th className="p-2.5">Produce Item</th>
                      <th className="p-2.5 text-right">Quantity Ordered</th>
                      <th className="p-2.5 text-right">Institutional Rate</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                      <th className="p-2.5 text-center">Picking Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-medium text-slate-900">{item.productName}</td>
                        <td className="p-2.5 text-right font-bold">{item.quantityOrdered} {item.unit}</td>
                        <td className="p-2.5 text-right text-slate-600">KES {item.unitPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900">KES {item.totalPrice.toLocaleString()}</td>
                        <td className="p-2.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                            item.picked ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.picked ? '✓ Picked' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right text-slate-700 uppercase text-[11px]">Total Invoice Amount:</td>
                      <td className="p-2.5 text-right text-emerald-800 text-sm">KES {selectedOrder.totalAmount.toLocaleString()}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* New Order Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Customer Order"
        subtitle="Produce requisition for school, hospital, or institutional kitchen"
        maxWidth="3xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer / Institution *</label>
              <select
                value={newOrderCustomerId}
                onChange={e => setNewOrderCustomerId(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.type}) {c.contract ? `· ${c.contract.specialDiscountPercent}% Off` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Delivery Target Date *</label>
              <input
                type="date"
                required
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Delivery Time Window</label>
              <select
                value={deliverySlot}
                onChange={e => setDeliverySlot(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="05:00 AM - 07:00 AM (Dawn Kitchen)">05:00 AM - 07:00 AM (Dawn Kitchen)</option>
                <option value="08:00 AM - 10:30 AM (Morning Service)">08:00 AM - 10:30 AM (Morning Service)</option>
                <option value="01:00 PM - 03:00 PM (Afternoon Restock)">01:00 PM - 03:00 PM (Afternoon Restock)</option>
              </select>
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Order Produce Items</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Produce Item
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {orderItems.map((item, idx) => {
                const prod = products.find(p => p.id === item.productId);
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <select
                        value={item.productId}
                        onChange={e => handleItemChange(idx, 'productId', e.target.value)}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded"
                      >
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.unit}) — KES {p.institutionalPrice} (Stock: {p.currentStock})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-28">
                      <input
                        type="number"
                        min="1"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full p-1.5 bg-white border border-slate-200 rounded text-right font-medium"
                      />
                    </div>

                    <span className="text-slate-500 font-mono text-[11px] w-12 text-center">
                      {prod?.unit || 'KG'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      disabled={orderItems.length === 1}
                      className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kitchen Delivery Notes</label>
            <input
              type="text"
              placeholder="e.g. Call Chef Evans on arrival at gate 3..."
              value={orderNotes}
              onChange={e => setOrderNotes(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Pricing summary */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-emerald-900 block">Total Calculated Order Value:</span>
              <span className="text-[11px] text-emerald-700">
                Includes {discountPercent}% contractual institutional discount
              </span>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-900">KES {totalOrderAmount.toLocaleString()}</span>
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
              Confirm & Book Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
