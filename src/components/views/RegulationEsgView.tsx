import React from 'react';
import { ShieldCheck, Leaf, FileText, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export const RegulationEsgView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A]">Regulation, Compliance &amp; ESG</h1>
        <p className="text-xs text-[#536B8B]">
          Jurisdictional regulatory status, excise directives, and Scope 1-3 decarbonization transition metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">US FDA PMTA Approvals</span>
          <div className="text-2xl font-bold text-[#12A66A] mt-1">4 Authorizations</div>
          <span className="text-xs text-[#536B8B]">Vuse Solo &amp; e-liquid marketing grants</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Scope 1 &amp; 2 Emission Reduction</span>
          <div className="text-2xl font-bold text-[#008FCB] mt-1">-52.4%</div>
          <span className="text-xs text-[#12A66A] font-semibold">On track for 2030 net zero operations</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Recyclable Packaging Target</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">87.5%</div>
          <span className="text-xs text-[#008FCB] font-semibold">Target: 100% by 2027</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#071B3A] mb-3">Key Regulatory Watchlist &amp; Consultations</h3>
        <div className="divide-y divide-[#EEF2F6] text-xs">
          <div className="py-3 flex items-start justify-between">
            <div>
              <span className="font-bold text-[#071B3A] block">EU Tobacco Products Directive (TPD3) Revision</span>
              <p className="text-[#536B8B]">European Commission evaluation of flavour restrictions and synthetic nicotine taxation.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">High Priority</span>
          </div>
          <div className="py-3 flex items-start justify-between">
            <div>
              <span className="font-bold text-[#071B3A] block">US Federal Menthol Product Standard</span>
              <p className="text-[#536B8B]">Rulemaking under inter-agency economic assessment; litigation stay actively evaluated.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEE2E2] text-[#EF4444]">Critical Focus</span>
          </div>
          <div className="py-3 flex items-start justify-between">
            <div>
              <span className="font-bold text-[#071B3A] block">UK Tobacco and Vapes Bill</span>
              <p className="text-[#536B8B]">Generational sales restriction and vape packaging standardization progressing in Parliament.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF6FC] text-[#008FCB]">Monitored</span>
          </div>
        </div>
      </div>
    </div>
  );
};
