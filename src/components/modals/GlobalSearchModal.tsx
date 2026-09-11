import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, Users, Package, ShoppingBag, Receipt, Truck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ModuleId } from '../../types';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    orders, 
    products, 
    customers, 
    suppliers, 
    purchaseOrders, 
    invoices, 
    deliveryRuns,
    setActiveModule 
  } = useApp();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedOrders = orders.filter(
      o => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedProducts = products.filter(
      p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedCustomers = customers.filter(
      c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedPOs = purchaseOrders.filter(
      po => po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedInvoices = invoices.filter(
      inv => inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedRuns = deliveryRuns.filter(
      r => r.runCode.toLowerCase().includes(q) || r.routeZone.toLowerCase().includes(q) || r.driverName.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      orders: matchedOrders,
      products: matchedProducts,
      customers: matchedCustomers,
      pos: matchedPOs,
      invoices: matchedInvoices,
      runs: matchedRuns,
      totalCount: matchedOrders.length + matchedProducts.length + matchedCustomers.length + matchedPOs.length + matchedInvoices.length + matchedRuns.length
    };
  }, [query, orders, products, customers, suppliers, purchaseOrders, invoices, deliveryRuns]);

  const handleSelect = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    setIsGlobalSearchOpen(false);
    setQuery('');
  };

  return (
    <Modal
      isOpen={isGlobalSearchOpen}
      onClose={() => setIsGlobalSearchOpen(false)}
      title="Global Operational Search"
      subtitle="Search permitted records across Agro-Deliveries Ke."
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by Order #, Customer, Produce SKU, Supplier PO, Invoice..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Results */}
        {results ? (
          <div className="max-h-96 overflow-y-auto space-y-4 divide-y divide-slate-100 pr-1">
            {results.totalCount === 0 && (
              <p className="text-center text-xs text-slate-500 py-8">
                No matching records found for "{query}".
              </p>
            )}

            {/* Orders */}
            {results.orders.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" /> Orders ({results.orders.length})
                </p>
                <div className="space-y-1">
                  {results.orders.map(o => (
                    <button
                      key={o.id}
                      onClick={() => handleSelect('orders')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{o.orderNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600">{o.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{o.customerName} · KES {o.totalAmount.toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {results.products.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-sky-600" /> Products & SKUs ({results.products.length})
                </p>
                <div className="space-y-1">
                  {results.products.map(p => (
                    <button
                      key={p.id}
                      onClick={() => handleSelect('products')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{p.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{p.sku}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {p.category} · Stock: {p.currentStock} {p.unit} · KES {p.institutionalPrice} / {p.unit}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customers */}
            {results.customers.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-600" /> Customers & Institutions ({results.customers.length})
                </p>
                <div className="space-y-1">
                  {results.customers.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelect('customers')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{c.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">{c.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{c.deliveryZone} · Balance: KES {c.currentBalance.toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {results.invoices.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" /> Invoices ({results.invoices.length})
                </p>
                <div className="space-y-1">
                  {results.invoices.map(inv => (
                    <button
                      key={inv.id}
                      onClick={() => handleSelect('invoicing')}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{inv.invoiceNumber}</span>
                          <span className="text-[10px] px-1.5 rounded bg-slate-100 text-slate-600">{inv.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{inv.customerName} · KES {inv.totalAmount.toLocaleString()}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            Type keyword to search across orders, produce, institutions, delivery runs and accounts.
          </div>
        )}
      </div>
    </Modal>
  );
};
