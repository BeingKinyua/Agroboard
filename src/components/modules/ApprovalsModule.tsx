import React, { useState } from 'react';
import { 
  ShieldCheck, CheckCircle2, XCircle, Clock, 
  AlertTriangle, DollarSign, FileText, UserCheck, MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApprovalRequest } from '../../types';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

export const ApprovalsModule: React.FC = () => {
  const { approvals, processApproval, hasPermission } = useApp();

  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'Approved' | 'Rejected'>('Approved');
  const [auditComment, setAuditComment] = useState('');

  const filteredApprovals = approvals.filter(a => filter === 'all' || a.status === filter);
  const pendingCount = approvals.filter(a => a.status === 'Pending').length;

  const openDecisionModal = (approval: ApprovalRequest, type: 'Approved' | 'Rejected') => {
    setSelectedApproval(approval);
    setDecisionType(type);
    setAuditComment('');
  };

  const handleConfirmDecision = () => {
    if (!selectedApproval) return;
    processApproval(selectedApproval.id, decisionType, auditComment || undefined);
    setSelectedApproval(null);
    setAuditComment('');
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Enterprise Governance & Audit"
        title="Authorization & Approvals Inbox"
        description="Multi-tier executive governance for farm procurement POs, inventory batch write-offs, and client credit limit overrides."
        badge={
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            pendingCount > 0 
              ? 'bg-amber-50 text-amber-800 border-amber-200' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {pendingCount} Awaiting Review
          </span>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['Pending', 'Approved', 'Rejected', 'all'].map(status => {
          const count = approvals.filter(a => status === 'all' || a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[38px] ${
                filter === status
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status === 'all' ? 'All Requests' : status} ({count})
            </button>
          );
        })}
      </div>

      {/* Approvals Cards */}
      <div className="space-y-3">
        {filteredApprovals.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No approval requests found"
            description={
              filter === 'Pending'
                ? "You're completely caught up! No operational authorizations are currently pending."
                : `No approval requests found matching the "${filter}" filter.`
            }
            actionLabel={filter !== 'all' ? 'Show All Requests' : undefined}
            onAction={() => setFilter('all')}
          />
        ) : (
          filteredApprovals.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs text-slate-900">{item.code}</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {item.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    item.priority === 'Urgent' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.priority} Priority
                  </span>
                  <span className="text-slate-400 text-xs">
                    · Requested by {item.requestedBy} ({item.timestamp})
                  </span>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed">{item.details}</p>

                {item.amount && (
                  <p className="text-xs font-bold text-emerald-800">
                    Financial Impact: KES {item.amount.toLocaleString()}
                  </p>
                )}

                {item.approverNotes && (
                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200/70">
                    <span className="font-bold text-slate-800 block mb-0.5">Auditor / Authorizer Note:</span>
                    {item.approverNotes}
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full sm:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {item.status === 'Pending' ? (
                  hasPermission('approvals', 'approve') ? (
                    <>
                      <button
                        onClick={() => openDecisionModal(item, 'Approved')}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors min-h-[38px]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Authorize</span>
                      </button>
                      <button
                        onClick={() => openDecisionModal(item, 'Rejected')}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Requires Executive Authority</span>
                  )
                ) : (
                  <StatusBadge status={item.status} size="md" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Decision Authorization Modal */}
      {selectedApproval && (
        <Modal
          isOpen={!!selectedApproval}
          onClose={() => setSelectedApproval(null)}
          title={decisionType === 'Approved' ? 'Authorize Request' : 'Reject Request'}
          subtitle={`Governance review for ${selectedApproval.code} (${selectedApproval.type})`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">{selectedApproval.type}</span>
              <p className="text-slate-700">{selectedApproval.details}</p>
              {selectedApproval.amount && (
                <p className="font-bold text-emerald-800">
                  Value: KES {selectedApproval.amount.toLocaleString()}
                </p>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Audit Trail Note / Reason {decisionType === 'Rejected' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                rows={3}
                value={auditComment}
                onChange={e => setAuditComment(e.target.value)}
                placeholder={decisionType === 'Approved' ? 'e.g. Approved as per Q1 produce budget allocation' : 'e.g. Exceeds standard monthly allowance without board sign-off'}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium min-h-[40px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecision}
                disabled={decisionType === 'Rejected' && !auditComment.trim()}
                className={`px-4 py-2 text-white rounded-lg font-semibold shadow-xs min-h-[40px] transition-colors disabled:opacity-50 ${
                  decisionType === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {decisionType === 'Approved' ? 'Authorization' : 'Rejection'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
