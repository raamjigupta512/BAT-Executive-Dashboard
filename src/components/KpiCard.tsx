import React, { useState } from 'react';
import {
  BarChart3,
  Coins,
  Gauge,
  Landmark,
  Leaf,
  Target,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Maximize2,
  X,
  BarChart2,
  LineChart as LineChartIcon,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { KpiMetric, CompareWithMode } from '../types/dashboard';
import { checkKpiDeviation, KpiDeviationResult } from '../utils/kpiDeviation';

interface KpiCardProps {
  kpi: KpiMetric;
  onClick?: () => void;
  thresholdPercent?: number;
  highlightDeviation?: boolean;
  compareWith?: CompareWithMode;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  kpi,
  onClick,
  thresholdPercent = 5,
  highlightDeviation = true,
  compareWith = 'YoY',
  isExpanded: controlledExpanded,
  onToggleExpand
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [chartViewType, setChartViewType] = useState<'line' | 'bar'>('line');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Controlled or uncontrolled expansion state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  // Check deviation from corporate target using the dedicated function
  const deviation: KpiDeviationResult = checkKpiDeviation(kpi, {
    thresholdPercent,
    mode: 'adverse'
  });

  const isFlagged = highlightDeviation && deviation.isFlagged;

  const getIcon = () => {
    switch (kpi.iconType) {
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-[#008FCB]" />;
      case 'coins':
        return <Coins className="w-4 h-4 text-[#008FCB]" />;
      case 'gauge':
        return <Gauge className="w-4 h-4 text-[#008FCB]" />;
      case 'bank':
        return <Landmark className="w-4 h-4 text-[#008FCB]" />;
      case 'leaf':
        return <Leaf className="w-4 h-4 text-[#008FCB]" />;
      case 'target':
        return <Target className="w-4 h-4 text-[#008FCB]" />;
      default:
        return null;
    }
  };

  // Determine trend text, value, and isPositive based on compareWith mode
  let activeTrend = kpi.trend;
  let activeTrendValue = kpi.trendValue;
  let activeIsPositive = kpi.isPositive;
  let activeComparisonLabel = kpi.comparisonLabel;

  if (compareWith === 'YoY') {
    activeTrend = kpi.yoyTrend || kpi.trend;
    activeTrendValue = kpi.yoyTrendValue ?? kpi.trendValue;
    activeIsPositive = kpi.yoyIsPositive ?? kpi.isPositive;
    activeComparisonLabel = 'vs. PY';
  } else if (compareWith === 'QoQ') {
    activeTrend = kpi.qoqTrend || (kpi.trendValue > 0 ? `+${(kpi.trendValue * 0.45).toFixed(1)}%` : `${(kpi.trendValue * 0.45).toFixed(1)}%`);
    activeTrendValue = kpi.qoqTrendValue ?? +(kpi.trendValue * 0.45).toFixed(1);
    activeIsPositive = kpi.qoqIsPositive ?? (activeTrendValue >= 0);
    activeComparisonLabel = 'vs. PQ';
  } else if (compareWith === 'Target') {
    activeTrend = deviation.formattedDeviation;
    activeTrendValue = deviation.deviationPercent;
    activeIsPositive = deviation.deviationPercent >= 0;
    activeComparisonLabel = 'vs. Target';
  }

  // Build sparkline data points for Recharts (last 6 months)
  const sparklineMonths = kpi.sparklineMonths || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const sparkData = (kpi.sparkline || []).map((val, idx) => ({
    month: sparklineMonths[idx] || `M${idx + 1}`,
    val
  }));

  const sparkColor = isFlagged ? '#EF4444' : activeIsPositive ? '#12A66A' : '#F59E0B';

  // 12-month data points for expandable historical chart
  const historyData = kpi.history12Months || [
    { month: 'Nov 24', monthFull: 'November 2024', value: (kpi.sparkline?.[0] || 2.0) * 0.95, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.92 },
    { month: 'Dec 24', monthFull: 'December 2024', value: (kpi.sparkline?.[0] || 2.0) * 0.98, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.94 },
    { month: 'Jan 25', monthFull: 'January 2025', value: (kpi.sparkline?.[0] || 2.0) * 0.92, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.90 },
    { month: 'Feb 25', monthFull: 'February 2025', value: (kpi.sparkline?.[0] || 2.0) * 0.94, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.91 },
    { month: 'Mar 25', monthFull: 'March 2025', value: (kpi.sparkline?.[0] || 2.0) * 0.96, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.93 },
    { month: 'Apr 25', monthFull: 'April 2025', value: (kpi.sparkline?.[0] || 2.0) * 0.98, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.0) * 0.95 },
    { month: 'May 25', monthFull: 'May 2025', value: kpi.sparkline?.[0] || 2.1, target: kpi.targetValue, priorYear: (kpi.sparkline?.[0] || 2.1) * 0.96 },
    { month: 'Jun 25', monthFull: 'June 2025', value: kpi.sparkline?.[1] || 2.18, target: kpi.targetValue, priorYear: (kpi.sparkline?.[1] || 2.18) * 0.96 },
    { month: 'Jul 25', monthFull: 'July 2025', value: kpi.sparkline?.[2] || 2.25, target: kpi.targetValue, priorYear: (kpi.sparkline?.[2] || 2.25) * 0.97 },
    { month: 'Aug 25', monthFull: 'August 2025', value: kpi.sparkline?.[3] || 2.30, target: kpi.targetValue, priorYear: (kpi.sparkline?.[3] || 2.30) * 0.97 },
    { month: 'Sep 25', monthFull: 'September 2025', value: kpi.sparkline?.[4] || 2.38, target: kpi.targetValue, priorYear: (kpi.sparkline?.[4] || 2.38) * 0.98 },
    { month: 'Oct 25', monthFull: 'October 2025', value: kpi.sparkline?.[5] || 2.45, target: kpi.targetValue, priorYear: (kpi.sparkline?.[5] || 2.45) * 0.98 }
  ];

  // 12-Month summary stats
  const historyVals = historyData.map((d) => d.value);
  const peakVal = Math.max(...historyVals);
  const peakIndex = historyVals.indexOf(peakVal);
  const peakMonth = historyData[peakIndex]?.month || '';

  const troughVal = Math.min(...historyVals);
  const troughIndex = historyVals.indexOf(troughVal);
  const troughMonth = historyData[troughIndex]?.month || '';

  const avgVal = historyVals.reduce((a, b) => a + b, 0) / (historyVals.length || 1);
  const net12MChange = historyVals.length >= 2
    ? (((historyVals[historyVals.length - 1] - historyVals[0]) / historyVals[0]) * 100).toFixed(1)
    : '+0.0';

  // Format value helper for tooltips & badges
  const formatValWithUnit = (v?: number) => {
    if (v === undefined) return '—';
    if (kpi.unit === 'B') return `${kpi.prefix || '£'}${v.toFixed(2)}B`;
    if (kpi.unit === '%') return `${v.toFixed(1)}%`;
    return `${v.toFixed(1)}${kpi.unit || ''}`;
  };

  // Variance Bar width calculations (scale between -15% and +15% from center)
  const clampedVariance = Math.max(-15, Math.min(15, activeTrendValue));
  const varianceBarWidth = (Math.abs(clampedVariance) / 15) * 50;

  return (
    <>
      <div
        onClick={onClick}
        className={`rounded-xl p-3.5 transition-all flex flex-col justify-between relative group cursor-default ${
          isFlagged
            ? 'bg-gradient-to-b from-red-50/40 via-white to-white border-2 border-[#EF4444] shadow-xs shadow-red-500/10 ring-2 ring-red-500/20'
            : isExpanded
            ? 'bg-white border-2 border-[#008FCB]/60 shadow-md ring-2 ring-[#008FCB]/10'
            : 'bg-white border border-[#DCE8F0] shadow-xs hover:shadow-sm'
        }`}
      >
        {/* Top Header Row: Title & Category/Alert Icon */}
        <div className="flex items-center justify-between gap-1.5">
          <span
            className={`text-[12.5px] font-semibold tracking-tight truncate ${
              isFlagged ? 'text-[#B91C1C]' : 'text-[#536B8B]'
            }`}
            title={kpi.title}
          >
            {kpi.title}
          </span>

          {/* Right Header: Alert Icon or Standard Category Icon */}
          <div className="flex items-center gap-1 shrink-0">
            {isFlagged ? (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#FEF2F2] border border-[#F87171] text-[#DC2626] text-[10px] font-bold tracking-tight shadow-2xs animate-pulse"
                title={deviation.alertReason}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                <span className="hidden sm:inline">&gt;5% Alert</span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#EBF6FC] flex items-center justify-center shrink-0">
                {getIcon()}
              </div>
            )}
          </div>
        </div>

        {/* Middle Value + Recharts Sparkline Area */}
        <div className="flex items-baseline justify-between gap-2 my-2">
          <div className="flex flex-col">
            <span
              className={`text-2xl font-bold tracking-tight ${
                isFlagged ? 'text-[#DC2626]' : 'text-[#071B3A]'
              }`}
            >
              {kpi.value}
            </span>
          </div>

          {/* 6-Month Recharts Sparkline */}
          {sparkData.length > 0 && (
            <div className="w-20 h-9 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData} margin={{ top: 2, right: 1, left: 1, bottom: 2 }}>
                  <defs>
                    <linearGradient id={`spark-grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={sparkColor} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={sparkColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const dataPoint = payload[0].payload;
                        return (
                          <div className="bg-[#071F3D] text-white text-[10px] px-2 py-1 rounded shadow-lg border border-[#1A3D63] pointer-events-none z-50">
                            <span className="text-[#8C9EB5] mr-1.5">{dataPoint.month}:</span>
                            <strong className="text-white">
                              {formatValWithUnit(dataPoint.val)}
                            </strong>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke={sparkColor}
                    strokeWidth={2}
                    fill={`url(#spark-grad-${kpi.id})`}
                    dot={false}
                    activeDot={{ r: 3, fill: sparkColor, stroke: '#FFFFFF', strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Trend & Active Comparison Label */}
        <div className="flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5 font-semibold">
            {isFlagged ? (
              <span className="text-[#DC2626] flex items-center gap-0.5">
                <span className="text-[10px]">▼</span> {deviation.formattedDeviation}
              </span>
            ) : activeIsPositive ? (
              <span className="text-[#12A66A] flex items-center gap-0.5">
                <span className="text-[10px]">▲</span> {activeTrend}
              </span>
            ) : (
              <span className="text-[#F59E0B] flex items-center gap-0.5">
                <span className="text-[10px]">▼</span> {activeTrend}
              </span>
            )}
            <span className="text-[#7A92A9] font-normal text-[11px]">
              {isFlagged ? 'vs. target' : activeComparisonLabel}
            </span>
          </div>

          {isFlagged ? (
            <span
              className="text-[9.5px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
              title={`Variance of ${deviation.formattedDeviation} exceeds 5% threshold`}
            >
              {deviation.formattedDeviation} off target
            </span>
          ) : kpi.sparklineLabel ? (
            <span
              className={`text-[9.5px] font-semibold px-1.5 py-0.5 rounded shrink-0 ${
                kpi.isPositive
                  ? 'bg-[#EBF8F2] text-[#12A66A] border border-[#C6EFDE]'
                  : 'bg-[#FEF6E7] text-[#D97706] border border-[#FDE6B0]'
              }`}
              title="6-Month Performance Trajectory"
            >
              6M {kpi.sparklineLabel}
            </span>
          ) : null}
        </div>

        {/* Variance Bar (Visual Variance Indicator against comparison baseline) */}
        <div className="mt-2.5 pt-2 border-t border-[#EEF2F6]">
          <div className="flex items-center justify-between text-[10px] text-[#536B8B] mb-1">
            <span className="font-medium text-[#7A92A9]">
              {compareWith === 'YoY' ? 'YoY Variance' : compareWith === 'QoQ' ? 'QoQ Variance' : 'Target Variance'}
            </span>
            <span
              className={`font-bold tabular-nums ${
                isFlagged
                  ? 'text-[#DC2626]'
                  : activeIsPositive
                  ? 'text-[#12A66A]'
                  : 'text-[#D97706]'
              }`}
            >
              {activeTrendValue >= 0 ? `+${activeTrendValue}%` : `${activeTrendValue}%`}
            </span>
          </div>

          {/* Two-sided center baseline variance bar */}
          <div className="w-full h-1.5 bg-[#E8F1F5] rounded-full relative overflow-hidden flex items-center">
            {/* Center 0% baseline tick */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#94A3B8] z-10" />

            {/* Negative bar extending left from center */}
            {activeTrendValue < 0 && (
              <div
                className={`h-full absolute right-1/2 transition-all duration-300 rounded-l-full ${
                  isFlagged ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                }`}
                style={{ width: `${varianceBarWidth}%` }}
              />
            )}

            {/* Positive bar extending right from center */}
            {activeTrendValue >= 0 && (
              <div
                className="h-full absolute left-1/2 transition-all duration-300 rounded-r-full bg-[#12A66A]"
                style={{ width: `${varianceBarWidth}%` }}
              />
            )}
          </div>
        </div>

        {/* Expand/Collapse Toggle Button for 12-Month Historical Line Chart */}
        <div className="mt-2.5">
          <button
            type="button"
            onClick={handleToggleExpand}
            className={`w-full py-1 px-2 rounded-md text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
              isExpanded
                ? 'bg-[#071F3D] text-white shadow-2xs'
                : 'bg-[#F4F8FA] hover:bg-[#EBF3F8] text-[#008FCB] border border-[#DCE8F0]'
            }`}
          >
            <span>{isExpanded ? 'Hide 12M History' : '12M Historical Trend'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expandable Detail Section: 12-Month Historical Line Chart using Recharts */}
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 pt-3 border-t-2 border-[#008FCB]/30 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {/* Expanded Header Controls */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#071B3A]">
                <TrendingUp className="w-3.5 h-3.5 text-[#008FCB]" />
                <span>12M Trajectory</span>
              </div>

              {/* View Switches & Modal Trigger */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-[#F1F5F9] rounded p-0.5 border border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => setChartViewType('line')}
                    title="Line Chart View"
                    className={`p-0.5 rounded cursor-pointer transition-colors ${
                      chartViewType === 'line'
                        ? 'bg-white text-[#008FCB] shadow-2xs'
                        : 'text-[#64748B] hover:text-[#071B3A]'
                    }`}
                  >
                    <LineChartIcon className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewType('bar')}
                    title="Bar Chart View"
                    className={`p-0.5 rounded cursor-pointer transition-colors ${
                      chartViewType === 'bar'
                        ? 'bg-white text-[#008FCB] shadow-2xs'
                        : 'text-[#64748B] hover:text-[#071B3A]'
                    }`}
                  >
                    <BarChart2 className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  title="Expand Full Detail Modal"
                  className="p-1 rounded text-[#536B8B] hover:text-[#008FCB] hover:bg-[#EBF6FC] cursor-pointer transition-colors"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Legend Indicators */}
            <div className="flex items-center justify-between text-[9px] text-[#64748B] mb-1.5 px-0.5">
              <span className="flex items-center gap-1 font-semibold text-[#008FCB]">
                <span className="w-2 h-1 rounded-sm bg-[#008FCB]" /> Actual
              </span>
              <span className="flex items-center gap-1 text-[#94A3B8]">
                <span className="w-2 h-0.5 bg-[#94A3B8]" /> Target
              </span>
              <span className="flex items-center gap-1 text-[#CBD5E1]">
                <span className="w-2 h-0.5 bg-[#CBD5E1]" /> PY
              </span>
            </div>

            {/* 12-Month Historical Recharts Line or Bar Chart */}
            <div className="w-full h-36 relative select-none">
              <ResponsiveContainer width="100%" height="100%">
                {chartViewType === 'line' ? (
                  <LineChart
                    data={historyData}
                    margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id={`history-line-grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isFlagged ? '#EF4444' : '#008FCB'} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={isFlagged ? '#EF4444' : '#008FCB'} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 8.5, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#E2E8F0' }}
                    />
                    <YAxis
                      tick={{ fontSize: 8.5, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0].payload;
                          const varToTarget = dataPoint.target
                            ? (((dataPoint.value - dataPoint.target) / dataPoint.target) * 100).toFixed(1)
                            : null;
                          return (
                            <div className="bg-[#071F3D] text-white text-[10.5px] p-2 rounded-lg shadow-xl border border-[#1A3D63] pointer-events-none z-50">
                              <div className="font-bold border-b border-[#1A3D63] pb-1 mb-1 text-white">
                                {dataPoint.monthFull || dataPoint.month}
                              </div>
                              <div className="space-y-0.5 text-[10px]">
                                <div className="flex justify-between gap-3">
                                  <span className="text-[#00D2FF]">Actual:</span>
                                  <strong className="text-white">{formatValWithUnit(dataPoint.value)}</strong>
                                </div>
                                {dataPoint.target !== undefined && (
                                  <div className="flex justify-between gap-3">
                                    <span className="text-[#A0B4C8]">Target:</span>
                                    <span className="text-white">{formatValWithUnit(dataPoint.target)}</span>
                                  </div>
                                )}
                                {varToTarget && (
                                  <div className="flex justify-between gap-3">
                                    <span className="text-[#A0B4C8]">vs. Target:</span>
                                    <span className={+varToTarget >= 0 ? 'text-[#12A66A]' : 'text-[#EF4444]'}>
                                      {+varToTarget >= 0 ? `+${varToTarget}%` : `${varToTarget}%`}
                                    </span>
                                  </div>
                                )}
                                {dataPoint.priorYear !== undefined && (
                                  <div className="flex justify-between gap-3">
                                    <span className="text-[#CBD5E1]">Prior Year:</span>
                                    <span className="text-white">{formatValWithUnit(dataPoint.priorYear)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {kpi.targetValue !== undefined && (
                      <ReferenceLine
                        y={kpi.targetValue}
                        stroke="#94A3B8"
                        strokeDasharray="3 3"
                        strokeWidth={1}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="priorYear"
                      stroke="#CBD5E1"
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={isFlagged ? '#EF4444' : '#008FCB'}
                      strokeWidth={2.2}
                      dot={{ r: 2, fill: isFlagged ? '#EF4444' : '#008FCB' }}
                      activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart
                    data={historyData}
                    margin={{ top: 8, right: 6, left: -22, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 8.5, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={{ stroke: '#E2E8F0' }}
                    />
                    <YAxis
                      tick={{ fontSize: 8.5, fill: '#64748B' }}
                      tickLine={false}
                      axisLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0].payload;
                          return (
                            <div className="bg-[#071F3D] text-white text-[10px] p-2 rounded shadow-xl border border-[#1A3D63] pointer-events-none z-50">
                              <span className="font-bold text-white block mb-0.5">{dataPoint.monthFull || dataPoint.month}</span>
                              <div className="text-[#00D2FF]">Actual: {formatValWithUnit(dataPoint.value)}</div>
                              {dataPoint.target && <div className="text-[#A0B4C8]">Target: {formatValWithUnit(dataPoint.target)}</div>}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={isFlagged ? '#EF4444' : '#008FCB'}
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* 12-Month Key Stats Summary Pill Bar */}
            <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-[#EEF2F6] text-center text-[10px]">
              <div className="p-1 bg-[#F8FAFC] rounded border border-[#EEF2F6]" title={`Peak month: ${peakMonth}`}>
                <span className="text-[#7A92A9] block text-[8.5px]">12M Peak</span>
                <strong className="text-[#071B3A] text-[9.5px] truncate block">{formatValWithUnit(peakVal)}</strong>
              </div>
              <div className="p-1 bg-[#F8FAFC] rounded border border-[#EEF2F6]" title={`Trough month: ${troughMonth}`}>
                <span className="text-[#7A92A9] block text-[8.5px]">12M Trough</span>
                <strong className="text-[#071B3A] text-[9.5px] truncate block">{formatValWithUnit(troughVal)}</strong>
              </div>
              <div className="p-1 bg-[#F8FAFC] rounded border border-[#EEF2F6]">
                <span className="text-[#7A92A9] block text-[8.5px]">12M Avg</span>
                <strong className="text-[#071B3A] text-[9.5px] truncate block">{formatValWithUnit(avgVal)}</strong>
              </div>
              <div className="p-1 bg-[#F8FAFC] rounded border border-[#EEF2F6]">
                <span className="text-[#7A92A9] block text-[8.5px]">Trajectory</span>
                <strong className={`text-[9.5px] truncate block ${+net12MChange >= 0 ? 'text-[#12A66A]' : 'text-[#EF4444]'}`}>
                  {+net12MChange >= 0 ? `+${net12MChange}%` : `${net12MChange}%`}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Hover Info Tooltip with Detailed Target & Deviation Metrics */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="relative group/tip">
            <HelpCircle className="w-3.5 h-3.5 text-[#A0B4C8] hover:text-[#008FCB] cursor-help" />
            <div className="absolute bottom-full right-0 mb-1.5 hidden group-hover/tip:block w-56 p-2.5 bg-[#071F3D] text-white text-[11px] rounded-lg shadow-xl z-30 pointer-events-none border border-[#1A3D63]">
              <p className="font-medium text-white mb-1.5 leading-snug">{kpi.tooltip}</p>
              <div className="border-t border-[#1A3D63] pt-1.5 space-y-1 text-[10px] text-[#A0B4C8]">
                <div className="flex justify-between">
                  <span>Target Benchmark:</span>
                  <span className="text-white font-semibold">{deviation.formattedTarget}</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Variance:</span>
                  <span
                    className={`font-bold ${
                      isFlagged ? 'text-[#F87171]' : deviation.deviationPercent >= 0 ? 'text-[#22C55E]' : 'text-[#F59E0B]'
                    }`}
                  >
                    {deviation.formattedDeviation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tolerance Limit:</span>
                  <span className="text-white">±{deviation.thresholdPercent}%</span>
                </div>
                {isFlagged && (
                  <div className="mt-1 pt-1 border-t border-red-900/50 text-[#FCA5A5] font-medium text-[9.5px]">
                    ⚠️ Flagged: Deviates &gt;{deviation.thresholdPercent}% from target
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Detailed Modal for the KPI Metric (when clicking Maximize icon) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#071B3A]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#DCE8F0] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EEF2F6] flex items-center justify-between bg-gradient-to-r from-[#071B3A] to-[#0A254A] text-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  {getIcon()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{kpi.title}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#008FCB]/30 text-[#56CCF2] border border-[#008FCB]/40 font-mono">
                      12-Month Deep Dive
                    </span>
                  </h3>
                  <p className="text-xs text-[#94A3B8]">{kpi.tooltip}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Top Highlights Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block mb-1">Current YTD</span>
                  <div className="text-xl font-bold text-[#071B3A]">{kpi.value}</div>
                  <span className="text-[11px] text-[#12A66A] font-semibold">{activeTrend} {activeComparisonLabel}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block mb-1">Target Benchmark</span>
                  <div className="text-xl font-bold text-[#071B3A]">{deviation.formattedTarget}</div>
                  <span className={`text-[11px] font-semibold ${isFlagged ? 'text-[#EF4444]' : 'text-[#008FCB]'}`}>
                    {deviation.formattedDeviation} {isFlagged ? '(Flagged)' : '(In tolerance)'}
                  </span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block mb-1">12-Month Range</span>
                  <div className="text-xl font-bold text-[#071B3A]">
                    {formatValWithUnit(troughVal)} – {formatValWithUnit(peakVal)}
                  </div>
                  <span className="text-[11px] text-[#64748B]">Low in {troughMonth}, Peak in {peakMonth}</span>
                </div>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                  <span className="text-xs text-[#64748B] block mb-1">12M Net Trajectory</span>
                  <div className={`text-xl font-bold ${+net12MChange >= 0 ? 'text-[#12A66A]' : 'text-[#EF4444]'}`}>
                    {+net12MChange >= 0 ? `+${net12MChange}%` : `${net12MChange}%`}
                  </div>
                  <span className="text-[11px] text-[#64748B]">Nov 2024 to Oct 2025</span>
                </div>
              </div>

              {/* High-Resolution 12-Month Recharts Line Chart */}
              <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#536B8B] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#008FCB]" />
                    <span>Monthly Historical Trajectory vs. Target Benchmark &amp; Prior Year</span>
                  </h4>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-[#008FCB]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#008FCB]" /> Actual
                    </span>
                    <span className="flex items-center gap-1.5 text-[#64748B]">
                      <span className="w-3 h-0.5 bg-[#94A3B8]" /> Target
                    </span>
                    <span className="flex items-center gap-1.5 text-[#94A3B8]">
                      <span className="w-3 h-0.5 bg-[#CBD5E1]" /> Prior Year
                    </span>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historyData} margin={{ top: 12, right: 16, left: -10, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis dataKey="monthFull" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-[#071F3D] text-white text-xs p-3 rounded-xl shadow-xl border border-[#1A3D63]">
                                <div className="font-bold border-b border-[#1A3D63] pb-1.5 mb-2 text-white">
                                  {d.monthFull}
                                </div>
                                <div className="space-y-1 text-[11px]">
                                  <div className="flex justify-between gap-4">
                                    <span className="text-[#00D2FF]">Actual:</span>
                                    <strong className="text-white">{formatValWithUnit(d.value)}</strong>
                                  </div>
                                  {d.target && (
                                    <div className="flex justify-between gap-4">
                                      <span className="text-[#A0B4C8]">Target:</span>
                                      <span className="text-white">{formatValWithUnit(d.target)}</span>
                                    </div>
                                  )}
                                  {d.priorYear && (
                                    <div className="flex justify-between gap-4">
                                      <span className="text-[#CBD5E1]">Prior Year:</span>
                                      <span className="text-white">{formatValWithUnit(d.priorYear)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {kpi.targetValue !== undefined && (
                        <ReferenceLine y={kpi.targetValue} stroke="#94A3B8" strokeDasharray="3 3" />
                      )}
                      <Line type="monotone" dataKey="priorYear" name="Prior Year" stroke="#CBD5E1" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="value" name="Actual" stroke={isFlagged ? '#EF4444' : '#008FCB'} strokeWidth={3} dot={{ r: 4, fill: '#008FCB' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 12-Month Data Breakdown Table */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#071B3A] uppercase tracking-wider">
                    Monthly Performance Log
                  </span>
                  <span className="text-[11px] text-[#64748B]">12 Observed Periods</span>
                </div>
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F1F5F9] text-[#64748B] sticky top-0">
                      <tr>
                        <th className="py-2 px-3 font-semibold">Month</th>
                        <th className="py-2 px-3 font-semibold text-right">Actual</th>
                        <th className="py-2 px-3 font-semibold text-right">Target</th>
                        <th className="py-2 px-3 font-semibold text-right">Variance</th>
                        <th className="py-2 px-3 font-semibold text-right">Prior Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {historyData.map((row, idx) => {
                        const rowVar = row.target ? (((row.value - row.target) / row.target) * 100).toFixed(1) : null;
                        return (
                          <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                            <td className="py-1.5 px-3 font-medium text-[#071B3A]">{row.monthFull}</td>
                            <td className="py-1.5 px-3 text-right font-bold text-[#008FCB]">{formatValWithUnit(row.value)}</td>
                            <td className="py-1.5 px-3 text-right text-[#64748B]">{formatValWithUnit(row.target)}</td>
                            <td className={`py-1.5 px-3 text-right font-semibold ${rowVar && +rowVar >= 0 ? 'text-[#12A66A]' : 'text-[#EF4444]'}`}>
                              {rowVar ? (+rowVar >= 0 ? `+${rowVar}%` : `${rowVar}%`) : '—'}
                            </td>
                            <td className="py-1.5 px-3 text-right text-[#64748B]">{formatValWithUnit(row.priorYear)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#EEF2F6] bg-[#F8FAFC] flex justify-end rounded-b-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-[#071B3A] hover:bg-[#0A254A] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
