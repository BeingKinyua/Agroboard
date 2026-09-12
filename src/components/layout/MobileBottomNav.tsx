import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Boxes, ShieldCheck, 
  Menu, Bell, Truck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

interface MobileBottomNavProps {
  onOpenMore: () => void;
  isMoreOpen?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  onOpenMore, 
  isMoreOpen = false 
}) => {
  const { 
    activeModule, 
    setActiveModule, 
    hasPermission, 
    orders, 
    inventoryItems, 
    approvals,
    notifications 
  } = useApp();

  const openOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const criticalStockCount = inventoryItems.filter(i => i.status === 'Near Expiry' || i.quantityAvailable < 20).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  const destinations: {
    id: ModuleId | 'more';
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeVariant?: 'emerald' | 'amber' | 'rose';
    action?: () => void;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: openOrdersCount,
      badgeVariant: 'emerald',
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: criticalStockCount,
      badgeVariant: 'amber',
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: ShieldCheck,
      badge: pendingApprovalsCount,
      badgeVariant: 'rose',
    },
    {
      id: 'more',
      label: 'More',
      icon: Menu,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeVariant: 'amber',
      action: onOpenMore,
    },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around safe-bottom select-none"
      aria-label="Mobile Navigation"
    >
      {destinations.map(dest => {
        const Icon = dest.icon;
        const isMore = dest.id === 'more';
        const isActive = isMore ? isMoreOpen : activeModule === dest.id;

        // Check permission if it's a module
        if (!isMore && !hasPermission(dest.id as ModuleId, 'view')) {
          return null;
        }

        const badgeBg = {
          emerald: 'bg-emerald-500 text-white',
          amber: 'bg-amber-500 text-slate-950',
          rose: 'bg-rose-500 text-white',
        }[dest.badgeVariant || 'emerald'];

        return (
          <button
            key={dest.id}
            onClick={() => {
              if (dest.action) {
                dest.action();
              } else {
                setActiveModule(dest.id as ModuleId);
              }
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isActive
                ? 'text-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-900 active:scale-95'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 scale-110' : 'text-slate-500'}`} />
              {dest.badge !== undefined && dest.badge > 0 && (
                <span className={`absolute -top-1.5 -right-2.5 px-1 min-w-[16px] h-4 text-[9px] font-bold rounded-full flex items-center justify-center shadow-2xs ${badgeBg}`}>
                  {dest.badge > 99 ? '99+' : dest.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">
              {dest.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
