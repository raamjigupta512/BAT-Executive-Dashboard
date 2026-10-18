import React from 'react';
import { ChevronDown, Sparkles, AlertTriangle } from 'lucide-react';
import { KpiCard } from '../KpiCard';
import { RevenueProfitabilityChart } from '../RevenueProfitabilityChart';
import { RegionalPerformanceCard } from '../RegionalPerformanceCard';
import { RisksCard } from '../RisksCard';
import { ManagementActionsCard } from '../ManagementActionsCard';
import { AiInsightCard } from '../AiInsightCard';
import { getFlaggedKpis } from '../../utils/kpiDeviation';
import {
  KpiMetric,
  MonthlyOutlookItem,
  RegionalPerformanceItem,
  RiskAlert,
  ManagementAction,
  Currency,
  ReportingPeriod,
  RegionFilter,
  CompareWithMode
} from '../../types/dashboard';

interface ExecutiveOverviewViewProps {
  kpis: KpiMetric[];
  monthlyData: MonthlyOutlookItem[];
  regionalData: RegionalPerformanceItem[];
  risks: RiskAlert[];
  actions: ManagementAction[];
  period: ReportingPeriod;
  currency: Currency;
  region: RegionFilter;
  compareWith?: CompareWithMode;
  onPeriodChange: (p: ReportingPeriod) => void;
  onCurrencyChange: (c: Currency) => void;
  onRegionChange: (r: RegionFilter) => void;
  onCompareWithChange?: (c: CompareWithMode) => void;
  onSelectRisk: (r: RiskAlert) => void;
  onSelectAction: (a: ManagementAction) => void;
  onSelectRegion: (reg: RegionalPerformanceItem) => void;
  onViewAllRisks: () => void;
  onViewAllActions: () => void;
  onViewAllRegions: () => void;
  onAskAiQuestion: (query: string) => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  kpis,
  monthlyData,
  regionalData,
  risks,
  actions,
  period,
  currency,
  region,
  compareWith = 'YoY',
  onPeriodChange,
  onCurrencyChange,
  onRegionChange,
  onCompareWithChange,
  onSelectRisk,
  onSelectAction,
  onSelectRegion,
  onViewAllRisks,
  onViewAllActions,
  onViewAllRegions,
  onAskAiQuestion
}) => {
  const flaggedKpis = getFlaggedKpis(kpis, 5);
  const [expandedKpiIds, setExpandedKpiIds] = React.useState<Set<string>>(new Set());

  const handleToggleKpi = (id: string) => {
    setExpandedKpiIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const allExpanded = kpis.length > 0 && expandedKpiIds.size === kpis.length;

  const handleToggleAllKpis = () => {
    if (allExpanded) {
      setExpandedKpiIds(new Set());
    } else {
      setExpandedKpiIds(new Set(kpis.map((k) => k.id)));
    }
  };

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto">
      {/* 1. Header Section: Title, Subtitle, and Global Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        {/* Title and Subtitle */}
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#071B3A] tracking-tight leading-tight">
            Executive Decision Dashboard
          </h1>
          <p className="text-xs sm:text-[13px] text-[#536B8B] font-normal tracking-normal mt-0.5">
            Financial Performance &nbsp;|&nbsp; Portfolio Transformation &nbsp;|&nbsp; Market Intelligence &nbsp;|&nbsp; Risk &amp; Compliance
          </p>
        </div>

        {/* Global Filter Dropdowns & Synthetic Data Pill & Target Alert Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Deviation Alert Indicator Pill */}
          {flaggedKpis.length > 0 && (
            <div
              className="px-2.5 py-1.5 rounded-md bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-semibold text-[11px] tracking-wide flex items-center gap-1.5 shadow-2xs animate-in fade-in duration-200"
              title={flaggedKpis.map(f => `${f.kpi.title}: ${f.deviation.formattedDeviation} vs target`).join('\n')}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] animate-pulse" />
              <span>{flaggedKpis.length} Target Alert (&gt;5% Variance)</span>
            </div>
          )}

          {/* Reporting Period Filter */}
          <div className="relative">
            <select
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as ReportingPeriod)}
              className="appearance-none bg-white hover:bg-[#F9FCFE] border border-[#DCE8F0] rounded-lg text-xs font-semibold text-[#071B3A] py-1.5 pl-3 pr-7 cursor-pointer focus:outline-hidden focus:border-[#008FCB] shadow-2xs"
            >
              <option value="FY 2025 (YTD)">FY 2025 (YTD)</option>
              <option value="FY 2024 (Full Year)">FY 2024 (Full Year)</option>
              <option value="Q3 2025">Q3 2025</option>
              <option value="Q2 2025">Q2 2025</option>
              <option value="Q1 2025">Q1 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#536B8B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Compare With Filter (YoY, QoQ, Target) */}
          <div className="relative">
            <select
              value={compareWith}
              onChange={(e) => onCompareWithChange?.(e.target.value as CompareWithMode)}
              className="appearance-none bg-white hover:bg-[#F9FCFE] border border-[#BCE1F5] text-[#008FCB] rounded-lg text-xs font-bold py-1.5 pl-3 pr-7 cursor-pointer focus:outline-hidden focus:border-[#008FCB] shadow-2xs"
              title="Compare With Baseline: Year-over-Year, Quarter-over-Quarter, or vs Target Benchmark"
            >
              <option value="YoY">Compare: Year-over-Year (YoY)</option>
              <option value="QoQ">Compare: Quarter-over-Quarter (QoQ)</option>
              <option value="Target">Compare: vs. Target Benchmark</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#008FCB] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Currency Filter */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="appearance-none bg-white hover:bg-[#F9FCFE] border border-[#DCE8F0] rounded-lg text-xs font-semibold text-[#071B3A] py-1.5 pl-3 pr-7 cursor-pointer focus:outline-hidden focus:border-[#008FCB] shadow-2xs"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#536B8B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Region Filter */}
          <div className="relative">
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value as RegionFilter)}
              className="appearance-none bg-white hover:bg-[#F9FCFE] border border-[#DCE8F0] rounded-lg text-xs font-semibold text-[#071B3A] py-1.5 pl-3 pr-7 cursor-pointer focus:outline-hidden focus:border-[#008FCB] shadow-2xs"
            >
              <option value="All Regions">All Regions</option>
              <option value="Americas">Americas</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific & Middle East">Asia Pacific &amp; Middle East</option>
              <option value="Africa">Africa</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#536B8B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Synthetic Data Badge */}
          <div className="px-3 py-1.5 rounded-md bg-[#E0F2FE] border border-[#7DD3FC] text-[#0284C7] font-semibold text-[11px] tracking-wide select-none shadow-2xs">
            SYNTHETIC DATA
          </div>
        </div>
      </div>

      {/* 2. Key Performance Indicators Section Header with Expand All Toggle */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#071B3A]">
            Key Performance Indicators
          </span>
          <span className="text-[11px] text-[#536B8B]">
            ({kpis.length} core metrics • comparing vs. {compareWith === 'YoY' ? 'Prior Year' : compareWith === 'QoQ' ? 'Prior Quarter' : 'Target Benchmark'})
          </span>
        </div>

        <button
          type="button"
          onClick={handleToggleAllKpis}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white hover:bg-[#F4F8FA] border border-[#DCE8F0] text-[#008FCB] shadow-2xs transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${allExpanded ? 'rotate-180' : ''}`} />
          <span>{allExpanded ? 'Collapse All 12M History' : 'Expand All 12M History'}</span>
        </button>
      </div>

      {/* Six KPI Cards Row (Grid 6 columns on large screens) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-3.5">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            kpi={kpi}
            compareWith={compareWith}
            isExpanded={expandedKpiIds.has(kpi.id)}
            onToggleExpand={() => handleToggleKpi(kpi.id)}
          />
        ))}
      </div>

      {/* 3. Middle Analytics Row (60:40 Ratio: Revenue & Profitability Outlook vs Regional Performance) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Left: Revenue & Profitability Outlook (Approx 60% -> 7 cols on 12-grid) */}
        <div className="xl:col-span-7 2xl:col-span-7 min-h-[350px]">
          <RevenueProfitabilityChart
            data={monthlyData}
            currency={currency}
            selectedPeriod={period}
          />
        </div>

        {/* Right: Regional Performance (Approx 40% -> 5 cols on 12-grid) */}
        <div className="xl:col-span-5 2xl:col-span-5 min-h-[350px]">
          <RegionalPerformanceCard
            data={regionalData}
            currency={currency}
            onSelectRegion={onSelectRegion}
            onViewAllDetails={onViewAllRegions}
          />
        </div>
      </div>

      {/* 4. Lower Row: Three Cards (Key Risks & Alerts | Top Management Actions | AI Executive Insight) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 items-stretch">
        {/* Left: Key Risks & Alerts */}
        <div className="min-h-[290px]">
          <RisksCard
            risks={risks}
            onSelectRisk={onSelectRisk}
            onViewAll={onViewAllRisks}
          />
        </div>

        {/* Center: Top Management Actions */}
        <div className="min-h-[290px]">
          <ManagementActionsCard
            actions={actions}
            onReviewAction={onSelectAction}
            onViewAll={onViewAllActions}
          />
        </div>

        {/* Right: AI Executive Insight */}
        <div className="min-h-[290px]">
          <AiInsightCard
            onAskQuestion={onAskAiQuestion}
            reportingPeriod={period}
            currency={currency}
            region={region}
          />
        </div>
      </div>
    </div>
  );
};
