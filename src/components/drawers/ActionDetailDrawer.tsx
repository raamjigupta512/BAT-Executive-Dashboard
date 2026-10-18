import React, { useState } from 'react';
import { X, CheckCircle2, Clock, User, DollarSign, Layers, ArrowRight, ShieldCheck } from 'lucide-react';
import { ManagementAction, ActionStatus } from '../../types/dashboard';

interface ActionDetailDrawerProps {
  action: ManagementAction | null;
  onClose: () => void;
  onUpdateAction?: (updated: ManagementAction) => void;
}

export const ActionDetailDrawer: React.FC<ActionDetailDrawerProps> = ({
  action,
  onClose,
  onUpdateAction
}) => {
  if (!action) return null;

  const [status, setStatus] = useState<ActionStatus>(action.status);
  const [owner, setOwner] = useState(action.owner);
  const [commentText, setCommentText] = useState('');
  const [auditLog, setAuditLog] = useState(action.auditHistory || []);

  const handleStatusChange = (newStatus: ActionStatus) => {
    setStatus(newStatus);
    const newEntry = {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      user: 'Executive Committee (Demo)',
      action: `Status updated to ${newStatus}`
    };
    const updatedHistory = [newEntry, ...auditLog];
    setAuditLog(updatedHistory);

    if (onUpdateAction) {
      onUpdateAction({
        ...action,
        status: newStatus,
        auditHistory: updatedHistory
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newEntry = {
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      user: 'Executive User',
      action: `Note added: "${commentText.trim()}"`
    };
    const updatedHistory = [newEntry, ...auditLog];
    setAuditLog(updatedHistory);
    setCommentText('');

    if (onUpdateAction) {
      onUpdateAction({
        ...action,
        auditHistory: updatedHistory
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DCE8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#008FCB] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {action.priority}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#536B8B] uppercase tracking-wider">
                Action Recommendation #{action.id}
              </span>
              <h2 className="text-base font-bold text-[#071B3A] leading-tight">
                {action.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#536B8B] hover:bg-[#F0F5F9] hover:text-[#071B3A] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 space-y-6 flex-1 text-sm text-[#071B3A]">
          {/* Status and Expected Financial Impact Banner */}
          <div className="p-4 bg-[#EBF6FC] rounded-xl border border-[#D0E7F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#536B8B] block">Expected Financial Impact</span>
              <span className="text-base font-bold text-[#071B3A]">
                {action.expectedFinancialImpact}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#536B8B]">Status:</span>
              <span className="px-3 py-1 text-xs font-bold bg-white text-[#008FCB] border border-[#BCE1F5] rounded-full shadow-2xs">
                {status}
              </span>
            </div>
          </div>

          {/* Rationale */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Strategic Rationale &amp; Objectives
            </h4>
            <p className="text-xs leading-relaxed text-[#2C425E] bg-[#F8FAFC] p-3.5 rounded-lg border border-[#EEF2F6]">
              {action.rationale}
            </p>
          </div>

          {/* Alternative Strategic Options */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Evaluated Strategic Options
            </h4>
            <div className="space-y-2">
              {action.alternativeOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border border-[#DCE8F0] text-xs text-[#071B3A] flex items-start gap-2.5"
                >
                  <Layers className="w-4 h-4 text-[#008FCB] shrink-0 mt-0.5" />
                  <span>{opt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Assumptions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Underlying Financial Assumptions
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#536B8B] bg-[#F8FAFC] p-3.5 rounded-lg border border-[#EEF2F6]">
              {action.financialAssumptions.map((asm, i) => (
                <li key={i}>{asm}</li>
              ))}
            </ul>
          </div>

          {/* Owner & Due Date */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAFCFE] rounded-lg border border-[#EEF2F6]">
            <div>
              <span className="text-[11px] font-medium text-[#7A92A9] block">Assigned Owner</span>
              <span className="text-xs font-bold text-[#071B3A]">{action.owner}</span>
              <span className="text-[10.5px] text-[#536B8B] block">{action.ownerRole}</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-[#7A92A9] block">Execution Deadline</span>
              <span className="text-xs font-bold text-[#071B3A]">{action.dueDate}</span>
              <span className="text-[10.5px] text-[#12A66A] block">On schedule</span>
            </div>
          </div>

          {/* Decision & Audit History */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Decision &amp; Audit Log
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {auditLog.map((log, idx) => (
                <div key={idx} className="text-xs p-2.5 bg-[#F8FAFC] rounded border border-[#EEF2F6] flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-[#071B3A]">{log.user}: </span>
                    <span className="text-[#536B8B]">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-[#8C9EB5] shrink-0 ml-2">{log.date}</span>
                </div>
              ))}
            </div>

            {/* Add note input */}
            <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Record an executive note or decision..."
                className="flex-1 bg-white border border-[#DCE8F0] rounded-lg px-3 py-1.5 text-xs text-[#071B3A] focus:outline-hidden focus:border-[#008FCB]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold bg-[#008FCB] text-white rounded-lg hover:bg-[#007AB8] cursor-pointer"
              >
                Log
              </button>
            </form>
          </div>
        </div>

        {/* Drawer Footer Status Controls */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE8F0] flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-[#536B8B]">
            Update Approval State:
          </div>
          <div className="flex items-center gap-1.5">
            {(['Proposed', 'Under Review', 'Approved', 'In Progress', 'Completed'] as ActionStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                  status === st
                    ? 'bg-[#008FCB] text-white shadow-2xs'
                    : 'bg-white hover:bg-[#EAF2F7] text-[#536B8B] border border-[#DCE8F0]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
