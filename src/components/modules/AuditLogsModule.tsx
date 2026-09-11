import React, { useState } from 'react';
import { 
  History, Search, Filter, ShieldCheck, 
  Calendar, User, ArrowRight, Download 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">System Activity & Audit Trail</h2>
          <p className="text-xs text-slate-500">Immutable ledger of operational mutations, approvals, and authorization events</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="md">
            {auditLogs.length} Total Events Logged
          </Badge>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by operator, action, or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {modules.map(mod => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedModule === mod
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {mod === 'all' ? 'All Modules' : mod}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Operator & Role</th>
              <th className="p-3.5">Module & Action</th>
              <th className="p-3.5">Operational Details</th>
              <th className="p-3.5 font-mono">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-900">{log.user}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{log.userRole.replace('_', ' ')}</div>
                </td>
                <td className="p-3.5">
                  <span className="font-semibold text-slate-800 block">{log.module}</span>
                  <Badge variant="neutral" size="sm" className="mt-0.5">{log.action}</Badge>
                </td>
                <td className="p-3.5 text-slate-700 leading-relaxed max-w-md">
                  {log.details}
                </td>
                <td className="p-3.5 font-mono text-[11px] text-slate-400">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
