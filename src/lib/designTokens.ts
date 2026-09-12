/**
 * Agro-Deliveries Ke. Enterprise Design System Tokens
 * Standardized typography, spacing, surface hierarchy, status indicators, and breakpoints.
 */

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      primary: 'emerald-600',
      primaryHover: 'emerald-700',
      primaryActive: 'emerald-800',
      primarySurface: 'emerald-50',
      primaryBorder: 'emerald-200',
      primaryText: 'emerald-700',
      dark: 'emerald-950',
    },
    neutral: {
      canvas: 'slate-50',
      surface: 'white',
      surfaceMuted: 'slate-50/80',
      surfaceElevated: 'white',
      borderSubtle: 'slate-200/70',
      borderStrong: 'slate-300',
      textPrimary: 'slate-900',
      textSecondary: 'slate-600',
      textMuted: 'slate-400',
      textDisabled: 'slate-300',
    },
    status: {
      success: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      },
      warning: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      },
      danger: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      },
      info: {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
      },
      neutral: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      },
    },
  },
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },
  shadow: {
    card: 'shadow-2xs border border-slate-200/80',
    hover: 'hover:shadow-sm hover:border-slate-300 transition-all',
    dropdown: 'shadow-lg border border-slate-200/90',
    modal: 'shadow-2xl border border-slate-200',
  },
  touch: {
    minTarget: 'min-h-[44px] min-w-[44px]',
  },
} as const;

export type OperationalStatus = 
  | 'Draft'
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Confirmed'
  | 'In Progress'
  | 'Picking'
  | 'Packed'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Invoiced'
  | 'Paid'
  | 'Partially Paid'
  | 'Overdue'
  | 'Cancelled'
  | 'Failed'
  | 'Active'
  | 'Near Expiry'
  | 'Expired'
  | 'Optimal'
  | 'Low Stock'
  | 'Good'
  | 'Damaged'
  | 'Open'
  | 'Resolved'
  | 'Closed';

export interface StatusConfig {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  iconName?: string;
}

export const STATUS_CONFIG_MAP: Record<string, StatusConfig> = {
  // Positive / Finished
  Approved: { label: 'Approved', variant: 'success' },
  Delivered: { label: 'Delivered', variant: 'success' },
  Paid: { label: 'Paid', variant: 'success' },
  Active: { label: 'Active', variant: 'success' },
  Optimal: { label: 'Optimal', variant: 'success' },
  Good: { label: 'Good', variant: 'success' },
  Resolved: { label: 'Resolved', variant: 'success' },
  Confirmed: { label: 'Confirmed', variant: 'success' },

  // Operational In-Progress
  'In Progress': { label: 'In Progress', variant: 'info' },
  Picking: { label: 'Picking', variant: 'warning' },
  Packed: { label: 'Packed', variant: 'info' },
  Dispatched: { label: 'Dispatched', variant: 'info' },
  'In Transit': { label: 'In Transit', variant: 'info' },
  Invoiced: { label: 'Invoiced', variant: 'info' },
  'Partially Paid': { label: 'Partially Paid', variant: 'warning' },

  // Pending / Warning
  Pending: { label: 'Pending Review', variant: 'warning' },
  Draft: { label: 'Draft', variant: 'neutral' },
  'Near Expiry': { label: 'Near Expiry', variant: 'warning' },
  'Low Stock': { label: 'Low Stock', variant: 'warning' },
  Open: { label: 'Open', variant: 'info' },

  // Critical / Danger
  Overdue: { label: 'Overdue', variant: 'danger' },
  Expired: { label: 'Expired', variant: 'danger' },
  Cancelled: { label: 'Cancelled', variant: 'danger' },
  Failed: { label: 'Failed', variant: 'danger' },
  Rejected: { label: 'Rejected', variant: 'danger' },
  Damaged: { label: 'Damaged', variant: 'danger' },
  Closed: { label: 'Closed', variant: 'neutral' },
};
