import React from 'react';
import { 
  ShoppingCart, ShoppingBag, Boxes, Users, Wallet, 
  Truck, Package, Headphones, ArrowRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { ModuleId, PermissionAction } from '../../types';

export const QuickActionModal: React.FC = () => {
  const { isQuickActionOpen, setIsQuickActionOpen, setActiveModule, hasPermission } = useApp();

  const actions: {
    title: string;
    description: string;
    icon: React.ElementType;
    moduleId: ModuleId;
    permission: PermissionAction;
    color: string;
  }[] = [
    {
      title: 'New Customer Order',
      description: 'Create and dispatch institutional or wholesale order',
      icon: ShoppingCart,
      moduleId: 'orders',
      permission: 'create',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Create Purchase Request / PO',
      description: 'Request fresh produce from farmer co-operatives',
      icon: ShoppingBag,
      moduleId: 'procurement',
      permission: 'create',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: 'Log Stock Adjustment / Wastage',
      description: 'Record rot, transit damage or physical count variance',
      icon: Boxes,
      moduleId: 'inventory',
      permission: 'create',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: 'Register Customer / Institution',
      description: 'Onboard school, hospital, hotel, or restaurant account',
      icon: Users,
      moduleId: 'customers',
      permission: 'create',
      color: 'bg-violet-50 text-violet-700 border-violet-200'
    },
    {
      title: 'Record Payment Allocation',
      description: 'Capture M-Pesa or bank wire receipts against invoices',
      icon: Wallet,
      moduleId: 'finance',
      permission: 'create',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Dispatch Delivery Run',
      description: 'Schedule driver route, assign vehicle and delivery orders',
      icon: Truck,
      moduleId: 'deliveries',
      permission: 'create',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Add Product / SKU',
      description: 'Define produce item, pricing tiers, and reorder levels',
      icon: Package,
      moduleId: 'products',
      permission: 'create',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      title: 'Log Client Support Ticket',
      description: 'Record delivery time complaint, quality check, or inquiry',
      icon: Headphones,
      moduleId: 'crm',
      permission: 'create',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    }
  ];

  const handleAction = (moduleId: ModuleId) => {
    setActiveModule(moduleId);
    setIsQuickActionOpen(false);
  };

  const permittedActions = actions.filter(a => hasPermission(a.moduleId, a.permission));

  return (
    <Modal
      isOpen={isQuickActionOpen}
      onClose={() => setIsQuickActionOpen(false)}
      title="Operational Quick Actions"
      subtitle="Launch frequent operations quickly based on your role permissions"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {permittedActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={() => handleAction(action.moduleId)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white text-left flex items-start gap-3 transition-all group hover:bg-slate-50/70"
            >
              <div className={`p-2.5 rounded-lg border shrink-0 ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </h4>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {permittedActions.length === 0 && (
        <div className="text-center py-6 text-xs text-slate-500">
          Your current active role has read-only access. Switch role to perform operational creation tasks.
        </div>
      )}
    </Modal>
  );
};
