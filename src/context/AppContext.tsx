import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, ModuleId, PermissionAction, Customer, Supplier, 
  Product, InventoryItem, Order, OrderItem, OrderStatus, DeliveryRun, 
  PurchaseOrder, POStatus, GoodsReceivedNote, Invoice, PaymentTransaction, 
  BankStatementItem, ApprovalRequest, SupportTicket, AuditLogEntry, 
  NotificationItem, AppDocument, StockAdjustment 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_CUSTOMERS, INITIAL_SUPPLIERS, 
  INITIAL_PRODUCTS, INITIAL_INVENTORY_ITEMS, INITIAL_ORDERS, 
  INITIAL_DELIVERY_RUNS, INITIAL_PURCHASE_ORDERS, INITIAL_GOODS_RECEIPTS, 
  INITIAL_INVOICES, INITIAL_PAYMENTS, INITIAL_BANK_FEED, 
  INITIAL_APPROVALS, INITIAL_TICKETS, INITIAL_STOCK_ADJUSTMENTS, 
  INITIAL_AUDIT_LOGS, INITIAL_NOTIFICATIONS, INITIAL_DOCUMENTS 
} from '../mock/initialData';
import { StandardPermission, BosRoleKey, SYSTEM_ROLES } from '../lib/rbac/permissions';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  users: User[];
  
  // Enterprise Authentication & Session State
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{
    success: boolean;
    error?: string;
    isBlocked?: boolean;
  }>;
  logout: () => void;
  inviteMember: (data: {
    fullName: string;
    workEmail: string;
    roleId: BosRoleKey;
    branch: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;

  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
  
  selectedBranch: string;
  setSelectedBranch: (branch: string) => void;
  
  hasPermission: (module: ModuleId, action: PermissionAction) => boolean;
  hasStandardPermission: (permission: StandardPermission) => boolean;
  
  // Modals & Panels
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  
  // Data entities & operations
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'code'>) => void;
  updateCustomer: (customer: Customer) => void;
  
  suppliers: Supplier[];
  
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'sku'>) => void;
  updateProduct: (product: Product) => void;
  
  inventoryItems: InventoryItem[];
  stockAdjustments: StockAdjustment[];
  addStockAdjustment: (adj: Omit<StockAdjustment, 'id' | 'date' | 'adjustedBy'>) => void;
  
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateItemPicked: (orderId: string, productId: string, pickedQty: number) => void;
  updateOrderItems: (orderId: string, items: OrderItem[]) => void;
  
  deliveryRuns: DeliveryRun[];
  addDeliveryRun: (run: Omit<DeliveryRun, 'id' | 'runCode'>) => void;
  updateDeliveryRunStatus: (runId: string, status: DeliveryRun['status']) => void;
  
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate'>) => void;
  updatePOStatus: (poId: string, status: POStatus) => void;
  
  goodsReceipts: GoodsReceivedNote[];
  addGoodsReceipt: (grn: Omit<GoodsReceivedNote, 'id' | 'grnNumber' | 'receiverStaff'> & { receivedDate?: string }) => void;
  
  invoices: Invoice[];
  generateInvoiceFromOrder: (order: Order) => void;
  
  payments: PaymentTransaction[];
  recordPayment: (payment: any) => void;
  addPayment: (payment: any) => void;
  
  bankFeed: BankStatementItem[];
  matchBankItem: (bankItemId: string, invoiceId: string) => void;
  
  approvals: ApprovalRequest[];
  resolveApproval: (approvalId: string, decision: 'Approved' | 'Rejected', comment: string) => void;
  processApproval: (approvalId: string, decision: 'Approved' | 'Rejected', comment?: string) => void;
  
  tickets: SupportTicket[];
  addTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdDate' | 'lastUpdated'>) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;
  
  auditLogs: AuditLogEntry[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  documents: AppDocument[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('Nairobi Central Hub (Industrial Area)');
  
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Entities
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>(INITIAL_STOCK_ADJUSTMENTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [deliveryRuns, setDeliveryRuns] = useState<DeliveryRun[]>(INITIAL_DELIVERY_RUNS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceivedNote[]>(INITIAL_GOODS_RECEIPTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [payments, setPayments] = useState<PaymentTransaction[]>(INITIAL_PAYMENTS);
  const [bankFeed, setBankFeed] = useState<BankStatementItem[]>(INITIAL_BANK_FEED);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [documents, setDocuments] = useState<AppDocument[]>(INITIAL_DOCUMENTS);

  // Restore authenticated session safely from secure local token or initialize unauthenticated
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('agro_bos_session_user_id');
      if (savedUserId) {
        const found = users.find(u => u.id === savedUserId);
        if (found && (found.status === 'active' || found.status === 'Active')) {
          setCurrentUser(found);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('agro_bos_session_user_id');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Helper to log audit
  const logAudit = (module: string, action: string, entityId: string, entityType: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentUser.name,
      role: currentUser.roleTitle,
      module,
      action,
      entityId,
      entityType,
      details,
      ipAddress: '192.168.10.' + Math.floor(Math.random() * 80 + 10)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type'], linkModule?: ModuleId, relatedId?: string) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      read: false,
      linkModule,
      relatedId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Enterprise Authentication Sign-In
  const login = async (credentials: { email: string; password: string }) => {
    const cleanEmail = credentials.email.trim().toLowerCase();
    
    // Find in authoritative internal enterprise users
    const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      return {
        success: false,
        error: "We couldn't sign you in with those credentials. Please check your work email and password.",
      };
    }

    // Account status verification
    const statusLower = (matchedUser.status || 'Active').toLowerCase();
    if (statusLower === 'suspended') {
      return {
        success: false,
        isBlocked: true,
        error: "Your account is currently suspended. Please contact your system administrator.",
      };
    }
    if (statusLower === 'disabled' || statusLower === 'inactive') {
      return {
        success: false,
        isBlocked: true,
        error: "This account has been deactivated. Access to Agro-Deliveries Ke. BOS is denied.",
      };
    }
    if (statusLower === 'invited') {
      return {
        success: false,
        isBlocked: true,
        error: "Your invitation has not yet completed initial password activation. Please check your corporate email.",
      };
    }

    // Authenticate user session
    setCurrentUser(matchedUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('agro_bos_session_user_id', matchedUser.id);
    } catch {}

    logAudit(
      'Authentication',
      'USER_LOGIN',
      matchedUser.id,
      'User',
      `Successful login for ${matchedUser.name} (${matchedUser.roleTitle})`
    );

    addNotification(
      'Welcome Back',
      `Logged in as ${matchedUser.name} [${matchedUser.roleTitle}]`,
      'info'
    );

    return { success: true };
  };

  // Enterprise Sign-Out
  const logout = () => {
    logAudit(
      'Authentication',
      'USER_LOGOUT',
      currentUser.id,
      'User',
      `Session terminated by user ${currentUser.name}`
    );
    try {
      localStorage.removeItem('agro_bos_session_user_id');
    } catch {}
    setIsAuthenticated(false);
    setActiveModule('dashboard');
  };

  // Authoritative Member Invitation by Administrator
  const inviteMember = async (data: {
    fullName: string;
    workEmail: string;
    roleId: BosRoleKey;
    branch: string;
  }) => {
    const roleDef = SYSTEM_ROLES[data.roleId];
    if (!roleDef) {
      return { success: false, error: 'Invalid authoritative role specification.' };
    }

    if (users.some(u => u.email.toLowerCase() === data.workEmail.trim().toLowerCase())) {
      return { success: false, error: 'A user account with this work email already exists in the system.' };
    }

    let createdUser: User;
    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok && result.user) {
        createdUser = {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role,
          roleTitle: result.user.roleTitle,
          branch: result.user.branch,
          avatar: result.user.avatar,
          status: 'Invited',
          permissions: {
            dashboard: ['view'],
            orders: ['view'],
            fulfillment: ['view'],
            deliveries: ['view'],
            customers: ['view'],
            products: ['view'],
            inventory: ['view'],
            procurement: ['view'],
            receiving: ['view'],
            invoicing: ['view'],
            finance: ['view'],
            approvals: ['view'],
            crm: ['view'],
            reports: ['view'],
            documents: ['view'],
            audit: ['view'],
            admin: ['view'],
          },
          granularPermissions: roleDef.permissions,
          invitedBy: currentUser.name,
          invitedAt: new Date().toISOString(),
        };
      } else {
        throw new Error(result.error || 'API invocation error');
      }
    } catch {
      // Local authoritative fallback
      createdUser = {
        id: `usr_${Date.now()}`,
        name: data.fullName.trim(),
        email: data.workEmail.trim().toLowerCase(),
        role: data.roleId,
        roleTitle: roleDef.name,
        branch: data.branch,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        status: 'Invited',
        permissions: {
          dashboard: ['view'],
          orders: ['view'],
          fulfillment: ['view'],
          deliveries: ['view'],
          customers: ['view'],
          products: ['view'],
          inventory: ['view'],
          procurement: ['view'],
          receiving: ['view'],
          invoicing: ['view'],
          finance: ['view'],
          approvals: ['view'],
          crm: ['view'],
          reports: ['view'],
          documents: ['view'],
          audit: ['view'],
          admin: ['view'],
        },
        granularPermissions: roleDef.permissions,
        invitedBy: currentUser.name,
        invitedAt: new Date().toISOString(),
      };
    }

    setUsers(prev => [...prev, createdUser]);

    logAudit(
      'Administration',
      'USER_INVITED',
      createdUser.id,
      'User',
      `Administrator invited ${createdUser.name} (${createdUser.email}) as ${createdUser.roleTitle}`
    );

    addNotification(
      'Member Invited',
      `Invitation dispatched to ${createdUser.name} [${createdUser.roleTitle}]`,
      'success',
      'admin',
      createdUser.id
    );

    return { success: true, user: createdUser };
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      logAudit('System', 'ROLE_SWITCH', targetUser.id, 'User', `Context switched to ${targetUser.name} (${targetUser.roleTitle})`);
      addNotification('Role Switched', `Switched active session to ${targetUser.name} [${targetUser.roleTitle}]`, 'info');
    }
  };

  const hasPermission = (module: ModuleId, action: PermissionAction): boolean => {
    const perms = currentUser.permissions[module];
    if (!perms) return false;
    return perms.includes(action);
  };

  const hasStandardPermission = (permission: StandardPermission): boolean => {
    if (!isAuthenticated) return false;
    const roleDef = SYSTEM_ROLES[currentUser.role as BosRoleKey];
    if (roleDef && roleDef.permissions.includes(permission)) return true;
    if (currentUser.granularPermissions?.includes(permission)) return true;
    return false;
  };

  // Customer Operations
  const addCustomer = (customerData: Omit<Customer, 'id' | 'code'>) => {
    const code = `CUST-${customerData.type.substring(0, 3).toUpperCase()}-${String(customers.length + 1).padStart(3, '0')}`;
    const newCust: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      code,
      totalOrdersCount: 0
    };
    setCustomers(prev => [newCust, ...prev]);
    logAudit('Customers', 'CREATE_CUSTOMER', newCust.id, 'Customer', `Added new client: ${newCust.name} (${newCust.code})`);
    addNotification('New Customer Registered', `${newCust.name} added to customer directory.`, 'success', 'customers', newCust.id);
  };

  const updateCustomer = (updated: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    logAudit('Customers', 'UPDATE_CUSTOMER', updated.id, 'Customer', `Updated record for ${updated.name}`);
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'sku'>) => {
    const catCode = prodData.category.substring(0, 3).toUpperCase();
    const sku = `PROD-${catCode}-${String(products.length + 1).padStart(3, '0')}`;
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      sku
    };
    setProducts(prev => [newProd, ...prev]);
    logAudit('Products', 'CREATE_PRODUCT', newProd.id, 'Product', `Created catalog item ${newProd.name} (${newProd.sku})`);
    addNotification('Product Added', `${newProd.name} added to product catalog.`, 'info', 'products', newProd.id);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    logAudit('Products', 'UPDATE_PRODUCT', updated.id, 'Product', `Updated product details for ${updated.name}`);
  };

  // Stock Adjustment
  const addStockAdjustment = (adjData: Omit<StockAdjustment, 'id' | 'date' | 'adjustedBy'>) => {
    const newAdj: StockAdjustment = {
      ...adjData,
      id: `adj-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      adjustedBy: currentUser.name
    };
    setStockAdjustments(prev => [newAdj, ...prev]);

    // If auto-approved or no approval required, update inventory immediately
    if (newAdj.approvalStatus === 'Approved') {
      setProducts(prev => prev.map(p => {
        if (p.id === newAdj.productId) {
          return { ...p, currentStock: Math.max(0, p.currentStock + newAdj.quantityDelta) };
        }
        return p;
      }));
    } else {
      // Create approval request for manager
      const newApproval: ApprovalRequest = {
        id: `app-${Date.now()}`,
        code: `APR-2026-${String(approvals.length + 1).padStart(3, '0')}`,
        type: 'Stock Wastage Write-off',
        entityId: newAdj.id,
        entityName: `${newAdj.productName} (${newAdj.quantityDelta} ${newAdj.unit})`,
        amount: Math.abs(newAdj.quantityDelta * 50),
        requestedBy: currentUser.name,
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        priority: 'Normal',
        details: `Reason: ${newAdj.reason}. Adjustment type: ${newAdj.type}.`,
        status: 'Pending'
      };
      setApprovals(prev => [newApproval, ...prev]);
      addNotification('Approval Required', `Stock adjustment for ${newAdj.productName} requires manager authorization.`, 'warning', 'approvals');
    }

    logAudit('Inventory', 'STOCK_ADJUSTMENT', newAdj.id, 'StockAdjustment', `Adjusted ${newAdj.productName} by ${newAdj.quantityDelta} ${newAdj.unit}. Reason: ${newAdj.reason}`);
  };

  // Order Operations
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate'>) => {
    const orderNumber = `AG-ORD-2026-${1040 + orders.length + 1}`;
    const newOrd: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      orderDate: new Date().toISOString().substring(0, 10)
    };
    setOrders(prev => [newOrd, ...prev]);

    // Update customer stats & reserved stock
    setCustomers(prev => prev.map(c => {
      if (c.id === newOrd.customerId) {
        return {
          ...c,
          totalOrdersCount: c.totalOrdersCount + 1,
          currentBalance: c.currentBalance + newOrd.totalAmount
        };
      }
      return c;
    }));

    // Auto-generate invoice
    generateInvoiceFromOrder(newOrd);

    logAudit('Orders', 'CREATE_ORDER', newOrd.id, 'Order', `Placed order ${newOrd.orderNumber} for ${newOrd.customerName} - KES ${newOrd.totalAmount.toLocaleString()}`);
    addNotification('New Order Received', `${newOrd.customerName} placed order ${newOrd.orderNumber} (KES ${newOrd.totalAmount.toLocaleString()})`, 'info', 'orders', newOrd.id);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const ord = orders.find(o => o.id === orderId);
    if (ord) {
      logAudit('Orders', 'STATUS_CHANGE', orderId, 'Order', `Order ${ord.orderNumber} transitioned to ${status}`);
      addNotification('Order Status Updated', `Order ${ord.orderNumber} is now ${status}`, 'info', 'orders', orderId);
    }
  };

  const updateItemPicked = (orderId: string, productId: string, pickedQty: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(it => it.productId === productId ? { ...it, quantityPicked: pickedQty } : it);
        const allPicked = updatedItems.every(it => it.quantityPicked >= it.quantityOrdered);
        return {
          ...o,
          items: updatedItems,
          status: allPicked ? 'Packed' : 'Picking'
        };
      }
      return o;
    }));
  };

  const updateOrderItems = (orderId: string, items: OrderItem[]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, items } : o));
  };

  // Delivery Run Operations
  const addDeliveryRun = (runData: Omit<DeliveryRun, 'id' | 'runCode'>) => {
    const runCode = `RUN-NAI-${String(deliveryRuns.length + 1).padStart(2, '0')}`;
    const newRun: DeliveryRun = {
      ...runData,
      id: `run-${Date.now()}`,
      runCode
    };
    setDeliveryRuns(prev => [newRun, ...prev]);
    logAudit('Deliveries', 'CREATE_RUN', newRun.id, 'DeliveryRun', `Created route ${newRun.runCode} for ${newRun.routeZone}`);
    addNotification('Delivery Run Created', `${newRun.runCode} scheduled for ${newRun.driverName}`, 'info', 'deliveries', newRun.id);
  };

  const updateDeliveryRunStatus = (runId: string, status: DeliveryRun['status']) => {
    setDeliveryRuns(prev => prev.map(r => r.id === runId ? { ...r, status } : r));
    const targetRun = deliveryRuns.find(r => r.id === runId);
    if (targetRun) {
      logAudit('Deliveries', 'RUN_STATUS', runId, 'DeliveryRun', `Route ${targetRun.runCode} set to ${status}`);
      // Also update linked orders if delivered or in transit
      if (status === 'In Transit') {
        setOrders(prev => prev.map(o => targetRun.orderIds.includes(o.id) ? { ...o, status: 'Dispatched' } : o));
      } else if (status === 'Completed') {
        setOrders(prev => prev.map(o => targetRun.orderIds.includes(o.id) ? { ...o, status: 'Delivered' } : o));
      }
    }
  };

  // Purchase Orders & Receiving
  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdDate'>) => {
    const poNumber = `AG-PO-2026-${String(purchaseOrders.length + 80).padStart(3, '0')}`;
    const newPo: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      poNumber,
      createdDate: new Date().toISOString().substring(0, 10)
    };
    setPurchaseOrders(prev => [newPo, ...prev]);

    // If total > 50,000 KES, add to Approvals inbox
    if (newPo.totalAmount > 50000 && newPo.status === 'Pending Approval') {
      const newApproval: ApprovalRequest = {
        id: `app-${Date.now()}`,
        code: `APR-2026-${String(approvals.length + 1).padStart(3, '0')}`,
        type: 'Purchase Order',
        entityId: newPo.id,
        entityName: `${newPo.poNumber} (${newPo.supplierName})`,
        amount: newPo.totalAmount,
        requestedBy: currentUser.name,
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        priority: newPo.totalAmount > 200000 ? 'Urgent' : 'High',
        details: `Procurement for ${newPo.items.length} line items to ${newPo.supplierName}. Delivery target: ${newPo.expectedDeliveryDate}.`,
        status: 'Pending'
      };
      setApprovals(prev => [newApproval, ...prev]);
      addNotification('PO Awaiting Approval', `${newPo.poNumber} (KES ${newPo.totalAmount.toLocaleString()}) submitted for management approval.`, 'warning', 'approvals');
    }

    logAudit('Procurement', 'CREATE_PO', newPo.id, 'PurchaseOrder', `Created ${newPo.poNumber} to ${newPo.supplierName} (KES ${newPo.totalAmount.toLocaleString()})`);
  };

  const updatePOStatus = (poId: string, status: POStatus) => {
    setPurchaseOrders(prev => prev.map(p => p.id === poId ? { ...p, status } : p));
  };

  const addGoodsReceipt = (grnData: Omit<GoodsReceivedNote, 'id' | 'grnNumber' | 'receivedDate' | 'receiverStaff'>) => {
    const grnNumber = `AG-GRN-2026-${String(goodsReceipts.length + 75).padStart(3, '0')}`;
    const newGrn: GoodsReceivedNote = {
      ...grnData,
      id: `grn-${Date.now()}`,
      grnNumber,
      receivedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      receiverStaff: currentUser.name
    };
    setGoodsReceipts(prev => [newGrn, ...prev]);

    // Update PO status to Completed or Partially Received
    setPurchaseOrders(prev => prev.map(p => {
      if (p.poNumber === newGrn.poNumber) {
        return { ...p, status: 'Received & Closed' };
      }
      return p;
    }));

    // Post to inventory stock
    newGrn.items.forEach(it => {
      if (it.qualityPassed && it.receivedQty > 0) {
        setProducts(prev => prev.map(p => {
          if (p.name.toLowerCase().includes(it.productName.toLowerCase()) || it.productName.toLowerCase().includes(p.name.toLowerCase())) {
            return {
              ...p,
              currentStock: p.currentStock + it.receivedQty,
              status: 'In Stock'
            };
          }
          return p;
        }));
      }
    });

    logAudit('Receiving', 'POST_GRN', newGrn.id, 'GoodsReceivedNote', `Inspected & posted GRN ${newGrn.grnNumber} for PO ${newGrn.poNumber}`);
    addNotification('Goods Received & Stock Posted', `${newGrn.grnNumber} processed by ${newGrn.receiverStaff}`, 'success', 'receiving', newGrn.id);
  };

  // Invoicing & Payments
  const generateInvoiceFromOrder = (order: Order) => {
    const invoiceNumber = `INV-2026-${order.orderNumber.replace('AG-ORD-2026-', '')}`;
    const issueDate = new Date().toISOString().substring(0, 10);
    const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().substring(0, 10);

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      issueDate,
      dueDate,
      subtotal: order.subtotal,
      tax: order.tax,
      totalAmount: order.totalAmount,
      amountPaid: 0,
      balanceDue: order.totalAmount,
      status: 'Issued',
      paymentMethod: 'Bank Transfer (EFT/RTGS)'
    };
    setInvoices(prev => [newInv, ...prev]);

    // Add generated document
    const newDoc: AppDocument = {
      id: `doc-${Date.now()}`,
      docNumber: newInv.invoiceNumber,
      title: `Tax Invoice - ${order.customerName}`,
      category: 'Invoice',
      partyName: order.customerName,
      date: issueDate,
      size: '145 KB',
      fileFormat: 'PDF'
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const recordPayment = (payData: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'allocatedBy'>) => {
    const receiptNumber = `REC-2026-${String(payments.length + 420).padStart(4, '0')}`;
    const newPay: PaymentTransaction = {
      ...payData,
      id: `pay-${Date.now()}`,
      receiptNumber,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      allocatedBy: currentUser.name
    };
    setPayments(prev => [newPay, ...prev]);

    // Update invoice balance
    setInvoices(prev => prev.map(inv => {
      if (inv.id === newPay.invoiceId || inv.invoiceNumber === newPay.invoiceNumber) {
        const newBalance = Math.max(0, inv.balanceDue - newPay.amount);
        return {
          ...inv,
          amountPaid: inv.amountPaid + newPay.amount,
          balanceDue: newBalance,
          status: newBalance === 0 ? 'Paid' : 'Partially Paid'
        };
      }
      return inv;
    }));

    // Update customer balance
    setCustomers(prev => prev.map(c => {
      if (c.id === newPay.customerId) {
        return {
          ...c,
          currentBalance: Math.max(0, c.currentBalance - newPay.amount)
        };
      }
      return c;
    }));

    logAudit('Finance', 'ALLOCATE_PAYMENT', newPay.id, 'PaymentTransaction', `Allocated KES ${newPay.amount.toLocaleString()} for ${newPay.customerName} via ${newPay.channel}`);
    addNotification('Payment Allocated', `KES ${newPay.amount.toLocaleString()} allocated to ${newPay.invoiceNumber}`, 'success', 'finance', newPay.id);
  };

  const addPayment = (payData: any) => {
    recordPayment(payData);
  };

  const matchBankItem = (bankItemId: string, invoiceId: string) => {
    setBankFeed(prev => prev.map(b => b.id === bankItemId ? { ...b, matchedInvoiceId: invoiceId, status: 'Matched' } : b));
    logAudit('Finance', 'BANK_RECONCILE', bankItemId, 'BankFeed', `Reconciled bank feed item with invoice ${invoiceId}`);
    addNotification('Bank Transaction Matched', 'Statement entry successfully reconciled.', 'success', 'finance');
  };

  // Approvals
  const resolveApproval = (approvalId: string, decision: 'Approved' | 'Rejected', comment: string) => {
    setApprovals(prev => prev.map(app => {
      if (app.id === approvalId) {
        return {
          ...app,
          status: decision,
          reviewedBy: currentUser.name,
          reviewDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
          reviewComment: comment
        };
      }
      return app;
    }));

    const appItem = approvals.find(a => a.id === approvalId);
    if (appItem) {
      if (appItem.type === 'Purchase Order' && decision === 'Approved') {
        setPurchaseOrders(prev => prev.map(p => p.id === appItem.entityId ? { ...p, status: 'Approved', approvedBy: currentUser.name } : p));
      } else if (appItem.type === 'Stock Wastage Write-off' && decision === 'Approved') {
        // execute stock write-off
        setStockAdjustments(prev => prev.map(adj => adj.id === appItem.entityId ? { ...adj, approvalStatus: 'Approved' } : adj));
      }

      logAudit('Approvals', decision.toUpperCase(), approvalId, 'ApprovalRequest', `${decision} request ${appItem.code} (${appItem.type}). Note: ${comment}`);
      addNotification('Approval Resolved', `Request ${appItem.code} was ${decision.toLowerCase()} by ${currentUser.name}`, decision === 'Approved' ? 'success' : 'alert', 'approvals');
    }
  };

  const processApproval = (approvalId: string, decision: 'Approved' | 'Rejected', comment?: string) => {
    resolveApproval(approvalId, decision, comment || '');
  };

  // CRM
  const addTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdDate' | 'lastUpdated'>) => {
    const ticketNumber = `TKT-2026-${String(tickets.length + 89).padStart(3, '0')}`;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTkt: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber,
      createdDate: now,
      lastUpdated: now
    };
    setTickets(prev => [newTkt, ...prev]);
    logAudit('CRM', 'CREATE_TICKET', newTkt.id, 'SupportTicket', `Logged ticket ${newTkt.ticketNumber} for ${newTkt.customerName}: ${newTkt.subject}`);
    addNotification('New Support Ticket', `${newTkt.customerName}: ${newTkt.subject}`, 'warning', 'crm', newTkt.id);
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 16) } : t));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        users,
        isAuthenticated,
        authLoading,
        login,
        logout,
        inviteMember,
        hasStandardPermission,
        activeModule,
        setActiveModule,
        selectedBranch,
        setSelectedBranch,
        hasPermission,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        customers,
        addCustomer,
        updateCustomer,
        suppliers,
        products,
        addProduct,
        updateProduct,
        inventoryItems,
        stockAdjustments,
        addStockAdjustment,
        orders,
        addOrder,
        updateOrderStatus,
        updateItemPicked,
        updateOrderItems,
        deliveryRuns,
        addDeliveryRun,
        updateDeliveryRunStatus,
        purchaseOrders,
        addPurchaseOrder,
        updatePOStatus,
        goodsReceipts,
        addGoodsReceipt,
        invoices,
        generateInvoiceFromOrder,
        payments,
        recordPayment,
        addPayment,
        bankFeed,
        matchBankItem,
        approvals,
        resolveApproval,
        processApproval,
        tickets,
        addTicket,
        updateTicketStatus,
        auditLogs,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        documents
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
