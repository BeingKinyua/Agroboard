import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, Plus, CheckCircle2, ChevronDown, 
  Building2, UserCheck, ShieldCheck, Menu, X, Sparkles, LogOut, Sprout 
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
    activeModule,
    setActiveModule,
    logout
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const branchMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;

  const branches = [
    'Nairobi Central Hub (Industrial Area)',
    'Mombasa Coastal Depot (Shimanzi)',
    'Eldoret Highland Depot (Kapsoya)'
  ];

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (branchMenuRef.current && !branchMenuRef.current.contains(e.target as Node)) {
        setBranchMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Drawer Toggle & Context / Brand */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={isSidebarOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand mark on mobile */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center justify-center">
            <Sprout className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-slate-900 tracking-tight hidden xs:inline">AGRO BOS</span>
        </div>

        {/* Global Search Button */}
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-100/90 hover:bg-slate-200/70 text-slate-500 text-xs font-medium rounded-lg w-full max-w-[280px] lg:max-w-xs transition-colors border border-transparent hover:border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Search orders, items, clients and POs"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
          <span className="flex-1 truncate text-left hidden xs:inline">Search orders, items, POs...</span>
          <span className="flex-1 truncate text-left xs:hidden">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Facility / Branch Selector (Desktop & Tablet) */}
        <div className="relative hidden lg:block" ref={branchMenuRef}>
          <button
            onClick={() => setBranchMenuOpen(!branchMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-expanded={branchMenuOpen}
            aria-haspopup="true"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="max-w-[150px] truncate">{selectedBranch.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {branchMenuOpen && (
            <div className="absolute left-0 mt-1 w-68 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Operating Facility Hub
              </div>
              {branches.map(branch => (
                <button
                  key={branch}
                  onClick={() => {
                    setSelectedBranch(branch);
                    setBranchMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center justify-between transition-colors ${
                    selectedBranch === branch ? 'text-emerald-700 font-semibold bg-emerald-50/60' : 'text-slate-700'
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
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* AI Operations Copilot */}
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded-lg text-xs font-semibold shadow-xs transition-colors border border-emerald-500/30 min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          title="Open AI Operations Copilot (Gemini 2.5 Flash)"
          aria-label="Open AI Operations Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-white">AI Copilot</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          title="Quick Action"
          aria-label="Open Quick Action Menu"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick Action</span>
        </button>

        {/* Pending Approvals quick badge (Tablet/Desktop) */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveModule('approvals')}
            title={`${pendingApprovalsCount} approvals pending action`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-medium transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Approvals</span>
            <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {pendingApprovalsCount}
            </span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Role Switcher & Active User Profile */}
        <div className="relative border-l border-slate-200 pl-1.5 sm:pl-2.5" ref={roleMenuRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="User account and role menu"
            aria-expanded={roleMenuOpen}
            aria-haspopup="true"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 ring-1 ring-emerald-500/30 shrink-0"
            />
            <div className="text-left hidden xl:block">
              <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1 rounded border border-emerald-200 truncate inline-block">
                {currentUser.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 hidden sm:block" />
          </button>

          {/* Role Switcher Dropdown */}
          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-medium text-emerald-700">{currentUser.roleTitle}</p>
                </div>
              </div>

              <div className="px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Simulate Role Context (RBAC)
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
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
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
                <div className="text-[11px] text-slate-500 px-2.5 py-1.5 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-700">RBAC Active:</span> All views and actions respect role policies.
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
