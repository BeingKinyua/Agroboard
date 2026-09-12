import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded ${className}`} />
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 6 
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="divide-y divide-slate-100">
        <div className="p-3.5 bg-slate-50 flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-32" />
      </div>
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
    <Skeleton className="h-3 w-full" />
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-32 w-full rounded-2xl" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
    <TableSkeleton rows={4} cols={5} />
  </div>
);
