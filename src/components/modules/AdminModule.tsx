import React, { useState } from 'react';
import { 
  Settings, Users, Shield, Lock, Check, 
  X, CheckSquare, Square, Building2, Sliders, RefreshCw, UserPlus, Mail, ShieldCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, ModuleId, PermissionAction } from '../../types';
import { Badge } from '../common/Badge';
import { AdminInviteModal } from './AdminInviteModal';

export const AdminModule: React.FC = () => {
  const { users, currentUser, switchUserRole, inviteMember, hasPermission } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'rbac' | 'system'>('rbac');
  const [selectedRoleForMatrix, setSelectedRoleForMatrix] = useState<UserRole>('operations_manager');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // RBAC Matrix Mock Interactive State
  const modulesList: { id: ModuleId; label: string }[] = [
    { id: 'dashboard', label: 'Command Dashboard' },
    { id: 'orders', label: 'Orders & Dispatch' },
    { id: 'fulfillment', label: 'Fulfillment & Picking' },
    { id: 'deliveries', label: 'Fleet & Deliveries' },
    { id: 'customers', label: 'Customers & Institutions' },
    { id: 'products', label: 'Product Catalog' },
    { id: 'inventory', label: 'Inventory & Cold Storage' },
    { id: 'procurement', label: 'Procurement & Farmer POs' },
    { id: 'receiving', label: 'Goods Receiving (GRN)' },
    { id: 'invoicing', label: 'Invoices & Receivables' },
    { id: 'finance', label: 'Treasury & Bank Feeds' },
    { id: 'approvals', label: 'Approval Inbox' },
    { id: 'admin', label: 'Administration & RBAC' }
  ];

  const actionsList: PermissionAction[] = ['view', 'create', 'edit', 'approve', 'delete', 'export'];

  // Local state for role matrix to allow interactive toggling
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, string[]>>>({
    executive: {
      dashboard: ['view', 'export'],
      orders: ['view', 'export'],
      fulfillment: ['view'],
      deliveries: ['view'],
      customers: ['view', 'export'],
      products: ['view'],
      inventory: ['view', 'export'],
      procurement: ['view', 'approve', 'export'],
      receiving: ['view'],
      invoicing: ['view', 'approve', 'export'],
      finance: ['view', 'approve', 'export'],
      approvals: ['view', 'approve'],
      admin: ['view']
    },
    operations_manager: {
      dashboard: ['view'],
      orders: ['view', 'create', 'edit', 'approve', 'export'],
      fulfillment: ['view', 'create', 'edit', 'approve'],
      deliveries: ['view', 'create', 'edit', 'approve'],
      customers: ['view', 'create', 'edit'],
      products: ['view', 'create', 'edit'],
      inventory: ['view', 'create', 'edit', 'approve', 'export'],
      procurement: ['view', 'create', 'edit', 'approve'],
      receiving: ['view', 'create', 'edit', 'approve'],
      invoicing: ['view'],
      finance: ['view'],
      approvals: ['view', 'approve'],
      admin: ['view']
    },
    sales_rep: {
      dashboard: ['view'],
      orders: ['view', 'create', 'edit'],
      fulfillment: ['view'],
      deliveries: ['view'],
      customers: ['view', 'create', 'edit'],
      products: ['view'],
      invoicing: ['view'],
      crm: ['view', 'create', 'edit']
    },
    procurement_officer: {
      dashboard: ['view'],
      products: ['view'],
      inventory: ['view'],
      procurement: ['view', 'create', 'edit', 'export'],
      receiving: ['view', 'create']
    },
    storekeeper: {
      dashboard: ['view'],
      orders: ['view'],
      fulfillment: ['view', 'create', 'edit'],
      inventory: ['view', 'create', 'edit'],
      receiving: ['view', 'create', 'edit'],
      products: ['view']
    },
    finance_officer: {
      dashboard: ['view'],
      orders: ['view'],
      customers: ['view'],
      invoicing: ['view', 'create', 'edit', 'approve', 'export'],
      finance: ['view', 'create', 'edit', 'approve', 'export'],
      approvals: ['view', 'approve'],
      procurement: ['view']
    },
    admin: {
      dashboard: ['view', 'export'],
      orders: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      fulfillment: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      deliveries: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      customers: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      products: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      inventory: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      procurement: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      receiving: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      invoicing: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      finance: ['view', 'create', 'edit', 'approve', 'delete', 'export'],
      approvals: ['view', 'approve', 'delete', 'export'],
      crm: ['view', 'create', 'edit', 'delete', 'export'],
      reports: ['view', 'export'],
      documents: ['view', 'create', 'export'],
      audit: ['view', 'export'],
      admin: ['view', 'create', 'edit', 'approve', 'delete', 'export']
    }
  });

  const togglePermission = (moduleId: ModuleId, action: PermissionAction) => {
    const current = rolePermissions[selectedRoleForMatrix]?.[moduleId] || [];
    const exists = current.includes(action);
    const updated = exists ? current.filter(a => a !== action) : [...current, action];

    setRolePermissions({
      ...rolePermissions,
      [selectedRoleForMatrix]: {
        ...rolePermissions[selectedRoleForMatrix],
        [moduleId]: updated
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Administration & Dynamic RBAC Governance</h2>
          <p className="text-xs text-slate-500">Manage user accounts, granular role action matrix (View, Create, Edit, Approve, Delete, Export), and system parameters</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'rbac'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Role-Based Access Matrix (RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'users'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'system'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>System & Hub Configuration</span>
        </button>
      </div>

      {/* RBAC Matrix Tab */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Configure Role Capabilities</span>
              <p className="text-[11px] text-slate-500">Select a role to inspect and tune module action privileges</p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['operations_manager', 'executive', 'sales_rep', 'procurement_officer', 'storekeeper', 'finance_officer', 'admin'] as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setSelectedRoleForMatrix(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedRoleForMatrix === r
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Module</th>
                  {actionsList.map(act => (
                    <th key={act} className="p-3.5 text-center uppercase text-[10px] tracking-wider">
                      {act}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {modulesList.map(mod => {
                  const perms = rolePermissions[selectedRoleForMatrix]?.[mod.id] || [];
                  return (
                    <tr key={mod.id} className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">{mod.label}</td>
                      {actionsList.map(act => {
                        const hasAct = perms.includes(act);
                        return (
                          <td key={act} className="p-3.5 text-center">
                            <button
                              onClick={() => togglePermission(mod.id, act)}
                              className={`p-1 rounded transition-colors ${
                                hasAct
                                  ? 'text-emerald-700 hover:text-emerald-800 bg-emerald-50'
                                  : 'text-slate-300 hover:text-slate-400'
                              }`}
                            >
                              {hasAct ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Directory Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Internal Personnel Directory</span>
              <p className="text-[11px] text-slate-500">
                Authoritative user registry. No public self-registration is permitted.
              </p>
            </div>

            {(currentUser.role === 'admin' || currentUser.role === 'executive' || hasPermission('admin', 'create')) && (
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Invite Member</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(u => {
              const statusStr = String(u.status || 'Active');
              const isInvited = statusStr.toLowerCase() === 'invited';
              const isActive = statusStr.toLowerCase() === 'active';
              return (
                <div key={u.id} className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{u.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                    </div>
                    <Badge
                      variant={isActive ? 'success' : isInvited ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {isInvited ? 'Invited' : isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Hub:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[170px]">{u.branch}</span>
                    </div>
                    {u.invitedBy && (
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Invited by:</span>
                        <span>{u.invitedBy}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold text-[11px]">{u.roleTitle}</span>
                    <button
                      onClick={() => switchUserRole(u.role)}
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Simulate Role
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <AdminInviteModal
            isOpen={isInviteModalOpen}
            onClose={() => setIsInviteModalOpen(false)}
            onInvite={inviteMember}
          />
        </div>
      )}

      {/* System Settings Tab */}
      {activeTab === 'system' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Enterprise Facility Hubs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 border border-slate-200 rounded-lg">
                <p className="font-bold text-slate-900">Nairobi Central Hub</p>
                <p className="text-slate-500">Commercial Street, Industrial Area</p>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Cold Storage & Primary Fleet Hub</span>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg">
                <p className="font-bold text-slate-900">Mombasa Coastal Depot</p>
                <p className="text-slate-500">Shimanzi Industrial District</p>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Hospitality & Hotel Supply Hub</span>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg">
                <p className="font-bold text-slate-900">Eldoret Highland Depot</p>
                <p className="text-slate-500">Kapsoya / Uganda Road Corridor</p>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-1">Farmgate Intake & North Rift Hub</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Operational Control Bounds</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block">Purchase Order Approval Threshold</span>
                <span className="text-slate-500">Orders exceeding KES 50,000 route to Procurement Lead</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold block">Stock Spoilage Approval Threshold</span>
                <span className="text-slate-500">Losses exceeding KES 10,000 require Operations Manager signoff</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
