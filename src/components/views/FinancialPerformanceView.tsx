import React, { useState } from 'react';
import { Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import { BarChart3, TrendingUp, Layers, Download, CheckCircle2 } from 'lucide-react';

interface FinancialPerformanceViewProps {
  currency: Currency;
  period: string;
}

export const FinancialPerformanceView: React.FC<FinancialPerformanceViewProps> = ({
  currency,
  period
}) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const [activeSubTab, setActiveSubTab] = useState<'pnl' | 'bridge' | 'pvm'>('pnl');

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#071B3A]">Financial Performance &amp; P&amp;L Analysis</h1>
          <p className="text-xs text-[#536B8B]">
            Consolidated income statement, operating margin bridge, and price-volume-mix variance
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#DCE8F0]">
          <button
            onClick={() => setActiveSubTab('pnl')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'pnl' ? 'bg-[#008FCB] text-white' : 'text-[#536B8B] hover:text-[#071B3A]'
            }`}
          >
            Income Statement
          </button>
          <button
            onClick={() => setActiveSubTab('bridge')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'bridge' ? 'bg-[#008FCB] text-white' : 'text-[#536B8B] hover:text-[#071B3A]'
            }`}
          >
            Margin Bridge
          </button>
          <button
            onClick={() => setActiveSubTab('pvm')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === 'pvm' ? 'bg-[#008FCB] text-white' : 'text-[#536B8B] hover:text-[#071B3A]'
            }`}
          >
            Price-Volume-Mix
          </button>
        </div>
      </div>

      {activeSubTab === 'pnl' && (
        <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#071B3A]">Consolidated P&amp;L Breakdown ({period})</h3>
            <span className="text-xs text-[#536B8B]">All figures in {symbol} Billions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B] font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Financial Line Item</th>
                  <th className="py-2.5 px-4 text-right">FY 2024 (PY)</th>
                  <th className="py-2.5 px-4 text-right">FY 2025 Actual</th>
                  <th className="py-2.5 px-4 text-right">YoY Variance ({symbol})</th>
                  <th className="py-2.5 px-4 text-right">YoY %</th>
                  <th className="py-2.5 px-4">Drivers &amp; Commentary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F6]">
                <tr className="hover:bg-[#F8FAFC] font-semibold text-[#071B3A]">
                  <td className="py-3 px-4">Combustibles Gross Revenue</td>
                  <td className="py-3 px-4 text-right">{symbol}{(22.1 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">{symbol}{(22.5 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+{symbol}{(0.4 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+1.8%</td>
                  <td className="py-3 px-4 text-[#536B8B] font-normal">Pricing corridor realization (+4.8%) offset by volume attrition (-3.0%)</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] font-semibold text-[#071B3A]">
                  <td className="py-3 px-4">New Categories Revenue</td>
                  <td className="py-3 px-4 text-right">{symbol}{(3.02 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">{symbol}{(3.40 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+{symbol}{(0.38 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+12.6%</td>
                  <td className="py-3 px-4 text-[#536B8B] font-normal">Vuse scale in North America and Velo modern oral adoption in Europe</td>
                </tr>
                <tr className="bg-[#F0F8FD] font-bold text-[#008FCB]">
                  <td className="py-3 px-4">Consolidated Net Revenue</td>
                  <td className="py-3 px-4 text-right">{symbol}{(25.12 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">{symbol}{(25.90 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+{symbol}{(0.78 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+3.1%</td>
                  <td className="py-3 px-4 font-normal text-[#071B3A]">Group organic revenue ahead of baseline guidance</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] text-[#536B8B]">
                  <td className="py-3 px-4">Cost of Goods Sold (COGS)</td>
                  <td className="py-3 px-4 text-right">-{symbol}{(6.28 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">-{symbol}{(6.48 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#EF4444]">-{symbol}{(0.20 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#EF4444]">+3.2%</td>
                  <td className="py-3 px-4 font-normal">Leaf raw material indexation (+2.1%) and paperboard packaging costs</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] font-semibold text-[#071B3A]">
                  <td className="py-3 px-4">Gross Profit</td>
                  <td className="py-3 px-4 text-right">{symbol}{(18.84 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">{symbol}{(19.42 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+{symbol}{(0.58 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#12A66A]">+3.1%</td>
                  <td className="py-3 px-4 text-[#536B8B] font-normal">Gross margin held stable at 75.0%</td>
                </tr>
                <tr className="hover:bg-[#F8FAFC] text-[#536B8B]">
                  <td className="py-3 px-4">Operating &amp; Transformation Expenses</td>
                  <td className="py-3 px-4 text-right">-{symbol}{(8.10 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">-{symbol}{(8.42 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#EF4444]">-{symbol}{(0.32 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#EF4444]">+4.0%</td>
                  <td className="py-3 px-4 font-normal">Targeted route-to-market investments in New Categories</td>
                </tr>
                <tr className="bg-[#071F3D] font-bold text-white">
                  <td className="py-3 px-4">Adjusted Operating Profit</td>
                  <td className="py-3 px-4 text-right">{symbol}{(10.74 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right">{symbol}{(11.00 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#10B981]">+{symbol}{(0.26 * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 text-right text-[#10B981]">+2.4%</td>
                  <td className="py-3 px-4 font-normal text-[#E2E8F0]">Operating margin expanded +0.6 pp to 42.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'bridge' && (
        <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071B3A]">Operating Margin Bridge: FY 2024 (41.9%) → FY 2025 (42.5%)</h3>
          <p className="text-xs text-[#536B8B]">Walkthrough of percentage point (pp) margin drivers</p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#EEF2F6]">
              <span className="text-[11px] text-[#7A92A9] block">Base Margin (FY 2024)</span>
              <span className="text-xl font-bold text-[#071B3A]">41.9%</span>
            </div>
            <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0]">
              <span className="text-[11px] text-[#059669] block">Combustible Pricing</span>
              <span className="text-xl font-bold text-[#059669]">+1.4 pp</span>
              <span className="text-[10px] text-[#536B8B]">Net elasticity benefit</span>
            </div>
            <div className="p-4 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0]">
              <span className="text-[11px] text-[#059669] block">Productivity Savings</span>
              <span className="text-xl font-bold text-[#059669]">+0.5 pp</span>
              <span className="text-[10px] text-[#536B8B]">Quantum initiatives</span>
            </div>
            <div className="p-4 bg-[#FEF2F2] rounded-xl border border-[#FECACA]">
              <span className="text-[11px] text-[#DC2626] block">New Categories &amp; COGS</span>
              <span className="text-xl font-bold text-[#DC2626]">-1.3 pp</span>
              <span className="text-[10px] text-[#536B8B]">Scale spend &amp; raw leaf</span>
            </div>
            <div className="p-4 bg-[#071F3D] text-white rounded-xl shadow-xs">
              <span className="text-[11px] text-[#8C9EB5] block">Current Margin (FY 2025)</span>
              <span className="text-xl font-bold text-[#00D2FF]">42.5%</span>
              <span className="text-[10px] text-[#10B981]">+0.6 pp YoY</span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'pvm' && (
        <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071B3A]">Price, Volume, Mix Variance Waterfall</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE8F0]">
              <span className="text-xs text-[#536B8B]">Price Effect</span>
              <div className="text-lg font-bold text-[#12A66A]">+{symbol}{(0.82 * rate).toFixed(2)}B</div>
              <p className="text-[11px] text-[#7A92A9] mt-1">Robust pricing in Western Europe and Americas</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE8F0]">
              <span className="text-xs text-[#536B8B]">Volume Effect</span>
              <div className="text-lg font-bold text-[#EF4444]">-{symbol}{(0.31 * rate).toFixed(2)}B</div>
              <p className="text-[11px] text-[#7A92A9] mt-1">Combustible secular industry volume decline</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE8F0]">
              <span className="text-xs text-[#536B8B]">Mix &amp; Category Shift</span>
              <div className="text-lg font-bold text-[#12A66A]">+{symbol}{(0.36 * rate).toFixed(2)}B</div>
              <p className="text-[11px] text-[#7A92A9] mt-1">Modern oral and vapour premium migration</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE8F0]">
              <span className="text-xs text-[#536B8B]">FX Impact</span>
              <div className="text-lg font-bold text-[#F59E0B]">-{symbol}{(0.09 * rate).toFixed(2)}B</div>
              <p className="text-[11px] text-[#7A92A9] mt-1">Emerging market translation headwinds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
