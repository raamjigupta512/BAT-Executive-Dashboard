import React from 'react';
import { Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import { Leaf, Zap, Flame, Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface NewCategoriesViewProps {
  currency: Currency;
}

export const NewCategoriesView: React.FC<NewCategoriesViewProps> = ({ currency }) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A]">New Categories Transformation</h1>
        <p className="text-xs text-[#536B8B]">
          Building &quot;A Better Tomorrow&quot; — tracking non-combustible scale, consumer adoption, and gross profitability
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vapour (Vuse) */}
        <div className="p-5 bg-white rounded-xl border border-[#DCE8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#008FCB] uppercase tracking-wider">Vapour (Vuse)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF6FC] text-[#008FCB]">#1 Global</span>
            </div>
            <div className="text-2xl font-bold text-[#071B3A]">{symbol}{(1.72 * rate).toFixed(2)}B</div>
            <span className="text-xs text-[#12A66A] font-semibold">▲ +14.5% YoY Growth</span>
            <p className="text-xs text-[#536B8B] mt-2">
              Driven by closed-system cartridge strength in US and Western Europe. Premium positioning protects 58% gross margin.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#EEF2F6] flex justify-between text-xs text-[#7A92A9]">
            <span>Active Consumers: 13.8M</span>
            <span className="font-semibold text-[#071B3A]">50.6% of New Cat.</span>
          </div>
        </div>

        {/* Heated Tobacco (glo) */}
        <div className="p-5 bg-white rounded-xl border border-[#DCE8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">Heated Products (glo)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706]">Hyper Pro Launch</span>
            </div>
            <div className="text-2xl font-bold text-[#071B3A]">{symbol}{(1.10 * rate).toFixed(2)}B</div>
            <span className="text-xs text-[#12A66A] font-semibold">▲ +8.2% YoY Growth</span>
            <p className="text-xs text-[#536B8B] mt-2">
              Expansion in Japan, Italy, and Poland. Device upgrade cycle is improving stick consumable repeat purchasing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#EEF2F6] flex justify-between text-xs text-[#7A92A9]">
            <span>Active Consumers: 8.9M</span>
            <span className="font-semibold text-[#071B3A]">32.4% of New Cat.</span>
          </div>
        </div>

        {/* Modern Oral (Velo) */}
        <div className="p-5 bg-white rounded-xl border border-[#DCE8F0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#10B981] uppercase tracking-wider">Modern Oral (Velo)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D1FAE5] text-[#059669]">Fastest Growth</span>
            </div>
            <div className="text-2xl font-bold text-[#071B3A]">{symbol}{(0.58 * rate).toFixed(2)}B</div>
            <span className="text-xs text-[#12A66A] font-semibold">▲ +34.2% YoY Growth</span>
            <p className="text-xs text-[#536B8B] mt-2">
              Dominant category share in Scandinavia and UK. Premium gross margin exceeds 64%, creating strong profit tailwind.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#EEF2F6] flex justify-between text-xs text-[#7A92A9]">
            <span>Active Consumers: 3.7M</span>
            <span className="font-semibold text-[#071B3A]">17.0% of New Cat.</span>
          </div>
        </div>
      </div>

      {/* Strategic Milestones */}
      <div className="p-5 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#071B3A] mb-3">Transformation Milestones towards £5 Billion Target</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[#071B3A]">FY2025 Progress: {symbol}{(3.4 * rate).toFixed(1)}B of {symbol}{(5.0 * rate).toFixed(1)}B Target</span>
              <span className="text-[#008FCB]">68% Achieved</span>
            </div>
            <div className="w-full h-3 bg-[#E2EEF5] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#008FCB] to-[#56CCF2] rounded-full" style={{ width: '68%' }} />
            </div>
          </div>
          <p className="text-xs text-[#536B8B]">
            New Categories break-even was achieved in FY2024; category operating margin contribution reached +£390M in FY2025.
          </p>
        </div>
      </div>
    </div>
  );
};
