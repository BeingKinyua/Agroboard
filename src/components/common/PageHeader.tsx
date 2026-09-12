import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, ChevronRight, Home, Sparkles } from 'lucide-react';

export interface ActionItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  tooltip?: string;
  hiddenOnMobile?: boolean;
}

interface PageHeaderProps {
  category?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  primaryAction?: ActionItem;
  secondaryActions?: ActionItem[];
  className?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  category,
  title,
  description,
  badge,
  primaryAction,
  secondaryActions = [],
  className = '',
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const renderActionButton = (action: ActionItem, isMobileDropdown = false) => {
    const variantStyles = {
      primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-600 font-semibold focus-visible:ring-emerald-500',
      secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-medium shadow-2xs hover:border-slate-300 focus-visible:ring-slate-400',
      danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium focus-visible:ring-rose-400',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 font-medium focus-visible:ring-slate-400',
    }[action.variant || 'secondary'];

    if (isMobileDropdown) {
      return (
        <button
          key={action.label}
          onClick={() => {
            setIsMenuOpen(false);
            action.onClick();
          }}
          disabled={action.disabled}
          className="w-full text-left px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {action.icon && <span className="text-slate-400 shrink-0">{action.icon}</span>}
          <span className="truncate">{action.label}</span>
        </button>
      );
    }

    return (
      <button
        key={action.label}
        onClick={action.onClick}
        disabled={action.disabled}
        title={action.tooltip}
        className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${
          action.hiddenOnMobile ? 'hidden sm:inline-flex' : ''
        }`}
      >
        {action.icon && <span className="shrink-0">{action.icon}</span>}
        <span className="truncate">{action.label}</span>
      </button>
    );
  };

  return (
    <div className={`space-y-3 sm:space-y-4 pb-4 sm:pb-5 border-b border-slate-200/80 mb-6 ${className}`}>
      {/* Category Tag / Micro-breadcrumb */}
      {category && (
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          <span>{category}</span>
        </div>
      )}

      {/* Main Row: Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
          {/* Desktop Secondary Actions */}
          <div className="hidden md:flex items-center gap-2">
            {secondaryActions.map(action => renderActionButton(action))}
          </div>

          {/* Primary Action (Always visible & prominent) */}
          {primaryAction && renderActionButton(primaryAction)}

          {/* Mobile/Tablet Overflow Menu */}
          {secondaryActions.length > 0 && (
            <div className="relative md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="More actions"
                aria-expanded={isMenuOpen}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Additional Actions
                  </div>
                  {secondaryActions.map(action => renderActionButton(action, true))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optional Extra Elements (Filter bars, tabs, or metrics summary) */}
      {children && <div className="pt-1">{children}</div>}
    </div>
  );
};
