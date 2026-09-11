import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, PackageCheck, Truck, Users, 
  Package, Boxes, ShoppingBag, ArrowDownToLine, Receipt, 
  Wallet, ShieldCheck, Headphones, BarChart3, FileText, 
  History, Settings, ChevronLeft, ChevronRight, Sprout
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'emerald' | 'amber' | 'rose';
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { 
    activeModule, 
    setActiveModule, 
    hasPermission, 
    orders, 
    inventoryItems, 
    approvals,
    tickets
  } = useApp();

  const openOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = inventoryItems.filter(i => i.status === 'Near Expiry' || i.quantityAvailable < 20).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;

  const navGroups: NavGroup[] = [
    {
      groupName: 'Command & Analytics',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports & BI', icon: BarChart3 }
      ]
    },
    {
      groupName: 'Sales & Fulfillment',
      items: [
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: openOrdersCount, badgeVariant: 'emerald' },
        { id: 'fulfillment', label: 'Fulfillment & Picking', icon: PackageCheck },
        { id: 'deliveries', label: 'Delivery Dispatch', icon: Truck },
        { id: 'customers', label: 'Customers & Institutions', icon: Users },
        { id: 'crm', label: 'CRM & Support', icon: Headphones, badge: openTicketsCount, badgeVariant: 'amber' }
      ]
    },
    {
      groupName: 'Supply & Inventory',
      items: [
        { id: 'products', label: 'Product Catalog', icon: Package },
        { id: 'inventory', label: 'Inventory & Storage', icon: Boxes, badge: lowStockCount, badgeVariant: 'amber' },
        { id: 'procurement', label: 'Procurement & POs', icon: ShoppingBag },
        { id: 'receiving', label: 'Goods Receiving', icon: ArrowDownToLine }
      ]
    },
    {
      groupName: 'Financial Operations',
      items: [
        { id: 'invoicing', label: 'Invoices & Billing', icon: Receipt },
        { id: 'finance', label: 'Finance & Accounts', icon: Wallet }
      ]
    },
    {
      groupName: 'Governance & Security',
      items: [
        { id: 'approvals', label: 'Approval Inbox', icon: ShieldCheck, badge: pendingApprovalsCount, badgeVariant: 'rose' },
        { id: 'documents', label: 'Documents Vault', icon: FileText },
        { id: 'audit', label: 'Audit Trail', icon: History },
        { id: 'admin', label: 'Administration & RBAC', icon: Settings }
      ]
    }
  ];

  const handleNavClick = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="leading-none">
              <span className="text-sm font-bold text-white tracking-tight">AGRO-DELIVERIES</span>
              <span className="block text-[10px] font-mono text-emerald-400 font-semibold tracking-widest mt-0.5">
                OPERATING SYSTEM
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-6 h-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {navGroups.map((group, gIdx) => {
          // Filter items based on user's view permission
          const visibleItems = group.items.filter(it => hasPermission(it.id, 'view'));
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  {group.groupName}
                </p>
              )}
              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;

                const badgeBg = {
                  emerald: 'bg-emerald-500 text-slate-950',
                  amber: 'bg-amber-500 text-slate-950',
                  rose: 'bg-rose-500 text-white'
                }[item.badgeVariant || 'emerald'];

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-400 font-semibold border-l-2 border-emerald-400'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {!isCollapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${badgeBg}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>BOS v2.4 Enterprise</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
          </div>
          <p className="text-[10px] text-slate-600 mt-0.5">Kenya Fresh Chain Grid</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-20 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
