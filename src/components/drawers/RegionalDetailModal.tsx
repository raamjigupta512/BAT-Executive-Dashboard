import React, { useState, useEffect } from 'react';
import {
  X,
  Globe2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BarChart2,
  ArrowLeftRight,
  Scale,
  Check,
  ChevronDown,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { RegionalPerformanceItem, Currency } from '../../types/dashboard';
import { CURRENCY_RATES } from '../../utils/formatters';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface RegionalDetailModalProps {
  region: RegionalPerformanceItem | null;
  allRegions: RegionalPerformanceItem[];
  currency: Currency;
  onClose: () => void;
  onSelectRegion: (reg: RegionalPerformanceItem) => void;
}

interface RegionalHealthProfile {
  healthScore: number;
  healthGrade: 'Strong' | 'Stable' | 'Resilient' | 'Watchpoint';
  dsoDays: number;
  workingCapitalStatus: 'Optimal' | 'Stable' | 'Monitored';
  newCategoriesShare: string;
  freeCashFlowEstimate: string;
  strategicDriver: string;
}

const REGIONAL_HEALTH_DATA: Record<string, RegionalHealthProfile> = {
  americas: {
    healthScore: 94,
    healthGrade: 'Strong',
    dsoDays: 31.8,
    workingCapitalStatus: 'Optimal',
    newCategoriesShare: '18.4% of regional rev',
    freeCashFlowEstimate: '£3.8B',
    strategicDriver: 'US Vuse closed-vapour market leadership and premium combustible pricing power.'
  },
  europe: {
    healthScore: 89,
    healthGrade: 'Stable',
    dsoDays: 35.4,
    workingCapitalStatus: 'Stable',
    newCategoriesShare: '22.1% of regional rev',
    freeCashFlowEstimate: '£2.4B',
    strategicDriver: 'Accelerated Velo modern oral adoption in UK/Nordics & glo Hyper Pro rollout.'
  },
  apme: {
    healthScore: 86,
    healthGrade: 'Resilient',
    dsoDays: 37.1,
    workingCapitalStatus: 'Stable',
    newCategoriesShare: '14.8% of regional rev',
    freeCashFlowEstimate: '£1.9B',
    strategicDriver: 'Japan heated tobacco loyalty and Middle East travel retail volume rebound.'
  },
  africa: {
    healthScore: 78,
    healthGrade: 'Watchpoint',
    dsoDays: 41.2,
    workingCapitalStatus: 'Monitored',
    newCategoriesShare: '5.2% of regional rev',
    freeCashFlowEstimate: '£0.9B',
    strategicDriver: 'Solid combustible pricing power offsetting local currency translation volatility.'
  }
};

export const RegionalDetailModal: React.FC<RegionalDetailModalProps> = ({
  region,
  allRegions,
  currency,
  onClose,
  onSelectRegion
}) => {
  if (!region) return null;

  // Comparison State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareRegionId, setCompareRegionId] = useState<string>('');

  // Auto-select a sensible comparison region when entering compare mode
  useEffect(() => {
    if (isCompareMode && (!compareRegionId || compareRegionId === region.id)) {
      const fallback = allRegions.find((r) => r.id !== region.id);
      if (fallback) {
        setCompareRegionId(fallback.id);
      }
    }
  }, [isCompareMode, region.id, allRegions, compareRegionId]);

  const compareRegion = allRegions.find((r) => r.id === compareRegionId) || null;

  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const primaryHealth = REGIONAL_HEALTH_DATA[region.id];
  const compareHealth = compareRegion ? REGIONAL_HEALTH_DATA[compareRegion.id] : null;

  // Variance calculations when comparing
  const revDiff = compareRegion ? (region.revenue - compareRegion.revenue) * rate : 0;
  const marginDiff = compareRegion ? +(region.operatingMargin - compareRegion.operatingMargin).toFixed(1) : 0;
  const growthDiff = compareRegion ? +(region.yoyGrowth - compareRegion.yoyGrowth).toFixed(1) : 0;
  const shareDiff = compareRegion ? region.shareOfRevenue - compareRegion.shareOfRevenue : 0;

  // Swap regions handler
  const handleSwapRegions = () => {
    if (compareRegion) {
      const oldPrimary = region;
      onSelectRegion(compareRegion);
      setCompareRegionId(oldPrimary.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full bg-white rounded-2xl shadow-2xl border border-[#DCE8F0] overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 ${
          isCompareMode ? 'max-w-5xl' : 'max-w-3xl'
        }`}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#071F3D] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#008FCB]/20 border border-[#008FCB]/40 flex items-center justify-center text-[#00A6E8]">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#8C9EB5] uppercase tracking-wider">
                  Regional Intelligence Drill-Down
                </span>
                {isCompareMode ? (
                  <span className="bg-[#00D2FF]/20 text-[#00D2FF] border border-[#00D2FF]/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Scale className="w-3 h-3" /> Side-by-Side Comparison Mode
                  </span>
                ) : (
                  <span className="bg-[#008FCB] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {region.shareOfRevenue}% Consolidated Share
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5 flex items-center gap-2">
                <span>{region.name}</span>
                {isCompareMode && compareRegion && (
                  <>
                    <span className="text-[#8C9EB5] text-base font-normal">vs.</span>
                    <span className="text-[#00D2FF]">{compareRegion.name}</span>
                  </>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Toggle Button */}
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCompareMode
                  ? 'bg-[#008FCB] text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 text-[#CBDDE9] hover:text-white border border-white/10'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{isCompareMode ? 'Exit Compare' : 'Compare Regions'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8C9EB5] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Region Switcher Sub-Header */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-[#EEF2F6] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-xs font-semibold text-[#536B8B] mr-1 shrink-0">
              Primary:
            </span>
            {allRegions.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  r.id === region.id
                    ? 'bg-[#008FCB] text-white shadow-2xs'
                    : 'text-[#536B8B] hover:bg-[#EEF2F6] hover:text-[#071B3A]'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Secondary Comparison Selector */}
          <div className="flex items-center gap-2 bg-[#EBF6FC] px-3 py-1.5 rounded-lg border border-[#CDE8F7]">
            <span className="text-xs font-bold text-[#008FCB] flex items-center gap-1.5 shrink-0">
              <Scale className="w-3.5 h-3.5" />
              <span>Compare with:</span>
            </span>
            <div className="relative">
              <select
                value={isCompareMode ? compareRegionId : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setCompareRegionId(e.target.value);
                    setIsCompareMode(true);
                  } else {
                    setIsCompareMode(false);
                  }
                }}
                className="appearance-none bg-white border border-[#BCE0F5] rounded-md text-xs font-semibold text-[#071B3A] py-1 pl-2.5 pr-7 cursor-pointer focus:outline-hidden focus:border-[#008FCB]"
              >
                <option value="">None (Single Region)</option>
                {allRegions
                  .filter((r) => r.id !== region.id)
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#536B8B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {isCompareMode && (
              <button
                onClick={handleSwapRegions}
                title="Swap Primary & Comparison Regions"
                className="p-1 text-[#008FCB] hover:bg-white rounded cursor-pointer transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {!isCompareMode ? (
            /* ========================================================================= */
            /* SINGLE REGION DRILL-DOWN VIEW                                             */
            /* ========================================================================= */
            <>
              {/* Key Regional Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#F4F8FA] rounded-xl border border-[#DCE8F0]">
                  <span className="text-xs text-[#536B8B] block">Regional Revenue</span>
                  <span className="text-xl font-bold text-[#071B3A]">
                    {symbol}{(region.revenue * rate).toFixed(2)}B
                  </span>
                  <span className="text-[10.5px] text-[#008FCB] font-medium block mt-0.5">
                    {region.shareOfRevenue}% Group Share
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F8FA] rounded-xl border border-[#DCE8F0]">
                  <span className="text-xs text-[#536B8B] block">YoY Growth</span>
                  <span className="text-xl font-bold text-[#12A66A] flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +{region.yoyGrowth}%
                  </span>
                  <span className="text-[10.5px] text-[#536B8B] block mt-0.5">
                    Organic Constant FX
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F8FA] rounded-xl border border-[#DCE8F0]">
                  <span className="text-xs text-[#536B8B] block">Operating Margin</span>
                  <span className="text-xl font-bold text-[#008FCB]">
                    {region.operatingMargin}%
                  </span>
                  <span className="text-[10.5px] text-[#12A66A] font-medium block mt-0.5">
                    {symbol}{((region.revenue * (region.operatingMargin / 100)) * rate).toFixed(2)}B Op. Profit
                  </span>
                </div>

                <div className="p-3.5 bg-[#F4F8FA] rounded-xl border border-[#DCE8F0]">
                  <span className="text-xs text-[#536B8B] block">Financial Health</span>
                  {primaryHealth ? (
                    <>
                      <span className="text-xl font-bold text-[#071B3A]">
                        {primaryHealth.healthScore}/100
                      </span>
                      <span className="text-[10.5px] text-[#008FCB] font-semibold block mt-0.5">
                        {primaryHealth.healthGrade} • {primaryHealth.dsoDays}d DSO
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-[#071B3A]">Optimal</span>
                  )}
                </div>
              </div>

              {/* Key Markets Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#008FCB]" />
                  Market-Level Performance &amp; Dynamics
                </h4>
                <div className="border border-[#DCE8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B] font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Operating Market</th>
                        <th className="py-2.5 px-4">Revenue</th>
                        <th className="py-2.5 px-4">Regional Share</th>
                        <th className="py-2.5 px-4">Volume &amp; Category Dynamic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF2F6]">
                      {region.keyMarkets.map((m, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                          <td className="py-3 px-4 font-bold text-[#071B3A]">{m.country}</td>
                          <td className="py-3 px-4 font-semibold text-[#071B3A]">
                            {symbol}{(m.revenue * rate).toFixed(2)}B
                          </td>
                          <td className="py-3 px-4 text-[#536B8B]">{m.share}%</td>
                          <td className="py-3 px-4 text-[#008FCB] font-medium">{m.volumeTrend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Regional Headwinds & Watchpoints */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                  Specific Headwinds &amp; Regulatory Watchpoints
                </h4>
                <div className="space-y-2">
                  {region.headwinds.map((hw, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#FEF9EE] border border-[#FDE6B0] rounded-lg text-xs text-[#92400E] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                      <span>{hw}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ========================================================================= */
            /* SIDE-BY-SIDE REGIONAL COMPARISON OVERLAY VIEW                             */
            /* ========================================================================= */
            compareRegion && (
              <div className="space-y-6">
                {/* 1. Comparison Executive Delta Banner */}
                <div className="bg-[#071F3D] rounded-xl p-4 text-white border border-[#1A3D63] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#008FCB] flex items-center justify-center text-white">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Performance Delta: {region.name} vs. {compareRegion.name}
                      </h4>
                      <p className="text-[11px] text-[#8C9EB5]">
                        Normalized constant currency variances across core executive metrics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-right">
                      <span className="text-[#8C9EB5] block text-[10.5px]">Revenue Diff</span>
                      <span
                        className={`font-bold ${
                          revDiff >= 0 ? 'text-[#00D2FF]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {revDiff >= 0 ? `+${symbol}${revDiff.toFixed(2)}B` : `-${symbol}${Math.abs(revDiff).toFixed(2)}B`}
                      </span>
                    </div>

                    <div className="text-right border-l border-[#1A3D63] pl-4">
                      <span className="text-[#8C9EB5] block text-[10.5px]">Margin Delta</span>
                      <span
                        className={`font-bold ${
                          marginDiff >= 0 ? 'text-[#12A66A]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {marginDiff >= 0 ? `+${marginDiff} pp` : `${marginDiff} pp`}
                      </span>
                    </div>

                    <div className="text-right border-l border-[#1A3D63] pl-4">
                      <span className="text-[#8C9EB5] block text-[10.5px]">YoY Spread</span>
                      <span
                        className={`font-bold ${
                          growthDiff >= 0 ? 'text-[#12A66A]' : 'text-[#F59E0B]'
                        }`}
                      >
                        {growthDiff >= 0 ? `+${growthDiff} pp` : `${growthDiff} pp`}
                      </span>
                    </div>

                    <div className="text-right border-l border-[#1A3D63] pl-4">
                      <span className="text-[#8C9EB5] block text-[10.5px]">Share Delta</span>
                      <span className="font-bold text-white">
                        {shareDiff >= 0 ? `+${shareDiff}%` : `${shareDiff}%`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Side-by-Side Key Metrics Comparison Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-3 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-[#008FCB]" />
                    Comparative Core Financial Metrics
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Region Column */}
                    <div className="p-4 bg-[#F4F8FA] rounded-xl border-2 border-[#008FCB]/40 relative">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCE8F0]">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#008FCB]" />
                          <h3 className="font-bold text-sm text-[#071B3A]">{region.name}</h3>
                          <span className="text-[10px] bg-[#008FCB] text-white px-2 py-0.5 rounded-full font-bold">
                            Primary
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#008FCB]">
                          {region.shareOfRevenue}% Group
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Revenue</span>
                          <span className="text-base font-bold text-[#071B3A]">
                            {symbol}{(region.revenue * rate).toFixed(2)}B
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Operating Margin</span>
                          <span className="text-base font-bold text-[#008FCB]">
                            {region.operatingMargin}%
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">YoY Organic Growth</span>
                          <span className="text-base font-bold text-[#12A66A] flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +{region.yoyGrowth}%
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Est. Operating Profit</span>
                          <span className="text-base font-bold text-[#071B3A]">
                            {symbol}{((region.revenue * (region.operatingMargin / 100)) * rate).toFixed(2)}B
                          </span>
                        </div>
                      </div>

                      {primaryHealth && (
                        <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#DCE8F0] text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#536B8B] font-semibold">Health Score &amp; Grade</span>
                            <span className="font-bold text-[#008FCB]">{primaryHealth.healthScore}/100 • {primaryHealth.healthGrade}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#7A92A9]">
                            <span>DSO: <strong className="text-[#071B3A]">{primaryHealth.dsoDays} days</strong></span>
                            <span>Working Capital: <strong className="text-[#12A66A]">{primaryHealth.workingCapitalStatus}</strong></span>
                            <span>FCF Est: <strong className="text-[#071B3A]">{primaryHealth.freeCashFlowEstimate}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Comparison Region Column */}
                    <div className="p-4 bg-[#F8FAFC] rounded-xl border-2 border-[#56CCF2]/50 relative">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#DCE8F0]">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#56CCF2]" />
                          <h3 className="font-bold text-sm text-[#071B3A]">{compareRegion.name}</h3>
                          <span className="text-[10px] bg-[#EBF6FC] text-[#008FCB] border border-[#BCE0F5] px-2 py-0.5 rounded-full font-bold">
                            Comparison
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#008FCB]">
                          {compareRegion.shareOfRevenue}% Group
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Revenue</span>
                          <span className="text-base font-bold text-[#071B3A]">
                            {symbol}{(compareRegion.revenue * rate).toFixed(2)}B
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Operating Margin</span>
                          <span className="text-base font-bold text-[#008FCB]">
                            {compareRegion.operatingMargin}%
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">YoY Organic Growth</span>
                          <span className="text-base font-bold text-[#12A66A] flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> +{compareRegion.yoyGrowth}%
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-lg border border-[#DCE8F0]">
                          <span className="text-[#7A92A9] block text-[11px]">Est. Operating Profit</span>
                          <span className="text-base font-bold text-[#071B3A]">
                            {symbol}{((compareRegion.revenue * (compareRegion.operatingMargin / 100)) * rate).toFixed(2)}B
                          </span>
                        </div>
                      </div>

                      {compareHealth && (
                        <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#DCE8F0] text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#536B8B] font-semibold">Health Score &amp; Grade</span>
                            <span className="font-bold text-[#008FCB]">{compareHealth.healthScore}/100 • {compareHealth.healthGrade}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#7A92A9]">
                            <span>DSO: <strong className="text-[#071B3A]">{compareHealth.dsoDays} days</strong></span>
                            <span>Working Capital: <strong className="text-[#12A66A]">{compareHealth.workingCapitalStatus}</strong></span>
                            <span>FCF Est: <strong className="text-[#071B3A]">{compareHealth.freeCashFlowEstimate}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Recharts Side-by-Side Comparative Bar Charts */}
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#DCE8F0] space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#008FCB]" />
                      Comparative Bar Chart Overlay: {region.name} vs. {compareRegion.name}
                    </h4>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-[#008FCB]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#008FCB]" />
                        {region.name} (Primary)
                      </span>
                      <span className="flex items-center gap-1.5 font-bold text-[#56CCF2]">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#56CCF2]" />
                        {compareRegion.name} (Comparison)
                      </span>
                    </div>
                  </div>

                  {/* Dual Grid of Recharts Bar Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Bar Chart 1: Revenue & Operating Profit Scale */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DCE8F0]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#071B3A]">
                          Financial Scale Comparison ({symbol}B)
                        </span>
                        <span className="text-[10px] text-[#536B8B]">Constant Currency</span>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                metric: 'Revenue',
                                [region.name]: +(region.revenue * rate).toFixed(2),
                                [compareRegion.name]: +(compareRegion.revenue * rate).toFixed(2),
                              },
                              {
                                metric: 'Operating Profit',
                                [region.name]: +((region.revenue * (region.operatingMargin / 100)) * rate).toFixed(2),
                                [compareRegion.name]: +((compareRegion.revenue * (compareRegion.operatingMargin / 100)) * rate).toFixed(2),
                              }
                            ]}
                            margin={{ top: 12, right: 12, left: -15, bottom: 4 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
                            <RechartsTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#071F3D] text-white text-xs p-2.5 rounded-lg shadow-xl border border-[#1A3D63]">
                                      <div className="font-bold border-b border-[#1A3D63] pb-1 mb-1 text-white">
                                        {label}
                                      </div>
                                      {payload.map((entry, idx) => (
                                        <div key={idx} className="flex justify-between gap-3 text-[11px]">
                                          <span style={{ color: entry.color }}>{entry.name}:</span>
                                          <strong className="text-white">
                                            {symbol}{Number(entry.value).toFixed(2)}B
                                          </strong>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar
                              dataKey={region.name}
                              fill="#008FCB"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={44}
                            />
                            <Bar
                              dataKey={compareRegion.name}
                              fill="#56CCF2"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={44}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart 2: Operating Margin & YoY Growth Rate */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DCE8F0]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#071B3A]">
                          Margin &amp; Growth Rates (%)
                        </span>
                        <span className="text-[10px] text-[#536B8B]">Key Performance Ratios</span>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                metric: 'Operating Margin',
                                [region.name]: region.operatingMargin,
                                [compareRegion.name]: compareRegion.operatingMargin,
                              },
                              {
                                metric: 'YoY Growth Rate',
                                [region.name]: region.yoyGrowth,
                                [compareRegion.name]: compareRegion.yoyGrowth,
                              }
                            ]}
                            margin={{ top: 12, right: 12, left: -15, bottom: 4 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} axisLine={false} />
                            <RechartsTooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-[#071F3D] text-white text-xs p-2.5 rounded-lg shadow-xl border border-[#1A3D63]">
                                      <div className="font-bold border-b border-[#1A3D63] pb-1 mb-1 text-white">
                                        {label}
                                      </div>
                                      {payload.map((entry, idx) => (
                                        <div key={idx} className="flex justify-between gap-3 text-[11px]">
                                          <span style={{ color: entry.color }}>{entry.name}:</span>
                                          <strong className="text-white">
                                            {Number(entry.value).toFixed(1)}%
                                          </strong>
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar
                              dataKey={region.name}
                              fill="#12A66A"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={44}
                            />
                            <Bar
                              dataKey={compareRegion.name}
                              fill="#34D399"
                              radius={[4, 4, 0, 0]}
                              maxBarSize={44}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Side-by-Side Market Breakdown Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Primary Region Markets */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#008FCB]" />
                      {region.name} Top Markets
                    </h4>
                    <div className="border border-[#DCE8F0] rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#7A92A9] text-[11px]">
                          <tr>
                            <th className="py-2 px-3">Market</th>
                            <th className="py-2 px-3">Rev</th>
                            <th className="py-2 px-3">Dynamics</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEF2F6]">
                          {region.keyMarkets.map((m, idx) => (
                            <tr key={idx} className="hover:bg-[#F8FAFC]">
                              <td className="py-2 px-3 font-semibold text-[#071B3A]">{m.country}</td>
                              <td className="py-2 px-3 font-bold text-[#071B3A]">
                                {symbol}{(m.revenue * rate).toFixed(1)}B
                              </td>
                              <td className="py-2 px-3 text-[11px] text-[#008FCB]">{m.volumeTrend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Secondary Region Markets */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#56CCF2]" />
                      {compareRegion.name} Top Markets
                    </h4>
                    <div className="border border-[#DCE8F0] rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#7A92A9] text-[11px]">
                          <tr>
                            <th className="py-2 px-3">Market</th>
                            <th className="py-2 px-3">Rev</th>
                            <th className="py-2 px-3">Dynamics</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEF2F6]">
                          {compareRegion.keyMarkets.map((m, idx) => (
                            <tr key={idx} className="hover:bg-[#F8FAFC]">
                              <td className="py-2 px-3 font-semibold text-[#071B3A]">{m.country}</td>
                              <td className="py-2 px-3 font-bold text-[#071B3A]">
                                {symbol}{(m.revenue * rate).toFixed(1)}B
                              </td>
                              <td className="py-2 px-3 text-[11px] text-[#008FCB]">{m.volumeTrend}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 5. Headwinds & Regulatory Risk Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {region.name} Regulatory Watchpoints
                    </h4>
                    <div className="space-y-1.5">
                      {region.headwinds.map((hw, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#FEF9EE] border border-[#FDE6B0] rounded-lg text-xs text-[#92400E] flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <span>{hw}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] mb-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {compareRegion.name} Regulatory Watchpoints
                    </h4>
                    <div className="space-y-1.5">
                      {compareRegion.headwinds.map((hw, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-[#FEF9EE] border border-[#FDE6B0] rounded-lg text-xs text-[#92400E] flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <span>{hw}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#DCE8F0] flex items-center justify-between">
          <span className="text-xs text-[#7A92A9]">
            Reconciles with consolidated {currency} reporting baseline • {isCompareMode ? 'Multi-regional parity overlay' : 'Standard regional drilldown'}
          </span>
          <div className="flex items-center gap-2">
            {isCompareMode && (
              <button
                onClick={() => setIsCompareMode(false)}
                className="px-3 py-1.5 border border-[#DCE8F0] hover:bg-white text-[#536B8B] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#071F3D] hover:bg-[#062544] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
