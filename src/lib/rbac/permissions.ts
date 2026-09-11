/**
 * Agro-Deliveries Ke. Business Operating System (BOS)
 * Authoritative RBAC & Permission Architecture
 * 
 * Model: USER -> ROLE -> PERMISSIONS -> MODULES -> ACTIONS
 * Strictly permission-based authorization (not hardcoded role string checks).
 */

export type AccountStatus = 'Active' | 'Invited' | 'Suspended' | 'Disabled';

export type StandardPermission =
  // Dashboard
  | 'dashboard.view'
  | 'dashboard.export'
  // Orders
  | 'orders.view'
  | 'orders.create'
  | 'orders.edit'
  | 'orders.approve'
  | 'orders.export'
  // Customers
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.export'
  // Products
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.export'
  // Inventory
  | 'inventory.view'
  | 'inventory.adjust'
  | 'inventory.transfer'
  | 'inventory.receive'
  | 'inventory.export'
  // Procurement
  | 'procurement.view'
  | 'procurement.create'
  | 'procurement.approve'
  | 'procurement.export'
  // Suppliers
  | 'suppliers.view'
  | 'suppliers.create'
  | 'suppliers.edit'
  | 'suppliers.export'
  // Deliveries / Fulfillment
  | 'deliveries.view'
  | 'deliveries.assign'
  | 'deliveries.dispatch'
  | 'deliveries.export'
  // Finance & Invoicing
  | 'finance.view'
  | 'finance.record_payment'
  | 'finance.allocate_payment'
  | 'finance.reconcile'
  | 'finance.export'
  | 'invoicing.view'
  | 'invoicing.create'
  | 'invoicing.approve'
  | 'invoicing.export'
  // CRM
  | 'crm.view'
  | 'crm.manage'
  // Reports
  | 'reports.view'
  | 'reports.export'
  // Approvals
  | 'approvals.view'
  | 'approvals.approve'
  // Administration (Users, Roles, Permissions)
  | 'administration.users.view'
  | 'administration.users.create'
  | 'administration.users.edit'
  | 'administration.roles.view'
  | 'administration.roles.manage'
  // Audit
  | 'audit.view'
  | 'audit.export';

export type BosRoleKey =
  | 'executive'
  | 'operations_manager'
  | 'sales_rep'
  | 'procurement_officer'
  | 'storekeeper'
  | 'accounts_clerk'
  | 'finance_manager'
  | 'delivery_driver'
  | 'admin';

export interface RoleDefinition {
  id: BosRoleKey;
  name: string;
  description: string;
  isSystemRole: boolean;
  department: 'Executive' | 'Operations' | 'Sales' | 'Procurement' | 'Warehouse' | 'Finance' | 'Logistics' | 'Technology';
  permissions: StandardPermission[];
}

/**
 * Authoritative System Roles and their Assigned Standard Permissions
 */
export const SYSTEM_ROLES: Record<BosRoleKey, RoleDefinition> = {
  executive: {
    id: 'executive',
    name: 'Business Owner / Executive',
    description: 'High-level operational visibility, strategic metrics, executive sign-offs, and company-wide audits.',
    isSystemRole: true,
    department: 'Executive',
    permissions: [
      'dashboard.view', 'dashboard.export',
      'orders.view', 'orders.approve', 'orders.export',
      'customers.view', 'customers.create', 'customers.edit', 'customers.export',
      'products.view', 'products.export',
      'inventory.view', 'inventory.export',
      'procurement.view', 'procurement.approve', 'procurement.export',
      'suppliers.view', 'suppliers.export',
      'deliveries.view', 'deliveries.export',
      'finance.view', 'finance.export',
      'invoicing.view', 'invoicing.export',
      'crm.view',
      'reports.view', 'reports.export',
      'approvals.view', 'approvals.approve',
      'administration.users.view', 'administration.roles.view',
      'audit.view', 'audit.export'
    ]
  },
  operations_manager: {
    id: 'operations_manager',
    name: 'Operations Manager',
    description: 'Full end-to-end management of warehouse packing, logistics routes, inventory movements, and team execution.',
    isSystemRole: true,
    department: 'Operations',
    permissions: [
      'dashboard.view', 'dashboard.export',
      'orders.view', 'orders.create', 'orders.edit', 'orders.approve', 'orders.export',
      'customers.view', 'customers.create', 'customers.edit',
      'products.view', 'products.create', 'products.edit', 'products.export',
      'inventory.view', 'inventory.adjust', 'inventory.transfer', 'inventory.receive', 'inventory.export',
      'procurement.view', 'procurement.create', 'procurement.approve',
      'suppliers.view', 'suppliers.create', 'suppliers.edit',
      'deliveries.view', 'deliveries.assign', 'deliveries.dispatch', 'deliveries.export',
      'finance.view',
      'invoicing.view',
      'crm.view', 'crm.manage',
      'reports.view', 'reports.export',
      'approvals.view', 'approvals.approve',
      'audit.view'
    ]
  },
  sales_rep: {
    id: 'sales_rep',
    name: 'Sales Representative',
    description: 'Institutional client onboarding, sales orders capture, pricing schedules, and customer inquiries.',
    isSystemRole: true,
    department: 'Sales',
    permissions: [
      'dashboard.view',
      'orders.view', 'orders.create', 'orders.edit',
      'customers.view', 'customers.create', 'customers.edit', 'customers.export',
      'products.view',
      'inventory.view',
      'deliveries.view',
      'invoicing.view', 'invoicing.create',
      'crm.view', 'crm.manage',
      'reports.view'
    ]
  },
  procurement_officer: {
    id: 'procurement_officer',
    name: 'Procurement Officer',
    description: 'Farmer cooperative sourcing, purchase order creation, farm-gate price negotiation, and supplier management.',
    isSystemRole: true,
    department: 'Procurement',
    permissions: [
      'dashboard.view',
      'orders.view',
      'products.view', 'products.create', 'products.edit',
      'inventory.view',
      'procurement.view', 'procurement.create', 'procurement.export',
      'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.export',
      'reports.view', 'reports.export'
    ]
  },
  storekeeper: {
    id: 'storekeeper',
    name: 'Storekeeper',
    description: 'Cold storage management, physical counts, goods receiving notes (GRN), and order item picking & packing.',
    isSystemRole: true,
    department: 'Warehouse',
    permissions: [
      'dashboard.view',
      'orders.view',
      'products.view',
      'inventory.view', 'inventory.adjust', 'inventory.transfer', 'inventory.receive', 'inventory.export',
      'deliveries.view',
      'reports.view'
    ]
  },
  accounts_clerk: {
    id: 'accounts_clerk',
    name: 'Accounts Clerk',
    description: 'Invoice issuance, M-Pesa paybill matching, bank statement line verification, and client statements.',
    isSystemRole: true,
    department: 'Finance',
    permissions: [
      'dashboard.view',
      'orders.view',
      'customers.view',
      'invoicing.view', 'invoicing.create', 'invoicing.export',
      'finance.view', 'finance.record_payment', 'finance.allocate_payment',
      'reports.view'
    ]
  },
  finance_manager: {
    id: 'finance_manager',
    name: 'Finance Manager',
    description: 'Comprehensive financial control, bank reconciliation, credit limit approvals, tax declarations, and financial reports.',
    isSystemRole: true,
    department: 'Finance',
    permissions: [
      'dashboard.view', 'dashboard.export',
      'orders.view', 'orders.export',
      'customers.view', 'customers.edit', 'customers.export',
      'suppliers.view', 'suppliers.export',
      'invoicing.view', 'invoicing.create', 'invoicing.approve', 'invoicing.export',
      'finance.view', 'finance.record_payment', 'finance.allocate_payment', 'finance.reconcile', 'finance.export',
      'approvals.view', 'approvals.approve',
      'reports.view', 'reports.export',
      'audit.view'
    ]
  },
  delivery_driver: {
    id: 'delivery_driver',
    name: 'Delivery Driver',
    description: 'Mobile run manifest execution, customer dispatch sign-offs, and delivery status updates.',
    isSystemRole: true,
    department: 'Logistics',
    permissions: [
      'deliveries.view', 'deliveries.dispatch',
      'orders.view'
    ]
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Authoritative system gatekeeper with access to user invitations, role governance, security policies, and audit logs.',
    isSystemRole: true,
    department: 'Technology',
    permissions: [
      'dashboard.view', 'dashboard.export',
      'orders.view', 'orders.create', 'orders.edit', 'orders.approve', 'orders.export',
      'customers.view', 'customers.create', 'customers.edit', 'customers.export',
      'products.view', 'products.create', 'products.edit', 'products.export',
      'inventory.view', 'inventory.adjust', 'inventory.transfer', 'inventory.receive', 'inventory.export',
      'procurement.view', 'procurement.create', 'procurement.approve', 'procurement.export',
      'suppliers.view', 'suppliers.create', 'suppliers.edit', 'suppliers.export',
      'deliveries.view', 'deliveries.assign', 'deliveries.dispatch', 'deliveries.export',
      'finance.view', 'finance.record_payment', 'finance.allocate_payment', 'finance.reconcile', 'finance.export',
      'invoicing.view', 'invoicing.create', 'invoicing.approve', 'invoicing.export',
      'crm.view', 'crm.manage',
      'reports.view', 'reports.export',
      'approvals.view', 'approvals.approve',
      'administration.users.view', 'administration.users.create', 'administration.users.edit',
      'administration.roles.view', 'administration.roles.manage',
      'audit.view', 'audit.export'
    ]
  }
};
