import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, AlertTriangle, 
  MapPin, Clock, DollarSign, Layers, Tag, ShieldAlert, ArrowUpDown,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const ProductsModule: React.FC = () => {
  const { products, addProduct, hasPermission, suppliers } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    category: ProductCategory;
    unit: Product['unit'];
    baseCost: number;
    sellingPrice: number;
    institutionalPrice: number;
    currentStock: number;
    reorderLevel: number;
    perishable: boolean;
    shelfLifeDays: number;
    primarySupplierId: string;
    warehouseLocation: string;
  }>({
    name: '',
    category: 'Fresh Vegetables',
    unit: 'KG',
    baseCost: 50,
    sellingPrice: 80,
    institutionalPrice: 70,
    currentStock: 100,
    reorderLevel: 30,
    perishable: true,
    shelfLifeDays: 5,
    primarySupplierId: suppliers[0]?.id || 'sup-1',
    warehouseLocation: 'Central Cold Storage - Cold Room A'
  });

  const categories: (ProductCategory | 'all')[] = [
    'all',
    'Fresh Vegetables',
    'Fruits & Berries',
    'Tubers & Roots',
    'Dairy & Eggs',
    'Grains & Pulses'
  ];

  const filtered = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.warehouseLocation.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const supplier = suppliers.find(s => s.id === formData.primarySupplierId);

    addProduct({
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      baseCost: Number(formData.baseCost),
      sellingPrice: Number(formData.sellingPrice),
      institutionalPrice: Number(formData.institutionalPrice),
      currentStock: Number(formData.currentStock),
      reservedStock: 0,
      incomingStock: 0,
      reorderLevel: Number(formData.reorderLevel),
      status: Number(formData.currentStock) <= Number(formData.reorderLevel) ? 'Low Stock' : 'In Stock',
      perishable: formData.perishable,
      shelfLifeDays: Number(formData.shelfLifeDays),
      primarySupplierId: formData.primarySupplierId,
      primarySupplierName: supplier?.name || 'Local Agro Co-op',
      warehouseLocation: formData.warehouseLocation
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Catalog & SKU Master"
        title="Product & Produce Catalog"
        description="Fresh farm produce SKUs, institutional price tiers, shelf-life specifications, and cold chain allocation."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {products.length} Active SKUs
          </span>
        }
        primaryAction={
          hasPermission('products', 'create')
            ? {
                label: 'Add Catalog Product',
                icon: <Plus className="w-4 h-4" />,
                onClick: () => setIsAddModalOpen(true),
                variant: 'primary',
              }
            : undefined
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by produce name, SKU, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {cat === 'all' ? 'All Produce' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List / Cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="No produce items match your current filter or search criteria."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearch('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <>
          {/* Mobile Product Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filtered.map(prod => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5 cursor-pointer hover:border-slate-300"
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">{prod.sku}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{prod.name}</h3>
                    <p className="text-[11px] text-slate-500">{prod.category} · {prod.warehouseLocation}</p>
                  </div>
                  <StatusBadge status={prod.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Institutional Price</span>
                    <span className="font-bold text-emerald-800">KES {prod.institutionalPrice.toLocaleString()} / {prod.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Stock Available</span>
                    <span className={`font-bold ${prod.currentStock <= prod.reorderLevel ? 'text-rose-600' : 'text-slate-900'}`}>
                      {prod.currentStock} {prod.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-slate-500">Base Cost: KES {prod.baseCost}</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Horizontal Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Product & SKU</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Unit</th>
                    <th className="p-3.5 text-right">Base Cost</th>
                    <th className="p-3.5 text-right">Institutional Price</th>
                    <th className="p-3.5 text-right">Current Stock</th>
                    <th className="p-3.5">Cold Chain Location</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map(prod => (
                    <tr
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{prod.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{prod.sku}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{prod.category}</td>
                      <td className="p-3.5 font-medium text-slate-700">{prod.unit}</td>
                      <td className="p-3.5 text-right text-slate-500">KES {prod.baseCost.toLocaleString()}</td>
                      <td className="p-3.5 text-right font-semibold text-emerald-800">
                        KES {prod.institutionalPrice.toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <span className={`font-bold ${prod.currentStock <= prod.reorderLevel ? 'text-rose-600' : 'text-slate-900'}`}>
                          {prod.currentStock} {prod.unit}
                        </span>
                        {prod.reservedStock > 0 && (
                          <span className="block text-[10px] text-slate-400">({prod.reservedStock} reserved)</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 truncate max-w-[180px]">
                        {prod.warehouseLocation}
                      </td>
                      <td className="p-3.5 text-center">
                        <StatusBadge status={prod.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku} · ${selectedProduct.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Stock Availability</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {selectedProduct.currentStock} {selectedProduct.unit}
                </span>
                <span className="text-[11px] text-slate-500">Reorder at {selectedProduct.reorderLevel} {selectedProduct.unit}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Wholesale Institutional</span>
                <span className="text-base font-bold text-emerald-800 mt-0.5 block">
                  KES {selectedProduct.institutionalPrice.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500">Standard Retail: KES {selectedProduct.sellingPrice}</span>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Shelf Life</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {selectedProduct.shelfLifeDays} Days
                </span>
                <span className="text-[11px] text-slate-500">{selectedProduct.perishable ? 'High Perishability' : 'Non-perishable'}</span>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900">Cold Chain Storage & Supplier</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Storage Zone</span>
                  <p className="font-medium text-slate-900">{selectedProduct.warehouseLocation}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Primary Grower / Supplier</span>
                  <p className="font-medium text-slate-900">{selectedProduct.primarySupplierName}</p>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Catalog Produce SKU"
        subtitle="Configure pricing tiers, cold room assignment, and inventory reorder threshold"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Produce Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Organic Baby Spinach"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="Fresh Vegetables">Fresh Vegetables</option>
                <option value="Fruits & Berries">Fruits & Berries</option>
                <option value="Tubers & Roots">Tubers & Roots</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Grains & Pulses">Grains & Pulses</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit of Measure</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value as any })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                <option value="KG">Kilogram (KG)</option>
                <option value="Bunch">Bunch</option>
                <option value="Crate">Crate</option>
                <option value="Bag">Bag</option>
                <option value="Tray">Tray</option>
                <option value="Piece">Piece</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Farmgate Base Cost (KES)</label>
              <input
                type="number"
                value={formData.baseCost}
                onChange={e => setFormData({ ...formData, baseCost: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institutional Price (KES) *</label>
              <input
                type="number"
                required
                value={formData.institutionalPrice}
                onChange={e => setFormData({ ...formData, institutionalPrice: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-emerald-800 min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Initial Stock Count</label>
              <input
                type="number"
                value={formData.currentStock}
                onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reorder Threshold</label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Co-operative / Supplier</label>
              <select
                value={formData.primarySupplierId}
                onChange={e => setFormData({ ...formData, primarySupplierId: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Cold Room / Storage Bay</label>
              <input
                type="text"
                value={formData.warehouseLocation}
                onChange={e => setFormData({ ...formData, warehouseLocation: e.target.value })}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

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
              Save Product SKU
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
