import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ArrowUpDown, Search, Filter, Layers, Inbox 
} from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  /** Hide column on smaller screens */
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  renderMobileCard?: (item: T) => React.ReactNode;
  className?: string;
  id?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no records matching your current filter criteria.',
  emptyActionLabel,
  onEmptyAction,
  renderMobileCard,
  className = '',
  id,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Sorted data
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const compare = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? compare : -compare;
    });
  }, [data, sortKey, sortDirection]);

  // Paginated data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  if (data.length === 0 && !isLoading) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div id={id} className={`bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden ${className}`}>
      {/* Mobile Card View (shown when mobile card renderer is provided) */}
      {renderMobileCard && (
        <div className="md:hidden divide-y divide-slate-100">
          {paginatedData.map(item => (
            <div 
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer active:bg-slate-50' : ''}
            >
              {renderMobileCard(item)}
            </div>
          ))}
        </div>
      )}

      {/* Responsive Horizontal Scroll Table Container */}
      <div className={`overflow-x-auto w-full touch-pan-x ${renderMobileCard ? 'hidden md:block' : 'block'}`}>
        <table className="w-full text-xs text-left border-collapse min-w-full">
          <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              {columns.map(col => {
                const alignClass = {
                  left: 'text-left',
                  center: 'text-center',
                  right: 'text-right',
                }[col.align || 'left'];

                const visibilityClass = `${col.hideOnMobile ? 'hidden sm:table-cell' : ''} ${
                  col.hideOnTablet ? 'hidden lg:table-cell' : ''
                }`;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`p-3.5 whitespace-nowrap ${alignClass} ${visibilityClass} ${col.className || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-slate-900 focus-visible:outline-none transition-colors"
                      >
                        <span>{col.header}</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-400" />
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                }`}
              >
                {columns.map(col => {
                  const alignClass = {
                    left: 'text-left',
                    center: 'text-center',
                    right: 'text-right',
                  }[col.align || 'left'];

                  const visibilityClass = `${col.hideOnMobile ? 'hidden sm:table-cell' : ''} ${
                    col.hideOnTablet ? 'hidden lg:table-cell' : ''
                  }`;

                  return (
                    <td
                      key={col.key}
                      className={`p-3.5 ${alignClass} ${visibilityClass} ${col.className || ''}`}
                    >
                      {col.render ? col.render(item, idx) : (item as any)[col.key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {data.length > pageSize && (
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="text-center sm:text-left">
            Showing <span className="font-semibold text-slate-800">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{sortedData.length}</span> records
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-slate-800 bg-white rounded border border-slate-200/80 shadow-2xs">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-slate-200/70 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
