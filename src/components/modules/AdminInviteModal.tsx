import React, { useState } from 'react';
import { Mail, User, Shield, Building2, CheckCircle2, AlertCircle, Loader2, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { SYSTEM_ROLES, BosRoleKey } from '../../lib/rbac/permissions';

interface AdminInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: {
    fullName: string;
    workEmail: string;
    roleId: BosRoleKey;
    branch: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const AdminInviteModal: React.FC<AdminInviteModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<BosRoleKey>('procurement_officer');
  const [branch, setBranch] = useState('Nairobi Central Hub');

  // Step 1: form, Step 2: confirmation, Step 3: success
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const roleObj = SYSTEM_ROLES[selectedRole];

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanEmail = workEmail.trim().toLowerCase();

    if (!cleanName) {
      setErrorMessage('Please enter the employee full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid corporate work email address.');
      return;
    }

    setStep('confirm');
  };

  const handleSendInvitation = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await onInvite({
        fullName: fullName.trim(),
        workEmail: workEmail.trim().toLowerCase(),
        roleId: selectedRole,
        branch,
      });

      if (res.success) {
        setStep('success');
      } else {
        setErrorMessage(res.error || 'Failed to dispatch enterprise invitation. Please verify permissions.');
        setStep('form');
      }
    } catch (err: any) {
      setErrorMessage('Unexpected server error while processing invitation.');
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAndReset = () => {
    setFullName('');
    setWorkEmail('');
    setSelectedRole('procurement_officer');
    setBranch('Nairobi Central Hub');
    setStep('form');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-6">
        <button
          type="button"
          onClick={handleCloseAndReset}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Invite Internal Member</h3>
            <p className="text-xs text-slate-500">
              Provision an authoritative business identity with verified RBAC role assignment.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: Details Form */}
        {step === 'form' && (
          <form onSubmit={handleProceedToConfirm} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@agrodeliveries.co.ke"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <p className="text-[11px] text-slate-400">Only verified corporate or institutional domains are permitted.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Authoritative Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as BosRoleKey)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  {Object.values(SYSTEM_ROLES).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Facility / Hub Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Nairobi Central Hub">Nairobi Central Hub</option>
                  <option value="Mombasa Coastal Depot">Mombasa Coastal Depot</option>
                  <option value="Eldoret Highland Depot">Eldoret Highland Depot</option>
                  <option value="Headquarters / All Branches">Headquarters / All Branches</option>
                </select>
              </div>
            </div>

            {/* Role Summary Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Assigned Role Scope: {roleObj.name}
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed">{roleObj.description}</p>
              <p className="text-[10px] text-emerald-700 font-semibold pt-0.5">
                Grants {roleObj.permissions.length} granular standard permissions
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Confirmation Dialog (Section 13 requirement) */}
        {step === 'confirm' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 space-y-2 text-center">
              <h4 className="text-sm font-bold text-slate-900">
                Invite {fullName} as {roleObj.name}?
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                An invitation token will be generated on the server and sent to <strong className="text-slate-900">{workEmail}</strong> with assigned permissions for <strong className="text-slate-900">{branch}</strong>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500">Employee:</span>
                <span className="font-semibold text-slate-900">{fullName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500">Corporate Email:</span>
                <span className="font-semibold text-slate-900">{workEmail}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500">Authoritative Role:</span>
                <span className="font-semibold text-emerald-800">{roleObj.name}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Security Audit:</span>
                <span className="font-mono text-[10px] text-slate-600">ACTION: USER_INVITED</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep('form')}
                disabled={isSubmitting}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleSendInvitation}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching Invitation...</span>
                  </>
                ) : (
                  <span>Send Invitation</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Invitation Sent Successfully</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                <strong className="text-slate-700">{fullName}</strong> has been provisioned as <strong className="text-slate-700">{roleObj.name}</strong>. An email notification has been dispatched to <span className="font-mono text-slate-700">{workEmail}</span>.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
