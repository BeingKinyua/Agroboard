import React from 'react';
import { ChevronRight, Home, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

export const Breadcrumbs: React.FC = () => {
  const { activeModule, setActiveModule, selectedBranch } = useApp();

  const moduleNames: Record<ModuleId, { title: string; category: string }> = {
    dashboard: { title: 'Command Center', category: 'Operations' },
    orders: { title: 'Customer Orders', category: 'Operations' },
    fulfillment: { title: 'Fulfillment & Picking', category: 'Operations' },
    deliveries: { title: 'Delivery Dispatch', category: 'Operations' },
    customers: { title: 'Customers & Accounts', category: 'Customers' },
    products: { title: 'Product Catalog', category: 'Catalog' },
    inventory: { title: 'Inventory & Storage', category: 'Catalog' },
    procurement: { title: 'Procurement & POs', category: 'Procurement' },
    receiving: { title: 'Goods Receiving', category: 'Procurement' },
    invoicing: { title: 'Invoices & Billing', category: 'Finance' },
    finance: { title: 'Finance Operations', category: 'Finance' },
    approvals: { title: 'Approvals Inbox', category: 'Governance' },
    crm: { title: 'CRM & Client Service', category: 'Customers' },
    reports: { title: 'Reports & BI', category: 'Insights' },
    documents: { title: 'Document Vault', category: 'Governance' },
    audit: { title: 'Audit Trail', category: 'Governance' },
    admin: { title: 'Admin & RBAC', category: 'Administration' },
  };

  const current = moduleNames[activeModule] || { title: activeModule, category: 'Operations' };

  return (
    <nav 
      className="flex items-center justify-between text-xs text-slate-500 py-2 sm:py-2.5 border-b border-slate-200/70 mb-4 sm:mb-6 select-none"
      aria-label="Breadcrumbs"
    >
      <div className="flex items-center gap-1.5 overflow-hidden text-[11px] sm:text-xs">
        <button
          onClick={() => setActiveModule('dashboard')}
          className="flex items-center gap-1 hover:text-emerald-700 transition-colors font-medium text-slate-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded px-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">BOS</span>
        </button>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        <span className="text-slate-400 truncate hidden sm:inline">
          {current.category}
        </span>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0 hidden sm:inline" />

        <span className="font-bold text-slate-900 truncate">
          {current.title}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
        <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedBranch.split(' ')[0]}</span>
      </div>
    </nav>
  );
};
