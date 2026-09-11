import React, { useState } from 'react';
import { 
  Search, Bell, Plus, CheckCircle2, ChevronDown, 
  Building2, UserCheck, ShieldCheck, Menu, X, Sparkles, LogOut 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { 
    currentUser, 
    switchUserRole, 
    users, 
    selectedBranch, 
    setSelectedBranch,
    setIsGlobalSearchOpen,
    setIsQuickActionOpen,
    setIsNotificationsOpen,
    setIsAiAssistantOpen,
    notifications,
    approvals,
    setActiveModule,
    logout
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;

  const branches = [
    'Nairobi Central Hub (Industrial Area)',
    'Mombasa Coastal Depot (Shimanzi)',
    'Eldoret Highland Depot (Kapsoya)'
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Global Search Button */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-2 bg-slate-100/80 hover:bg-slate-100 text-slate-500 text-xs font-medium rounded-lg w-full max-w-xs transition-colors border border-transparent hover:border-slate-200 text-left"
        >
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 truncate">Search orders, items, clients, POs...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Branch Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setBranchMenuOpen(!branchMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="max-w-[180px] truncate">{selectedBranch.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {branchMenuOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-40 text-xs">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Facility Branch
              </div>
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setBranchMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                    selectedBranch === branch ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{branch}</span>
                  {selectedBranch === branch && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* AI Operations Copilot */}
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg text-xs font-semibold shadow-xs transition-colors border border-emerald-500/30"
          title="Open AI Operations Copilot (Gemini 2.5 Flash)"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-white">AI Copilot</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick Action</span>
        </button>

        {/* Pending Approvals quick badge */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveModule('approvals')}
            title={`${pendingApprovalsCount} approvals waiting for review`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Approvals</span>
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingApprovalsCount}
            </span>
          </button>
        )}

        {/* Notifications Icon */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Role Switcher & Active User Profile */}
        <div className="relative border-l border-slate-200 pl-2 lg:pl-3">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200 ring-1 ring-emerald-500/30"
            />
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser.name}</p>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 rounded border border-emerald-200">
                  {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Role Switcher Dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                <p className="text-[11px] font-medium text-emerald-600 mt-0.5">{currentUser.roleTitle}</p>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Simulate Role Context
              </div>

              <div className="max-h-60 overflow-y-auto px-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserRole(u.role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors text-xs ${
                      currentUser.id === u.id
                        ? 'bg-emerald-50 text-emerald-900 font-medium'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{u.roleTitle}</p>
                    </div>
                    {currentUser.id === u.id && (
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 mt-1 space-y-1">
                <div className="text-[11px] text-slate-500 px-2 py-1 bg-slate-50 rounded">
                  <span className="font-semibold text-slate-700">RBAC Active:</span> Navigation & permissions adapt in real-time.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRoleMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out of session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
