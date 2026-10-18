import React from 'react';
import { Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface BrandMarketShareViewProps {
  currency: Currency;
}

export const BrandMarketShareView: React.FC<BrandMarketShareViewProps> = ({ currency }) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const brands = [
    { name: 'Vuse', category: 'Vapour', rev: 1.72, share: '36.8%', growth: '+14.5%', rank: '#1 Global Closed Vapour', status: 'Growth Leader' },
    { name: 'glo', category: 'Heated Tobacco', rev: 1.10, share: '18.4%', growth: '+8.2%', rank: '#2 in Key APME/Europe', status: 'Scale Phase' },
    { name: 'Velo', category: 'Modern Oral', rev: 0.58, share: '68.5%', growth: '+34.2%', rank: '#1 in Europe Oral', status: 'High Margin Driver' },
    { name: 'Dunhill', category: 'Premium Combustible', rev: 3.45, share: '8.2%', growth: '+1.4%', rank: 'Global Prestige', status: 'Cash Cow' },
    { name: 'Lucky Strike', category: 'Combustible', rev: 3.82, share: '11.0%', growth: '+2.1%', rank: 'Core Value/Mid', status: 'Volume Anchor' },
    { name: 'Kent', category: 'Combustible', rev: 2.95, share: '7.8%', growth: '-0.8%', rank: 'Innovation Heritage', status: 'Mature Cash Flow' },
    { name: 'Pall Mall', category: 'Combustible', rev: 2.40, share: '6.4%', growth: '-1.5%', rank: 'Value Segment', status: 'Margin Managed' }
  ];

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-[#071B3A]">Brand &amp; Market Share Performance</h1>
        <p className="text-xs text-[#536B8B]">
          Strategic brand portfolio: New Categories growth engines vs premium combustible cash generators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Key Markets Weighted Share</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">27.8%</div>
          <span className="text-xs text-[#F59E0B] font-semibold">▼ -0.3 pp vs. target</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Smoke-Free Consumer Base</span>
          <div className="text-2xl font-bold text-[#008FCB] mt-1">26.4M</div>
          <span className="text-xs text-[#12A66A] font-semibold">▲ +2.3M YoY expansion</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">New Categories Contribution</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">13.1%</div>
          <span className="text-xs text-[#12A66A] font-semibold">▲ +1.5 pp of Group Revenue</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
        <h3 className="text-sm font-bold text-[#071B3A] mb-3">Portfolio Brand Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Brand</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Annual Revenue</th>
                <th className="py-2.5 px-4">Category Share</th>
                <th className="py-2.5 px-4">YoY Growth</th>
                <th className="py-2.5 px-4">Market Position</th>
                <th className="py-2.5 px-4">Strategic Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F6]">
              {brands.map((b, i) => (
                <tr key={i} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#071B3A]">{b.name}</td>
                  <td className="py-3 px-4 text-[#536B8B]">{b.category}</td>
                  <td className="py-3 px-4 font-semibold text-[#071B3A]">{symbol}{(b.rev * rate).toFixed(2)}B</td>
                  <td className="py-3 px-4 font-bold text-[#008FCB]">{b.share}</td>
                  <td className="py-3 px-4">
                    {b.growth.startsWith('+') ? (
                      <span className="text-[#12A66A] font-semibold">{b.growth}</span>
                    ) : (
                      <span className="text-[#EF4444] font-semibold">{b.growth}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#2C425E]">{b.rank}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF6FC] text-[#008FCB]">
                      {b.status}
                    </span>
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
