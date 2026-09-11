import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Breadcrumbs } from './components/layout/Breadcrumbs';
import { LoginPage } from './components/auth/LoginPage';

// Global Modals & Drawers
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { QuickActionModal } from './components/modals/QuickActionModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import { AiAssistantModal } from './components/modals/AiAssistantModal';

// Operational Modules
import { DashboardModule } from './components/modules/DashboardModule';
import { OrdersModule } from './components/modules/OrdersModule';
import { FulfillmentModule } from './components/modules/FulfillmentModule';
import { DeliveriesModule } from './components/modules/DeliveriesModule';
import { CustomersModule } from './components/modules/CustomersModule';
import { ProductsModule } from './components/modules/ProductsModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { ProcurementModule } from './components/modules/ProcurementModule';
import { GoodsReceivingModule } from './components/modules/GoodsReceivingModule';
import { InvoicingModule } from './components/modules/InvoicingModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { ApprovalsModule } from './components/modules/ApprovalsModule';
import { CrmModule } from './components/modules/CrmModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { DocumentsModule } from './components/modules/DocumentsModule';
import { AuditLogsModule } from './components/modules/AuditLogsModule';
import { AdminModule } from './components/modules/AdminModule';

import { ShieldAlert, RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeModule, 
    hasPermission, 
    setIsGlobalSearchOpen,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    switchUserRole,
    currentUser,
    isAuthenticated,
    authLoading,
    login
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global hotkey: Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  // Loading state while verifying authentication session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
          <div className="w-4 h-4 rounded-full bg-emerald-400" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-white tracking-wide">AGRO-DELIVERIES KE. BOS</p>
          <p className="text-[11px] text-slate-400">Verifying secure enterprise session...</p>
        </div>
      </div>
    );
  }

  // If unauthenticated: The ONLY normal entry point is the internal Login Page!
  // No public sidebar, header, or operational screens are accessible.
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Check RBAC permission for the active module
  const canViewActiveModule = hasPermission(activeModule, 'view');

  const renderActiveModule = () => {
    if (!canViewActiveModule) {
      return (
        <div className="p-8 bg-white rounded-2xl border border-rose-200 shadow-xs max-w-xl mx-auto my-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Access Restricted by RBAC Policy</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your current simulated role (<strong>{currentUser.roleTitle}</strong>) does not have authorization to view the <strong>{activeModule}</strong> module.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => switchUserRole('operations_manager')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch to Operations Manager (Full Access)</span>
            </button>
          </div>
        </div>
      );
    }

    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'orders':
        return <OrdersModule />;
      case 'fulfillment':
        return <FulfillmentModule />;
      case 'deliveries':
        return <DeliveriesModule />;
      case 'customers':
        return <CustomersModule />;
      case 'products':
        return <ProductsModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'receiving':
        return <GoodsReceivingModule />;
      case 'invoicing':
        return <InvoicingModule />;
      case 'finance':
        return <FinanceModule />;
      case 'approvals':
        return <ApprovalsModule />;
      case 'crm':
        return <CrmModule />;
      case 'reports':
        return <ReportsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'audit':
        return <AuditLogsModule />;
      case 'admin':
        return <AdminModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          isSidebarOpen={isMobileSidebarOpen}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Breadcrumbs />
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <QuickActionModal />
      <NotificationsDrawer />
      <AiAssistantModal 
        isOpen={isAiAssistantOpen} 
        onClose={() => setIsAiAssistantOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
