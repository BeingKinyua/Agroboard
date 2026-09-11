export type UserRole = 
  | 'executive'
  | 'operations_manager'
  | 'sales_rep'
  | 'procurement_officer'
  | 'storekeeper'
  | 'accounts_clerk'
  | 'finance_manager'
  | 'finance_officer'
  | 'delivery_driver'
  | 'admin';

export type PermissionAction = 'view' | 'create' | 'edit' | 'approve' | 'delete' | 'export';

export type ModuleId = 
  | 'dashboard'
  | 'orders'
  | 'fulfillment'
  | 'deliveries'
  | 'customers'
  | 'products'
  | 'inventory'
  | 'procurement'
  | 'receiving'
  | 'invoicing'
  | 'finance'
  | 'approvals'
  | 'crm'
  | 'reports'
  | 'documents'
  | 'audit'
  | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  branch: string;
  status: 'active' | 'inactive' | 'Active' | 'Invited' | 'Suspended' | 'Disabled';
  permissions: Record<ModuleId, PermissionAction[]>;
  granularPermissions?: string[];
  invitedBy?: string;
  invitedAt?: string;
  lastLoginAt?: string;
}

export type CustomerType = 'School' | 'Hospital' | 'Hotel' | 'Restaurant' | 'Corporate' | 'NGO';

export interface Customer {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  deliveryZone: string;
  paymentTerms: 'Immediate' | 'Net-7' | 'Net-15' | 'Net-30' | 'Net-60';
  creditLimit: number;
  currentBalance: number;
  status: 'Active' | 'On Hold' | 'Pending Review';
  totalOrdersCount?: number;
  contract?: {
    contractNumber: string;
    startDate: string;
    renewalDate: string;
    deliveryFrequency: 'Daily 05:00 AM' | 'Mon-Wed-Fri' | 'Weekly Tuesdays' | 'Custom';
    specialDiscountPercent: number;
    requiresPo: boolean;
  };
  notes?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  region: string; // e.g. Kinangop, Naivasha, Meru, Limuru
  contactPerson: string;
  phone: string;
  email: string;
  paymentTerms: 'Cash on Delivery' | 'Net-7' | 'Net-14' | 'Net-30';
  rating: number; // 1 to 5
  activePoCount: number;
  totalSuppliedValue: number;
  status: 'Verified' | 'Pending Audit' | 'Inactive';
  currentBalance?: number;
  leadTimeDays?: number;
  location?: string;
}

export type ProductCategory = 
  | 'Fresh Vegetables'
  | 'Fruits & Berries'
  | 'Tubers & Roots'
  | 'Dairy & Eggs'
  | 'Grains & Pulses'
  | 'Herbs & Spices'
  | 'Packaging & Crates';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unit: 'KG' | 'Crate (20kg)' | 'Sack (50kg)' | 'Bunch' | 'Litre' | 'Tray (30 eggs)' | 'Piece';
  baseCost: number; // KES
  costPrice?: number; // Alias for baseCost
  sellingPrice: number; // Standard KES
  institutionalPrice: number; // Contract discounted KES
  currentStock: number;
  reservedStock: number;
  incomingStock: number;
  reorderLevel: number;
  minStockLevel?: number; // Alias for reorderLevel
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Critical';
  perishable: boolean;
  shelfLifeDays: number;
  primarySupplierId: string;
  primarySupplierName: string;
  warehouseLocation: string; // e.g. Cold Room A - Bay 3
  image?: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  category: ProductCategory;
  warehouse: 'Central Cold Storage' | 'Dry Store A' | 'Ambient Transit Bay' | 'Packaging Bay' | string;
  warehouseId?: string;
  binLocation: string;
  storageBin?: string;
  location?: string;
  batchNumber: string;
  receivedDate: string;
  expiryDate: string;
  quantityAvailable: number;
  quantityReserved: number;
  quantity?: number;
  quantityTotal?: number;
  unitCost: number;
  unit: string;
  inspectionGrade?: string;
  status: 'Good' | 'Near Expiry' | 'Quarantine' | 'Spoiled' | string;
}

export type InventoryBatch = InventoryItem;

export interface StockAdjustment {
  id: string;
  adjustmentNumber?: string;
  productId: string;
  productName: string;
  batchNumber: string;
  type?: 'Wastage / Rot' | 'Transit Damage' | 'Physical Count Variance' | 'Grade Downgrade' | 'Restock' | string;
  quantityDelta: number; // negative for deduction
  unit?: string;
  reason: string;
  notes?: string;
  date: string;
  adjustedBy: string;
  createdBy?: string;
  costImpact?: number;
  status?: string;
  requiresApproval?: boolean;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected' | string;
}

export type OrderStatus = 
  | 'Draft'
  | 'Pending Payment'
  | 'Confirmed'
  | 'Picking'
  | 'Packed'
  | 'Dispatched'
  | 'Delivered'
  | 'Invoiced'
  | 'Cancelled'
  | 'On Hold';

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  sku?: string;
  unit: string;
  quantityOrdered: number;
  quantityPicked: number;
  unitPrice: number;
  totalPrice: number;
  picked?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerType: CustomerType;
  channel: 'Institutional Contract' | 'Direct Phone / Sales' | 'Walk-in Depot' | 'Online Web (Future)';
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  deliveryDate: string;
  deliverySlot: '05:00 AM - 07:00 AM' | '08:00 AM - 11:00 AM' | '01:00 PM - 04:00 PM' | 'Urgent Same Day' | string;
  deliveryAddress: string;
  deliveryZone?: string;
  deliveryRunId?: string;
  notes?: string;
  invoiceId?: string;
  paymentStatus?: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Credit' | string;
}

export type DeliveryRunStatus = 'Scheduled' | 'Planned' | 'Loading' | 'In Transit' | 'Completed' | 'Delayed';

export interface DeliveryRun {
  id: string;
  runCode: string; // e.g. RUN-NAI-01
  routeZone: string; // e.g. Nairobi West & Karen Schools
  driverName: string;
  driverPhone: string;
  vehicleRegistration: string; // e.g. KDA 241X (Isuzu 3T Refrigerated)
  departureTime: string;
  estimatedReturn?: string;
  orderCount: number;
  orderIds?: string[];
  orders?: string[];
  status: DeliveryRunStatus;
  notes?: string;
}

export type POStatus = 
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Issued'
  | 'Partially Received'
  | 'Received & Closed'
  | 'Cancelled';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity?: number;
  quantityOrdered?: number;
  quantityReceived?: number;
  unitCost: number;
  totalCost: number;
  receivedQty?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal?: number;
  totalAmount: number;
  status: POStatus;
  createdDate: string;
  expectedDeliveryDate?: string;
  deliveryExpectedDate?: string;
  requestedBy?: string;
  approvedBy?: string;
  warehouseTarget?: string;
  warehouseDestination?: string;
  paymentTerms?: string;
  requiresApproval?: boolean;
}

export interface GoodsReceivedNote {
  id: string;
  grnNumber: string;
  poNumber: string;
  poId?: string;
  supplierName: string;
  receivedDate: string;
  receiverStaff?: string;
  inspectedBy?: string;
  inspectionGrade?: 'Grade A' | 'Grade 1' | 'Grade 2' | 'Rejected';
  temperatureCheck?: string;
  warehouseBin?: string;
  items: {
    productId?: string;
    productName: string;
    orderedQty?: number;
    receivedQty?: number;
    rejectedQty?: number;
    quantityReceived?: number;
    quantityAccepted?: number;
    quantityRejected?: number;
    unit?: string;
    rejectionReason?: string;
    batchAssigned?: string;
    expiryDate?: string;
    qualityPassed?: boolean;
  }[];
  notes?: string;
  status: 'Inspected & Posted' | 'Quality Quarantine' | 'Draft' | 'Verified & Stocked';
}

export type GoodsReceipt = GoodsReceivedNote;

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  paidAmount?: number;
  balanceDue: number;
  paymentTerms?: string;
  items?: any[];
  status: 'Draft' | 'Issued' | 'Partially Paid' | 'Paid' | 'Overdue';
  paymentMethod?: 'M-Pesa Paybill' | 'Bank Transfer (EFT/RTGS)' | 'Cheque' | 'Cash' | string;
}

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  paymentDate?: string;
  channel: 'M-Pesa Paybill 400222' | 'KCB Bank Wire' | 'NCBA Bank Transfer' | 'Direct Cheque' | string;
  method?: string;
  referenceCode: string; // e.g. QKH78921X
  reference?: string;
  status: 'Reconciled' | 'Pending Allocation' | 'Flagged' | string;
  allocatedBy: string;
}

export interface BankStatementItem {
  id: string;
  date: string;
  reference: string;
  description: string;
  amount: number;
  type: 'Credit' | 'Debit';
  matchedInvoiceId?: string;
  status: 'Matched' | 'Unreconciled';
}

export interface ApprovalRequest {
  id: string;
  code: string;
  type: 'Purchase Order' | 'Stock Wastage Write-off' | 'Customer Credit Limit Override' | 'Special Price Discount' | 'Vendor Payment' | string;
  entityId: string;
  entityName: string;
  amount?: number;
  requestedBy: string;
  requestDate: string;
  timestamp?: string;
  priority: 'Urgent' | 'High' | 'Normal';
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComment?: string;
  approverNotes?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerType?: CustomerType;
  category?: 'Quality Concern' | 'Delivery Delay' | 'Missing Item' | 'Billing Discrepancy' | string;
  subject: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Waiting Customer' | 'Resolved' | 'Closed';
  assignedTo?: string;
  createdDate?: string;
  lastUpdated?: string;
  relatedOrderNumber?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  userRole?: string;
  module: string;
  action: string;
  entityId: string;
  entityType: string;
  details: string;
  ipAddress: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'warning' | 'info' | 'success' | 'alert';
  read: boolean;
  linkModule?: ModuleId;
  relatedId?: string;
}

export interface AppDocument {
  id: string;
  docNumber: string;
  title: string;
  category: 'Invoice' | 'Delivery Note' | 'Purchase Order' | 'GRN' | 'Health & Safety Cert' | 'Contract';
  partyName: string;
  date: string;
  size: string;
  fileFormat: 'PDF' | 'XLSX' | 'DOCX';
}
