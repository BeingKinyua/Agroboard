import React, { useState } from 'react';
import { 
  Package, Plus, Search, Filter, AlertTriangle, 
  MapPin, Clock, DollarSign, Layers, Tag, ShieldAlert, ArrowUpDown 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Product & Fresh Produce Catalog</h2>
          <p className="text-xs text-slate-500">Produce SKUs, wholesale pricing tiers, shelf-life monitoring, and stock locations</p>
        </div>

        {hasPermission('products', 'create') && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Catalog Product</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by produce name, SKU, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Produce' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-100">
              {filtered.map(prod => (
                <tr
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{prod.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{prod.sku}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">{prod.category}</td>
                  <td className="p-3.5 font-medium text-slate-700">{prod.unit}</td>
                  <td className="p-3.5 text-right text-slate-500">KES {prod.baseCost.toLocaleString()}</td>
                  <td className="p-3.5 text-right font-semibold text-emerald-800">
                    KES {prod.institutionalPrice.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-right">
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
                    <Badge
                      variant={
                        prod.status === 'In Stock' ? 'success' :
                        prod.status === 'Low Stock' ? 'warning' : 'danger'
                      }
                      size="sm"
                    >
                      {prod.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Detail Drawer */}
      {selectedProduct && (
        <Modal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.sku} · Category: ${selectedProduct.category}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Stock on Hand</span>
                <span className="font-bold text-base text-slate-900 mt-0.5 block">
                  {selectedProduct.currentStock} {selectedProduct.unit}
                </span>
                <span className="text-[10px] text-slate-500">Reorder trigger: {selectedProduct.reorderLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Institutional Contract Rate</span>
                <span className="font-bold text-base text-emerald-700 mt-0.5 block">
                  KES {selectedProduct.institutionalPrice.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">List: KES {selectedProduct.sellingPrice}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gross Unit Margin</span>
                <span className="font-bold text-base text-slate-900 mt-0.5 block">
                  KES {(selectedProduct.institutionalPrice - selectedProduct.baseCost).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {Math.round(((selectedProduct.institutionalPrice - selectedProduct.baseCost) / selectedProduct.institutionalPrice) * 100)}% margin
                </span>
              </div>
            </div>

            {/* Storage & Shelf life */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" /> Warehouse & Cold Storage Location
              </h4>
              <p className="text-slate-700 font-medium">{selectedProduct.warehouseLocation}</p>
              <div className="grid grid-cols-2 gap-3 text-slate-600 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Perishability</span>
                  <span className="font-medium text-slate-900">{selectedProduct.perishable ? 'Perishable Fresh Produce' : 'Non-Perishable / Dry'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase block">Standard Shelf Life</span>
                  <span className="font-medium text-slate-900">{selectedProduct.shelfLifeDays} Days from harvest receiving</span>
                </div>
              </div>
            </div>

            {/* Sourcing Supplier */}
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-slate-900">Primary Farm / Sourcing Supplier</h4>
              <p className="text-slate-700 font-medium">{selectedProduct.primarySupplierName}</p>
              <p className="text-slate-500 text-[11px]">Direct sourcing contract under Kenya GAP fresh produce guidelines.</p>
            </div>
          </div>
        </Modal>
      )}

      {/* New Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Fresh Produce to Catalog"
        subtitle="Specify unit of measure, pricing matrix, and cold storage location"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Produce Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Butternut Squash (Medium Graded)"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Fresh Vegetables">Fresh Vegetables</option>
                <option value="Fruits & Berries">Fruits & Berries</option>
                <option value="Tubers & Roots">Tubers & Roots</option>
                <option value="Dairy & Eggs">Dairy & Eggs</option>
                <option value="Grains & Pulses">Grains & Pulses</option>
                <option value="Herbs & Spices">Herbs & Spices</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Unit of Measure</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value as Product['unit'] })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="KG">KG (Kilograms)</option>
                <option value="Crate (20kg)">Crate (20kg)</option>
                <option value="Sack (50kg)">Sack (50kg)</option>
                <option value="Litre">Litre</option>
                <option value="Tray (30 eggs)">Tray (30 eggs)</option>
                <option value="Bunch">Bunch</option>
                <option value="Piece">Piece</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Base Sourcing Cost (KES)</label>
              <input
                type="number"
                required
                value={formData.baseCost}
                onChange={e => setFormData({ ...formData, baseCost: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institutional Price (KES) *</label>
              <input
                type="number"
                required
                value={formData.institutionalPrice}
                onChange={e => setFormData({ ...formData, institutionalPrice: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Initial Stock</label>
              <input
                type="number"
                value={formData.currentStock}
                onChange={e => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Reorder Level</label>
              <input
                type="number"
                value={formData.reorderLevel}
                onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Shelf Life (Days)</label>
              <input
                type="number"
                value={formData.shelfLifeDays}
                onChange={e => setFormData({ ...formData, shelfLifeDays: Number(e.target.value) })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Storage Bay / Bin</label>
              <input
                type="text"
                value={formData.warehouseLocation}
                onChange={e => setFormData({ ...formData, warehouseLocation: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Supplier</label>
              <select
                value={formData.primarySupplierId}
                onChange={e => setFormData({ ...formData, primarySupplierId: e.target.value })}
                className="w-full p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.region})</option>
                ))}
              </select>
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
              Add Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
