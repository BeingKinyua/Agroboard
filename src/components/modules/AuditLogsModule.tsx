import React, { useState } from 'react';
import { 
  History, Search, Filter, ShieldCheck, 
  Calendar, User, ArrowRight, Download 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { EmptyState } from '../common/EmptyState';

export const AuditLogsModule: React.FC = () => {
  const { auditLogs } = useApp();

  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredLogs = auditLogs.filter(l => {
    const matchesSearch = 
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.ipAddress.toLowerCase().includes(search.toLowerCase());
    const matchesModule = selectedModule === 'all' || l.module === selectedModule;
    return matchesSearch && matchesModule;
  });

  const modules = ['all', 'Orders', 'Inventory', 'Finance', 'Procurement', 'Deliveries', 'System'];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Enterprise Audit & Security"
        title="System Activity & Audit Trail"
        description="Immutable enterprise ledger tracking operational mutations, state transitions, approvals, and user authentication events."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {auditLogs.length} Security Events Recorded
          </span>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by operator, action, or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                selectedModule === mod
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {mod === 'all' ? 'All Modules' : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries */}
      {filteredLogs.length === 0 ? (
        <EmptyState
          icon={History}
          title="No audit events found"
          description="No security or operational log events match your current filter parameters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedModule('all');
          }}
        />
      ) : (
        <>
          {/* Mobile Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filteredLogs.map(log => (
              <div key={log.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{log.user}</span>
                    <span className="text-[10px] text-slate-400 capitalize block">{log.userRole.replace('_', ' ')}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {log.module}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-100">
                  {log.details}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 font-mono">
                  <span>{log.timestamp}</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Operator & Role</th>
                    <th className="p-3.5">Module & Action</th>
                    <th className="p-3.5">Operational Details</th>
                    <th className="p-3.5 font-mono">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{log.user}</div>
                        <div className="text-[10px] text-slate-400 capitalize">{log.userRole.replace('_', ' ')}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{log.module}</span>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700 leading-relaxed max-w-md">
                        {log.details}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
