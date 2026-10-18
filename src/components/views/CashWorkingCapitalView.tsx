import React from 'react';
import { Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import { Coins, Clock, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface CashWorkingCapitalViewProps {
  currency: Currency;
}

export const CashWorkingCapitalView: React.FC<CashWorkingCapitalViewProps> = ({ currency }) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A]">Cash Flow &amp; Working Capital Intelligence</h1>
        <p className="text-xs text-[#536B8B]">
          Operating cash generation, cash conversion cycle (CCC), balance sheet efficiency and regional liquidity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Operating Cash Flow</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">{symbol}{(8.2 * rate).toFixed(1)}B</div>
          <span className="text-xs text-[#12A66A] font-semibold">▲ +4.8% YoY (74.5% conversion)</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Cash Conversion Cycle (CCC)</span>
          <div className="text-2xl font-bold text-[#008FCB] mt-1">68 Days</div>
          <span className="text-xs text-[#12A66A] font-semibold">▼ -2 Days vs. PY (Efficiency gain)</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Days Sales Outstanding (DSO)</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">34 Days</div>
          <span className="text-xs text-[#12A66A] font-semibold">▼ -1.2 Days improvement</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Days Inventory Outstanding (DIO)</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">88 Days</div>
          <span className="text-xs text-[#536B8B]">Includes strategic leaf crop aging</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#071B3A] mb-3">Free Cash Flow Waterfall ({symbol}B)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="p-3.5 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
            <span className="text-xs text-[#7A92A9] block">Adj. Operating Profit</span>
            <span className="text-lg font-bold text-[#071B3A]">+{symbol}{(11.0 * rate).toFixed(2)}B</span>
          </div>
          <div className="p-3.5 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
            <span className="text-xs text-[#DC2626] block">Net Working Capital Outflow</span>
            <span className="text-lg font-bold text-[#DC2626]">-{symbol}{(0.85 * rate).toFixed(2)}B</span>
          </div>
          <div className="p-3.5 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
            <span className="text-xs text-[#DC2626] block">Net Interest &amp; Tax Paid</span>
            <span className="text-lg font-bold text-[#DC2626]">-{symbol}{(1.95 * rate).toFixed(2)}B</span>
          </div>
          <div className="p-3.5 bg-[#FEF2F2] rounded-lg border border-[#FECACA]">
            <span className="text-xs text-[#DC2626] block">Gross Capex &amp; Intangibles</span>
            <span className="text-lg font-bold text-[#DC2626]">-{symbol}{(0.85 * rate).toFixed(2)}B</span>
          </div>
          <div className="p-3.5 bg-[#071F3D] text-white rounded-lg shadow-xs">
            <span className="text-xs text-[#8C9EB5] block">Free Cash Flow Generated</span>
            <span className="text-lg font-bold text-[#00D2FF]">+{symbol}{(7.35 * rate).toFixed(2)}B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
