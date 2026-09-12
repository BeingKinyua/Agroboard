import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, PackageCheck, Truck, Users, 
  Package, Boxes, ShoppingBag, ArrowDownToLine, Receipt, 
  Wallet, ShieldCheck, Headphones, BarChart3, FileText, 
  History, Settings, ChevronLeft, ChevronRight, Sprout, 
  Search, X, LogOut, CheckCircle2, Shield 
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
  onCloseMobile,
}) => {
  const { 
    activeModule, 
    setActiveModule, 
    hasPermission, 
    currentUser,
    selectedBranch,
    logout,
    orders, 
    inventoryItems, 
    approvals,
    tickets
  } = useApp();

  const [mobileSearch, setMobileSearch] = useState('');

  const openOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const lowStockCount = inventoryItems.filter(i => i.status === 'Near Expiry' || i.quantityAvailable < 20).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;

  // Grouped Navigation according to enterprise specification
  const navGroups: NavGroup[] = [
    {
      groupName: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: openOrdersCount, badgeVariant: 'emerald' },
        { id: 'fulfillment', label: 'Fulfillment & Picking', icon: PackageCheck },
        { id: 'deliveries', label: 'Deliveries & Dispatch', icon: Truck },
      ],
    },
    {
      groupName: 'Catalog & Storage',
      items: [
        { id: 'products', label: 'Products Catalog', icon: Package },
        { id: 'inventory', label: 'Inventory & Storage', icon: Boxes, badge: lowStockCount, badgeVariant: 'amber' },
      ],
    },
    {
      groupName: 'Procurement',
      items: [
        { id: 'procurement', label: 'Procurement & POs', icon: ShoppingBag },
        { id: 'receiving', label: 'Goods Receiving', icon: ArrowDownToLine },
      ],
    },
    {
      groupName: 'Customers & CRM',
      items: [
        { id: 'customers', label: 'Customers & Accounts', icon: Users },
        { id: 'crm', label: 'CRM & Support', icon: Headphones, badge: openTicketsCount, badgeVariant: 'amber' },
      ],
    },
    {
      groupName: 'Finance',
      items: [
        { id: 'invoicing', label: 'Invoices & Billing', icon: Receipt },
        { id: 'finance', label: 'Finance Operations', icon: Wallet },
      ],
    },
    {
      groupName: 'Insights',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
      ],
    },
    {
      groupName: 'Administration',
      items: [
        { id: 'approvals', label: 'Approvals Inbox', icon: ShieldCheck, badge: pendingApprovalsCount, badgeVariant: 'rose' },
        { id: 'documents', label: 'Document Vault', icon: FileText },
        { id: 'audit', label: 'Audit Trail', icon: History },
        { id: 'admin', label: 'Admin & RBAC Settings', icon: Settings },
      ],
    },
  ];

  const handleNavClick = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    onCloseMobile();
  };

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const renderContent = (isMobile = false) => {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-300 select-none border-r border-slate-800/80">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/90 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-xs">
              <Sprout className="w-4.5 h-4.5 text-emerald-400" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="leading-tight">
                <span className="text-xs font-bold text-white tracking-wider block">AGRO-DELIVERIES</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-widest block">
                  KE. OPERATING SYSTEM
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={isCollapsed ? 'Expand navigation sidebar' : 'Collapse navigation sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mobile Fast Filter */}
        {isMobile && (
          <div className="p-3 border-b border-slate-800 bg-slate-950/20">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mobileSearch}
                onChange={e => setMobileSearch(e.target.value)}
                placeholder="Jump to module..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {mobileSearch && (
                <button 
                  onClick={() => setMobileSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* User Context & Role Pill (Drawer Top on Mobile) */}
        {isMobile && (
          <div className="px-4 py-3 bg-slate-800/40 border-b border-slate-800 flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-9 h-9 rounded-full border border-slate-700 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="truncate">{currentUser.roleTitle}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
          {navGroups.map((group, gIdx) => {
            // Filter items based on user's view permission
            const visibleItems = group.items.filter(it => {
              const hasPerm = hasPermission(it.id, 'view');
              if (!hasPerm) return false;
              if (isMobile && mobileSearch) {
                return it.label.toLowerCase().includes(mobileSearch.toLowerCase());
              }
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {(!isCollapsed || isMobile) && (
                  <p className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {group.groupName}
                  </p>
                )}
                {visibleItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  const badgeBg = {
                    emerald: 'bg-emerald-500 text-slate-950',
                    amber: 'bg-amber-500 text-slate-950',
                    rose: 'bg-rose-500 text-white',
                  }[item.badgeVariant || 'emerald'];

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={isCollapsed && !isMobile ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-400 font-semibold border-l-2 border-emerald-400 shadow-2xs'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      {(!isCollapsed || isMobile) && (
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      )}
                      {(!isCollapsed || isMobile) && item.badge !== undefined && item.badge > 0 && (
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

        {/* Footer Info & Operational Node */}
        {(!isCollapsed || isMobile) ? (
          <div className="p-3.5 border-t border-slate-800/90 bg-slate-950/60 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300">BOS v2.4 Enterprise</span>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 truncate">{selectedBranch}</p>

            {isMobile && (
              <button
                onClick={logout}
                className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 text-xs font-medium py-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out Workspace</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-2 border-t border-slate-800 flex justify-center py-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="System Operational" />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop / Tablet Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-20 ${
          isCollapsed ? 'w-18' : 'w-64'
        }`}
        aria-label="Desktop navigation"
      >
        {renderContent(false)}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile} 
          />
          {/* Drawer content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
