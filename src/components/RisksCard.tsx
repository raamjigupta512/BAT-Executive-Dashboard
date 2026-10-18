import React from 'react';
import { ArrowRight, AlertTriangle, Leaf } from 'lucide-react';
import { RiskAlert } from '../types/dashboard';

interface RisksCardProps {
  risks: RiskAlert[];
  onSelectRisk: (risk: RiskAlert) => void;
  onViewAll: () => void;
}

export const RisksCard: React.FC<RisksCardProps> = ({ risks, onSelectRisk, onViewAll }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#071B3A]">
          Key Risks &amp; Alerts
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#008FCB] hover:text-[#0070A0] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Risk Items List */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {risks.slice(0, 5).map((risk) => {
          return (
            <div
              key={risk.id}
              onClick={() => onSelectRisk(risk)}
              className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            >
              {/* Severity Icon */}
              <div className="mt-0.5 shrink-0">
                {risk.iconType === 'alert-red' ? (
                  <div className="w-6 h-6 rounded-md bg-[#FEE2E2] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  </div>
                ) : risk.iconType === 'alert-amber' ? (
                  <div className="w-6 h-6 rounded-md bg-[#FEF3C7] flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md bg-[#D1FAE5] flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-[#10B981]" />
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-[13px] font-semibold text-[#071B3A] group-hover:text-[#008FCB] transition-colors truncate">
                  {risk.title}
                </div>
                <div className="text-[11.5px] text-[#536B8B] line-clamp-1 leading-snug">
                  {risk.subtitle}
                </div>
              </div>

              {/* Severity Badge */}
              <div className="shrink-0">
                {risk.severity === 'High' ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#FEE2E2] text-[#EF4444] rounded-md">
                    High
                  </span>
                ) : risk.severity === 'Medium' ? (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706] rounded-md">
                    Medium
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-[#D1FAE5] text-[#059669] rounded-md">
                    Low
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
