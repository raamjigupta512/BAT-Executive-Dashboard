import React, { useState } from 'react';
import { RiskAlert } from '../../types/dashboard';
import { AlertTriangle, Filter, ArrowRight, Shield, ExternalLink } from 'lucide-react';

interface RiskIntelligenceViewProps {
  risks: RiskAlert[];
  onSelectRisk: (risk: RiskAlert) => void;
}

export const RiskIntelligenceView: React.FC<RiskIntelligenceViewProps> = ({
  risks,
  onSelectRisk
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  const filtered = filterSeverity === 'All'
    ? risks
    : risks.filter(r => r.severity === filterSeverity);

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#071B3A]">Enterprise Risk Intelligence</h1>
          <p className="text-xs text-[#536B8B]">
            Comprehensive risk matrix, estimated financial exposures, ownership, and mitigation roadmaps
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#536B8B]" />
          <div className="flex bg-white rounded-lg border border-[#DCE8F0] p-1 text-xs">
            {['All', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  filterSeverity === sev
                    ? 'bg-[#008FCB] text-white'
                    : 'text-[#536B8B] hover:text-[#071B3A]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Table */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Risk Item</th>
                <th className="py-2.5 px-4">Severity</th>
                <th className="py-2.5 px-4">Exposure Range</th>
                <th className="py-2.5 px-4">Geography</th>
                <th className="py-2.5 px-4">Risk Owner</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F6]">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => onSelectRisk(r)}
                  className="hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#071B3A] group-hover:text-[#008FCB] transition-colors block">
                      {r.title}
                    </span>
                    <span className="text-[11px] text-[#536B8B] line-clamp-1">{r.subtitle}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      r.severity === 'High' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                      r.severity === 'Medium' ? 'bg-[#FEF3C7] text-[#D97706]' :
                      'bg-[#D1FAE5] text-[#059669]'
                    }`}>
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#071B3A]">{r.exposureEstimate}</td>
                  <td className="py-3 px-4 text-[#536B8B]">{r.geography}</td>
                  <td className="py-3 px-4 font-medium text-[#2C425E]">{r.owner}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-medium text-[#008FCB] bg-[#EBF6FC] px-2 py-0.5 rounded">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-xs font-semibold text-[#008FCB] group-hover:underline flex items-center justify-end gap-1 ml-auto">
                      <span>Examine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
