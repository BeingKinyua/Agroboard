import { z } from 'zod';

// Customer Validation Schema
export const CustomerSchema = z.object({
  name: z.string().min(2, 'Customer name must be at least 2 characters'),
  type: z.enum(['School', 'Hospital', 'Hotel', 'Restaurant', 'Commercial Kitchen', 'Supermarket']),
  contactPerson: z.string().min(2, 'Contact person name is required'),
  phone: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, 'Enter a valid Kenyan phone number (e.g. 0712345678)'),
  email: z.string().email('Enter a valid email address'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  zone: z.string().min(2, 'Delivery zone is required'),
  paymentTerms: z.enum(['COD', '7 Days', '14 Days', '30 Days', '45 Days']),
  creditLimit: z.number().nonnegative('Credit limit must be zero or positive'),
  kraPin: z.string().regex(/^[A-Z]\d{9}[A-Z]$/, 'Enter a valid KRA PIN (e.g. P051234567Z)').optional().or(z.literal('')),
  notes: z.string().optional()
});

export type CustomerFormData = z.infer<typeof CustomerSchema>;

// Product Validation Schema
export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.enum(['Leafy Greens', 'Root Vegetables', 'Fruits', 'Tubers & Onions', 'Culinary Herbs', 'Dairy & Eggs', 'Pantry & Dry Goods']),
  unit: z.enum(['KG', 'Crate (25kg)', 'Crate (50kg)', 'Bunch', 'Net (10kg)', 'Tray (30 eggs)', 'Litre']),
  unitPrice: z.number().positive('Unit selling price must be greater than 0'),
  costPrice: z.number().positive('Cost price must be greater than 0'),
  minStockLevel: z.number().nonnegative('Minimum stock level must be positive or zero'),
  shelfLifeDays: z.number().int().positive('Shelf life must be at least 1 day'),
  storageTemperature: z.string().min(1, 'Storage temperature recommendation is required'),
  description: z.string().optional()
});

export type ProductFormData = z.infer<typeof ProductSchema>;

// Supplier Validation Schema
export const SupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  category: z.enum(['Direct Grower', 'Farming Co-operative', 'Wholesale Market Vendor', 'Import Distributor']),
  location: z.string().min(2, 'Farming region/location is required'),
  contactPerson: z.string().min(2, 'Contact person is required'),
  phone: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, 'Valid Kenyan phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  leadTimeDays: z.number().int().positive('Lead time must be at least 1 day'),
  kraPin: z.string().regex(/^[A-Z]\d{9}[A-Z]$/, 'Valid KRA PIN is required').optional().or(z.literal('')),
  paymentTerms: z.enum(['Cash on Delivery', '7 Days', '14 Days', '30 Days'])
});

export type SupplierFormData = z.infer<typeof SupplierSchema>;

// Order Item Validation Schema
export const OrderItemSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  productName: z.string().min(1),
  sku: z.string().min(1),
  unit: z.string().min(1),
  quantityOrdered: z.number().positive('Quantity must be greater than 0'),
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().nonnegative()
});

// Order Validation Schema
export const OrderSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  deliveryWindow: z.enum(['Dawn (05:00 - 07:00)', 'Morning (07:00 - 10:00)', 'Mid-Day (11:00 - 14:00)', 'Urgent Same-Day']),
  deliveryAddress: z.string().min(3, 'Delivery address is required'),
  zone: z.string().min(1, 'Zone is required'),
  items: z.array(OrderItemSchema).min(1, 'Order must contain at least one line item'),
  specialInstructions: z.string().optional(),
  paymentTerms: z.string().min(1)
});

export type OrderFormData = z.infer<typeof OrderSchema>;

// Purchase Order Validation Schema
export const PurchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  supplierName: z.string().min(1),
  expectedDelivery: z.string().min(1, 'Expected delivery date is required'),
  warehouseDestination: z.string().min(1, 'Receiving hub is required'),
  paymentTerms: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    productName: z.string().min(1),
    unit: z.string().min(1),
    quantityOrdered: z.number().positive('Quantity must be positive'),
    unitCost: z.number().positive('Unit cost must be positive'),
    totalCost: z.number().positive()
  })).min(1, 'PO must contain at least one line item')
});

export type PurchaseOrderFormData = z.infer<typeof PurchaseOrderSchema>;

// Stock Adjustment Validation Schema
export const StockAdjustmentSchema = z.object({
  productId: z.string().min(1, 'Product selection is required'),
  type: z.enum(['Physical Count Variance', 'Spoilage / Sorting Loss', 'Cold-chain Failure', 'Returned Produce Intake', 'Inter-hub Transfer']),
  quantityDelta: z.number().refine(val => val !== 0, 'Quantity delta cannot be zero'),
  reason: z.string().min(5, 'Please provide an explanatory reason for audit verification'),
  warehouseBin: z.string().min(1, 'Storage bin or room is required')
});

export type StockAdjustmentFormData = z.infer<typeof StockAdjustmentSchema>;

// Delivery Run Validation Schema
export const DeliveryRunSchema = z.object({
  routeName: z.string().min(3, 'Route name is required'),
  driverName: z.string().min(2, 'Driver name is required'),
  driverPhone: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, 'Valid driver phone number is required'),
  vehicleRegistration: z.string().min(5, 'Vehicle registration is required (e.g. KDA 241X)'),
  departureTime: z.string().min(1, 'Departure time is required'),
  estimatedReturn: z.string().optional(),
  orderIds: z.array(z.string()).min(1, 'Select at least one order for the delivery run')
});

export type DeliveryRunFormData = z.infer<typeof DeliveryRunSchema>;

// Payment Record Validation Schema
export const PaymentTransactionSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  invoiceNumber: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  amount: z.number().positive('Payment amount must be greater than 0'),
  method: z.enum(['M-Pesa B2B / Paybill', 'Bank EFT / RTGS', 'Cheque', 'Corporate Credit']),
  reference: z.string().min(3, 'Bank / M-Pesa transaction reference is required'),
  notes: z.string().optional()
});

export type PaymentTransactionFormData = z.infer<typeof PaymentTransactionSchema>;

// User Management Validation Schema
export const UserSchema = z.object({
  name: z.string().min(2, 'Staff member name is required'),
  email: z.string().email('Valid institutional email is required'),
  phone: z.string().regex(/^(?:\+254|0)[17]\d{8}$/, 'Valid Kenyan phone number is required'),
  role: z.enum([
    'executive',
    'operations_manager',
    'sales_representative',
    'procurement_officer',
    'storekeeper',
    'finance_controller',
    'administrator'
  ]),
  branch: z.string().min(2, 'Assigned operational depot is required')
});

export type UserFormData = z.infer<typeof UserSchema>;
