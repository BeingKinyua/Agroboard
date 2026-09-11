import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, 
  AlertTriangle, DollarSign, FileText, UserCheck 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApprovalRequest } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const ApprovalsModule: React.FC = () => {
  const { approvals, processApproval, hasPermission } = useApp();

  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [auditComment, setAuditComment] = useState('');

  const filteredApprovals = approvals.filter(a => filter === 'all' || a.status === filter);

  const handleDecision = (appId: string, decision: 'Approved' | 'Rejected') => {
    processApproval(appId, decision, auditComment || undefined);
    setSelectedApproval(null);
    setAuditComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Centralized Authorization & Governance Inbox</h2>
          <p className="text-xs text-slate-500">Multi-stage approvals for high-value farmer POs, stock write-offs, and credit limit overrides</p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['Pending', 'Approved', 'Rejected', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Requests' : status} ({approvals.filter(a => status === 'all' || a.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Approvals Cards / Table */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
            No approval requests found in this view.
          </div>
        ) : (
          filteredApprovals.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">{item.code}</span>
                  <Badge variant="neutral" size="sm">{item.type}</Badge>
                  <Badge
                    variant={item.priority === 'Urgent' ? 'danger' : 'amber'}
                    size="sm"
                  >
                    {item.priority} Priority
                  </Badge>
                  <span className="text-slate-400 text-xs">· Requested by {item.requestedBy} ({item.timestamp})</span>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">{item.details}</p>

                {item.amount && (
                  <p className="text-xs font-bold text-emerald-800">
                    Financial Impact: KES {item.amount.toLocaleString()}
                  </p>
                )}

                {item.approverNotes && (
                  <div className="p-2 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-100">
                    <strong>Reviewer Note:</strong> {item.approverNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                {item.status === 'Pending' ? (
                  hasPermission('approvals', 'approve') ? (
                    <>
                      <button
                        onClick={() => handleDecision(item.id, 'Approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Authorize</span>
                      </button>
                      <button
                        onClick={() => handleDecision(item.id, 'Rejected')}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Requires Executive Role</span>
                  )
                ) : (
                  <Badge
                    variant={item.status === 'Approved' ? 'success' : 'danger'}
                    size="md"
                  >
                    {item.status}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
