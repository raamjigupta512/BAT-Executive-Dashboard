import React from 'react';
import { Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import { FileText, Download, Printer, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { BATLogo } from '../BATLogo';

interface ReportsViewProps {
  currency: Currency;
  period: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ currency, period }) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const handleDownloadCsv = () => {
    const csvContent = `data:text/csv;charset=utf-8,` +
      `Category,Metric,FY2024_PY,FY2025_Actual,YoY_Variance,Unit\n` +
      `Consolidated,Group Revenue,25.12,25.90,+3.1%,${symbol} Billion\n` +
      `Consolidated,Adjusted Operating Profit,10.74,11.00,+2.4%,${symbol} Billion\n` +
      `Consolidated,Operating Margin,41.9%,42.5%,+0.6 pp,Percent\n` +
      `Consolidated,Operating Cash Flow,7.82,8.20,+4.8%,${symbol} Billion\n` +
      `New Categories,Non-Combustible Revenue,3.02,3.40,+12.6%,${symbol} Billion\n` +
      `Regional,Americas Revenue,8.44,8.80,+4.2%,${symbol} Billion\n` +
      `Regional,Europe Revenue,7.29,7.50,+2.8%,${symbol} Billion\n` +
      `Regional,Asia Pacific & Middle East,6.28,6.50,+3.4%,${symbol} Billion\n` +
      `Regional,Africa Revenue,3.06,3.10,+1.1%,${symbol} Billion\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BAT_Executive_Financial_Report_${period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#071B3A]">Executive Reports &amp; Board Packs</h1>
          <p className="text-xs text-[#536B8B]">
            Print-ready CFO briefings, statutory audit schedules, and CSV data exports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 bg-white hover:bg-[#F4F8FA] border border-[#DCE8F0] text-[#071B3A] text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-[#008FCB]" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#008FCB] hover:bg-[#007AB8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Briefing</span>
          </button>
        </div>
      </div>

      {/* Board Briefing Document Preview (Print Styled) */}
      <div className="bg-white rounded-2xl p-8 border border-[#DCE8F0] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#DCE8F0] pb-4">
          <BATLogo />
          <div className="text-right">
            <span className="text-xs font-bold text-[#071B3A] block">EXECUTIVE COMMITTEE BRIEFING</span>
            <span className="text-[11px] text-[#536B8B]">Period: {period} • Currency: {currency}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-[#071B3A]">1. Executive Performance Synthesis</h2>
          <p className="text-xs leading-relaxed text-[#2C425E]">
            British American Tobacco delivered strong operational performance during {period}. Consolidated net revenue
            reached {symbol}{(25.9 * rate).toFixed(1)}B (+3.1% YoY), reflecting disciplined combustible pricing realization and
            accelerated expansion of the New Categories portfolio (+12.6% YoY to {symbol}{(3.4 * rate).toFixed(1)}B).
            Adjusted operating margin expanded +0.6 percentage points to 42.5%, yielding adjusted operating profit of {symbol}{(11.0 * rate).toFixed(1)}B.
            Operating cash flow of {symbol}{(8.2 * rate).toFixed(1)}B represents 74.5% conversion, reinforcing balance sheet deleveraging.
          </p>
        </div>

        {/* Financial Highlights Table */}
        <div>
          <h3 className="text-sm font-bold text-[#071B3A] mb-2">2. Consolidated Group Financial Summary</h3>
          <table className="w-full text-xs text-left border border-[#DCE8F0] rounded-lg overflow-hidden">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B]">
              <tr>
                <th className="p-3">Financial Metric</th>
                <th className="p-3 text-right">FY 2024 (PY)</th>
                <th className="p-3 text-right">FY 2025 Actual</th>
                <th className="p-3 text-right">Reported Variance</th>
                <th className="p-3">Status vs. Board Guidance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F6]">
              <tr>
                <td className="p-3 font-semibold">Group Revenue</td>
                <td className="p-3 text-right">{symbol}{(25.12 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right font-bold">{symbol}{(25.90 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right text-[#12A66A] font-semibold">+3.1%</td>
                <td className="p-3 text-[#12A66A] font-medium">Ahead of guidance (3–5% target)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Adjusted Operating Profit</td>
                <td className="p-3 text-right">{symbol}{(10.74 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right font-bold">{symbol}{(11.00 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right text-[#12A66A] font-semibold">+2.4%</td>
                <td className="p-3 text-[#12A66A] font-medium">On track</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Operating Margin</td>
                <td className="p-3 text-right">41.9%</td>
                <td className="p-3 text-right font-bold">42.5%</td>
                <td className="p-3 text-right text-[#12A66A] font-semibold">+0.6 pp</td>
                <td className="p-3 text-[#12A66A] font-medium">Expanded</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">Operating Cash Flow</td>
                <td className="p-3 text-right">{symbol}{(7.82 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right font-bold">{symbol}{(8.20 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right text-[#12A66A] font-semibold">+4.8%</td>
                <td className="p-3 text-[#12A66A] font-medium">Strong cash conversion (74.5%)</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold">New Categories Revenue</td>
                <td className="p-3 text-right">{symbol}{(3.02 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right font-bold">{symbol}{(3.40 * rate).toFixed(2)}B</td>
                <td className="p-3 text-right text-[#12A66A] font-semibold">+12.6%</td>
                <td className="p-3 text-[#12A66A] font-medium">High double-digit run rate</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regional Breakdown Summary */}
        <div>
          <h3 className="text-sm font-bold text-[#071B3A] mb-2">3. Regional Contribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[#536B8B] block">Americas</span>
              <span className="font-bold text-[#071B3A] text-sm">{symbol}{(8.8 * rate).toFixed(1)}B (34%)</span>
              <span className="text-[#12A66A] block text-[11px]">+4.2% YoY growth</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[#536B8B] block">Europe</span>
              <span className="font-bold text-[#071B3A] text-sm">{symbol}{(7.5 * rate).toFixed(1)}B (29%)</span>
              <span className="text-[#12A66A] block text-[11px]">+2.8% YoY growth</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[#536B8B] block">APME</span>
              <span className="font-bold text-[#071B3A] text-sm">{symbol}{(6.5 * rate).toFixed(1)}B (25%)</span>
              <span className="text-[#12A66A] block text-[11px]">+3.4% YoY growth</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#EEF2F6]">
              <span className="text-[#536B8B] block">Africa</span>
              <span className="font-bold text-[#071B3A] text-sm">{symbol}{(3.1 * rate).toFixed(1)}B (12%)</span>
              <span className="text-[#12A66A] block text-[11px]">+1.1% YoY growth</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#8C9EB5] pt-4 border-t border-[#EEF2F6] flex justify-between">
          <span>Prepared for BAT Executive Committee &amp; CFO Office</span>
          <span>Confidential • Synthetic Demonstration Baseline</span>
        </div>
      </div>
    </div>
  );
};
