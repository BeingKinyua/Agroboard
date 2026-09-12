import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, AlertCircle, 
  Truck, PackageCheck, Ban, Sparkles, XCircle, ArrowRight 
} from 'lucide-react';
import { STATUS_CONFIG_MAP, StatusConfig } from '../../lib/designTokens';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  customLabel,
}) => {
  const config: StatusConfig = STATUS_CONFIG_MAP[status] || {
    label: status,
    variant: 'neutral',
  };

  const label = customLabel || config.label;

  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[config.variant];

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
  }[config.variant];

  const renderIcon = () => {
    if (!showIcon) return null;

    const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

    switch (status) {
      case 'Approved':
      case 'Delivered':
      case 'Paid':
      case 'Confirmed':
      case 'Resolved':
        return <CheckCircle2 className={`${iconClass} shrink-0`} />;
      case 'Pending':
        return <Clock className={`${iconClass} shrink-0`} />;
      case 'Picking':
      case 'Packed':
        return <PackageCheck className={`${iconClass} shrink-0`} />;
      case 'In Transit':
      case 'Dispatched':
        return <Truck className={`${iconClass} shrink-0`} />;
      case 'Near Expiry':
      case 'Low Stock':
      case 'Partially Paid':
        return <AlertTriangle className={`${iconClass} shrink-0`} />;
      case 'Overdue':
      case 'Expired':
      case 'Cancelled':
      case 'Rejected':
      case 'Failed':
      case 'Damaged':
        return <XCircle className={`${iconClass} shrink-0`} />;
      default:
        return <span className={`w-1.5 h-1.5 rounded-full ${dotColors} shrink-0`} />;
    }
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs font-semibold px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border whitespace-nowrap select-none transition-colors ${variantStyles} ${sizeStyles} ${className}`}
      role="status"
    >
      {renderIcon()}
      <span>{label}</span>
    </span>
  );
};
