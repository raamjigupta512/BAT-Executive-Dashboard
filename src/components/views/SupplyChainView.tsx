import React from 'react';
import { Currency } from '../../types/dashboard';
import { Factory, ShieldCheck, Truck, AlertTriangle, Layers } from 'lucide-react';

export const SupplyChainView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A]">Supply Chain &amp; Operational Resilience</h1>
        <p className="text-xs text-[#536B8B]">
          Global manufacturing footprint, leaf sourcing security, Tier-1 electronics vendor risk, and freight logistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Active Primary Factories</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">42 Sites</div>
          <span className="text-xs text-[#12A66A] font-semibold">94.2% Overall Plant OEE</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Strategic Leaf Sourcing Buffer</span>
          <div className="text-2xl font-bold text-[#008FCB] mt-1">14 Months</div>
          <span className="text-xs text-[#536B8B]">Secured across Brazil, US, Zimbabwe</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">New Cat. Device Lead Times</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">45 Days</div>
          <span className="text-xs text-[#12A66A] font-semibold">▼ -8 days vs. peak 2024</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">On-Time In-Full (OTIF)</span>
          <div className="text-2xl font-bold text-[#12A66A] mt-1">98.4%</div>
          <span className="text-xs text-[#12A66A] font-semibold">Exceeds 97.5% threshold</span>
        </div>
      </div>

      <div className="p-5 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#071B3A] mb-3">Key Operational Mitigation Hubs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
            <span className="font-bold text-[#071B3A] block mb-1">Shenzhen &amp; Taiwan Electronics Sourcing</span>
            <p className="text-[#536B8B]">Secondary contract manufacturer qualification underway in Vietnam to diversify glo heating module production.</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
            <span className="font-bold text-[#071B3A] block mb-1">European Modern Oral (Velo) Hubs</span>
            <p className="text-[#536B8B]">High-speed packaging line automation in Hungary expanded capacity by 35% with lower unit labor costs.</p>
          </div>
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
            <span className="font-bold text-[#071B3A] block mb-1">Americas Direct Distribution</span>
            <p className="text-[#536B8B]">Route optimization software reduced delivery miles by 4.2% across North American wholesale routes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
