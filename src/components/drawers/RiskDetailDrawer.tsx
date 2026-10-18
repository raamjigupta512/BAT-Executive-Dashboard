import React from 'react';
import { X, AlertTriangle, ShieldCheck, UserCheck, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { RiskAlert } from '../../types/dashboard';

interface RiskDetailDrawerProps {
  risk: RiskAlert | null;
  onClose: () => void;
  onUpdateStatus?: (riskId: string, newStatus: RiskAlert['status']) => void;
}

export const RiskDetailDrawer: React.FC<RiskDetailDrawerProps> = ({
  risk,
  onClose,
  onUpdateStatus
}) => {
  if (!risk) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#DCE8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              risk.severity === 'High' ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#FEF3C7] text-[#D97706]'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#536B8B] uppercase tracking-wider">
                Risk Register Entry #{risk.id}
              </span>
              <h2 className="text-lg font-bold text-[#071B3A] leading-tight">
                {risk.title}
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
          {/* Key Meta Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[11px] font-medium text-[#7A92A9] block">Severity</span>
              <span className={`text-xs font-bold ${
                risk.severity === 'High' ? 'text-[#EF4444]' : 'text-[#D97706]'
              }`}>
                {risk.severity} Risk
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[11px] font-medium text-[#7A92A9] block">Est. Financial Exposure</span>
              <span className="text-xs font-bold text-[#071B3A]">
                {risk.exposureEstimate}
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[11px] font-medium text-[#7A92A9] block">Governance Status</span>
              <span className="text-xs font-bold text-[#008FCB]">
                {risk.status}
              </span>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[11px] font-medium text-[#7A92A9] block">Target Mitigation</span>
              <span className="text-xs font-bold text-[#071B3A]">
                {risk.dueDate}
              </span>
            </div>
          </div>

          {/* Affected Geographies */}
          <div className="p-3.5 bg-[#EBF6FC] rounded-xl border border-[#D0E7F5]">
            <span className="text-xs font-bold text-[#008FCB] uppercase tracking-wide block mb-1">
              Affected Geographies &amp; Corridors
            </span>
            <p className="text-xs font-medium text-[#071F3D]">
              {risk.geography}
            </p>
          </div>

          {/* Risk Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Detailed Assessment &amp; Context
            </h4>
            <p className="text-xs leading-relaxed text-[#2C425E] bg-[#FAFCFE] p-3.5 rounded-lg border border-[#EEF2F6]">
              {risk.description}
            </p>
          </div>

          {/* Evidence and Data Provenance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Evidence &amp; Provenance
            </h4>
            <div className="flex items-start gap-2.5 p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6] text-xs text-[#536B8B]">
              <ExternalLink className="w-4 h-4 text-[#008FCB] shrink-0 mt-0.5" />
              <span>{risk.evidence}</span>
            </div>
          </div>

          {/* Existing Controls */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2">
              Current Executive Controls
            </h4>
            <div className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6] text-xs text-[#2C425E]">
              {risk.existingControls}
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#008FCB] mb-2">
              Recommended Mitigation Roadmap
            </h4>
            <div className="p-3.5 bg-[#F0FDF4] rounded-lg border border-[#DCFCE7] text-xs text-[#166534]">
              {risk.mitigationPlan}
            </div>
          </div>

          {/* Ownership & Audit */}
          <div className="pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-xs text-[#7A92A9]">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#536B8B]" />
              <span>Owner: <strong className="text-[#071B3A]">{risk.owner}</strong></span>
            </div>
            <div>Updated: {risk.lastUpdated}</div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE8F0] flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-[#536B8B]">
            Change risk status:
          </div>
          <div className="flex items-center gap-2">
            {(['Active', 'Mitigating', 'Monitored'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  if (onUpdateStatus) onUpdateStatus(risk.id, st);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  risk.status === st
                    ? 'bg-[#008FCB] text-white'
                    : 'bg-white hover:bg-[#EAF2F7] text-[#071B3A] border border-[#DCE8F0]'
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
