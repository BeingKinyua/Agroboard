import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ModuleId } from '../../types';

export const Breadcrumbs: React.FC = () => {
  const { activeModule, setActiveModule, selectedBranch } = useApp();

  const moduleNames: Record<ModuleId, string> = {
    dashboard: 'Command Center Dashboard',
    orders: 'Order Processing & Tracking',
    fulfillment: 'Fulfillment & Picking Center',
    deliveries: 'Fleet & Delivery Dispatch',
    customers: 'Customer & Institutional Accounts',
    products: 'Product & SKU Catalog',
    inventory: 'Inventory & Warehouse Control',
    procurement: 'Procurement & Purchase Orders',
    receiving: 'Goods Receiving & Quality Inspection',
    invoicing: 'Invoicing & Receivables',
    finance: 'Financial Operations & Bank Feeds',
    approvals: 'Centralized Approval Inbox',
    crm: 'CRM, Client Service & Contracts',
    reports: 'Business Intelligence & Reports',
    documents: 'Enterprise Document Vault',
    audit: 'System Audit & Activity Logs',
    admin: 'Administration & RBAC Configuration'
  };

  return (
    <nav className="flex items-center justify-between text-xs text-slate-500 py-3 border-b border-slate-200/60 mb-6">
      <div className="flex items-center gap-1.5 overflow-hidden">
        <button
          onClick={() => setActiveModule('dashboard')}
          className="flex items-center gap-1 hover:text-emerald-700 transition-colors font-medium text-slate-600"
        >
          <Home className="w-3.5 h-3.5" />
          <span>BOS</span>
        </button>

        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />

        <span className="font-semibold text-slate-900 truncate">
          {moduleNames[activeModule] || activeModule}
        </span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <span>{selectedBranch}</span>
      </div>
    </nav>
  );
};
