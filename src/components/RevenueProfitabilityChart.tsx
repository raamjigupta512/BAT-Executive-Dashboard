import React, { useState, useMemo } from 'react';
import { ChevronDown, Info, Calendar, TrendingUp } from 'lucide-react';
import { MonthlyOutlookItem, Currency } from '../types/dashboard';
import { CURRENCY_RATES } from '../utils/formatters';

interface RevenueProfitabilityChartProps {
  data: MonthlyOutlookItem[];
  currency: Currency;
  selectedPeriod: string;
  onPeriodChange?: (period: string) => void;
}

export interface TransformedSeasonalPoint {
  month: string;
  monthFullName: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  revenue: number;
  newCategoriesRevenue: number;
  operatingProfit: number;
  operatingMarginPercent: number;
  seasonalityIndex: number; // 100 = annual monthly mean
  pySeasonalityIndex: number; // 3-year baseline benchmark
  deviationPercent: number; // % variance from annual monthly mean
  annualSharePercent: number; // % contribution to total annual revenue
  driverNarrative: string; // narrative explanation of seasonal driver
  isForecast?: boolean;
}

export const RevenueProfitabilityChart: React.FC<RevenueProfitabilityChartProps> = ({
  data,
  currency,
  selectedPeriod,
  onPeriodChange
}) => {
  // View Toggle State: Standard 'monthly' trends vs 'seasonality' patterns
  const [viewType, setViewType] = useState<'monthly' | 'seasonality'>('monthly');
  const [viewMode, setViewMode] = useState<string>('Next 12 Months');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState<boolean>(false);

  // Smooth CSS-based view switch handler with staged fade-out and fade-in
  const handleSwitchView = (newView: 'monthly' | 'seasonality') => {
    if (newView === viewType || isFading) return;
    setIsFading(true);
    setTimeout(() => {
      setViewType(newView);
      setTimeout(() => {
        setIsFading(false);
      }, 30);
    }, 150);
  };

  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  // Chart dimensions & scaling
  const width = 760;
  const height = 310;
  const margin = { top: 35, right: 65, bottom: 42, left: 45 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // =========================================================================
  // CHART DATA TRANSFORMATION LOGIC
  // Dynamically transforms raw MonthlyOutlookItem[] into normalized monthly
  // and seasonality metrics (indices, deviations, quarterly aggregates & drivers)
  // =========================================================================
  const { transformedData, quarterlySummary, annualTotalRevenue, meanMonthlyRevenue } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        transformedData: [] as TransformedSeasonalPoint[],
        quarterlySummary: { Q1: '0%', Q2: '0%', Q3: '0%', Q4: '0%' },
        annualTotalRevenue: 0,
        meanMonthlyRevenue: 0
      };
    }

    // 1. Calculate annual consolidated totals and baseline monthly mean
    const totalRev = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const meanRev = totalRev / data.length;

    // 2. Historical 3-year seasonal weight coefficients (calibrated multinational tobacco model)
    const HISTORICAL_WEIGHTS = [0.77, 0.81, 0.89, 0.96, 1.00, 1.03, 1.06, 1.09, 1.13, 1.22, 1.41, 1.72];

    // 3. Operational phase narratives for seasonal drivers
    const SEASONAL_DRIVERS: Record<string, string> = {
      Jan: 'Post-holiday wholesale destocking & winter volume trough',
      Feb: 'Seasonal consumer demand moderation across Northern markets',
      Mar: 'Spring pricing corridor rollout & distributor contract resets',
      Apr: 'Wholesale channel restocking & spring trade replenishment',
      May: 'Outdoor social occasion expansion & New Categories campaigns',
      Jun: 'Pre-summer channel loading & Modern Oral volume ramp',
      Jul: 'European travel retail & holiday consumption surge',
      Aug: 'Peak summer festival volume & Vuse cartridge demand acceleration',
      Sep: 'Autumn commercial build-up & back-to-work retail activation',
      Oct: 'Early wholesale pre-buying ahead of fiscal excise duty hikes',
      Nov: 'Distributor tax indexation inventory accumulation wave',
      Dec: 'Year-end holiday trade execution & peak pre-buy realization'
    };

    // 4. Map and transform each month point
    const points: TransformedSeasonalPoint[] = data.map((d, i) => {
      const q: 'Q1' | 'Q2' | 'Q3' | 'Q4' =
        i < 3 ? 'Q1' : i < 6 ? 'Q2' : i < 9 ? 'Q3' : 'Q4';

      // Computed dynamic seasonality index: 100 = average monthly revenue
      const sIndex = meanRev > 0 ? Number(((d.revenue / meanRev) * 100).toFixed(1)) : 100;
      const pyIndex = Number((HISTORICAL_WEIGHTS[i] * 100).toFixed(1));
      const deviation = meanRev > 0 ? Number((((d.revenue - meanRev) / meanRev) * 100).toFixed(1)) : 0;
      const share = totalRev > 0 ? Number(((d.revenue / totalRev) * 100).toFixed(1)) : 0;
      const margin = d.revenue > 0 ? Number(((d.operatingProfit / d.revenue) * 100).toFixed(1)) : 0;

      return {
        month: d.month,
        monthFullName: d.monthFullName,
        quarter: q,
        revenue: d.revenue,
        newCategoriesRevenue: d.newCategoriesRevenue,
        operatingProfit: d.operatingProfit,
        operatingMarginPercent: margin,
        seasonalityIndex: sIndex,
        pySeasonalityIndex: pyIndex,
        deviationPercent: deviation,
        annualSharePercent: share,
        driverNarrative: SEASONAL_DRIVERS[d.month] || 'Standard operating commercial rhythm',
        isForecast: d.isForecast
      };
    });

    // 5. Compute dynamic quarterly share distribution
    const qSums = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
    points.forEach((p) => {
      qSums[p.quarter] += p.revenue;
    });

    const qSummary = {
      Q1: `${((qSums.Q1 / (totalRev || 1)) * 100).toFixed(1)}%`,
      Q2: `${((qSums.Q2 / (totalRev || 1)) * 100).toFixed(1)}%`,
      Q3: `${((qSums.Q3 / (totalRev || 1)) * 100).toFixed(1)}%`,
      Q4: `${((qSums.Q4 / (totalRev || 1)) * 100).toFixed(1)}%`
    };

    return {
      transformedData: points,
      quarterlySummary: qSummary,
      annualTotalRevenue: totalRev,
      meanMonthlyRevenue: meanRev
    };
  }, [data]);

  // Max values for Monthly axes
  const maxRevenue = 5.0;
  const maxProfit = 2.5;

  const revenueY = (val: number) => {
    const clamped = Math.min(val, maxRevenue);
    return innerHeight - (clamped / maxRevenue) * innerHeight;
  };

  const profitY = (val: number) => {
    const clamped = Math.min(val, maxProfit);
    return innerHeight - (clamped / maxProfit) * innerHeight;
  };

  // Scaling for Seasonality Index view: Range 50 to 200
  const minSeasonIndex = 50;
  const maxSeasonIndex = 200;
  const seasonY = (val: number) => {
    const clamped = Math.max(minSeasonIndex, Math.min(val, maxSeasonIndex));
    return innerHeight - ((clamped - minSeasonIndex) / (maxSeasonIndex - minSeasonIndex)) * innerHeight;
  };

  const stepX = innerWidth / (transformedData.length || 12);
  const barWidth = 14;
  const barGap = 3;

  // Monthly operating profit line path
  const monthlyProfitLinePoints = transformedData.map((d, i) => {
    const x = i * stepX + stepX / 2;
    const y = profitY(d.operatingProfit);
    return { x, y, data: d };
  });

  const monthlyProfitLinePath = monthlyProfitLinePoints.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  // Seasonality paths (FY2025 seasonal curve & 3-year baseline)
  const seasonCurvePoints = transformedData.map((d, i) => {
    const x = i * stepX + stepX / 2;
    const y = seasonY(d.seasonalityIndex);
    return { x, y, data: d };
  });

  const seasonCurvePath = seasonCurvePoints.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ''
  );

  const pySeasonCurvePath = transformedData
    .map((d, i) => {
      const x = i * stepX + stepX / 2;
      const y = seasonY(d.pySeasonalityIndex);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs flex flex-col justify-between h-full">
      {/* Top Header: Title, Segmented Toggle & Period Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-[#071B3A]">
            Revenue &amp; Profitability Outlook
          </h3>

          {/* View Toggle: Monthly trends vs Seasonality patterns with animated indicator */}
          <div className="flex items-center bg-[#F1F6FA] border border-[#DCE8F0] p-0.5 rounded-lg text-xs font-semibold shadow-2xs relative">
            <button
              onClick={() => handleSwitchView('monthly')}
              className={`relative px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer z-10 ${
                viewType === 'monthly' ? 'text-white' : 'text-[#536B8B] hover:text-[#071B3A]'
              }`}
            >
              {viewType === 'monthly' && (
                <div
                  className="absolute inset-0 bg-[#008FCB] rounded-md shadow-xs -z-10 transition-all duration-200"
                />
              )}
              Monthly
            </button>
            <button
              onClick={() => handleSwitchView('seasonality')}
              className={`relative px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer flex items-center gap-1.5 z-10 ${
                viewType === 'seasonality' ? 'text-white' : 'text-[#536B8B] hover:text-[#071B3A]'
              }`}
            >
              {viewType === 'seasonality' && (
                <div
                  className="absolute inset-0 bg-[#008FCB] rounded-md shadow-xs -z-10 transition-all duration-200"
                />
              )}
              <span>Seasonality</span>
              <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${viewType === 'seasonality' ? 'bg-[#00D2FF]' : 'bg-[#008FCB]'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {viewType === 'monthly' ? (
            /* Period selector dropdown for Monthly view */
            <div className="relative">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="appearance-none bg-[#F4F8FA] hover:bg-[#EAF2F7] border border-[#DCE8F0] rounded-lg text-xs font-semibold text-[#071B3A] py-1.5 pl-3 pr-8 cursor-pointer focus:outline-hidden focus:border-[#008FCB]"
              >
                <option value="Next 12 Months">Next 12 Months</option>
                <option value="Actual vs Budget">Actual vs Budget</option>
                <option value="Actual vs Forecast">Actual vs Forecast</option>
                <option value="Quarterly Aggregate">Quarterly Aggregate</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#536B8B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#008FCB] bg-[#EBF6FC] px-2.5 py-1 rounded-md border border-[#CDE8F7]">
                Mean Normalized Index (Base = 100)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Smooth CSS-Based Fade Transition Container */}
      <div
        key={viewType}
        className={`w-full flex-1 flex flex-col justify-between chart-view-transition ${
          isFading ? 'opacity-0 translate-y-1.5' : 'opacity-100 translate-y-0 chart-fade-in'
        }`}
      >
        {/* Legend & Context Row */}
        {viewType === 'monthly' ? (
        <div className="flex items-center gap-6 text-xs text-[#536B8B] mb-2 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#008FCB]" />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#56CCF2]" />
            <span>New Categories Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <span className="w-3 h-[2px] bg-[#071F3D]" />
              <span className="w-2 h-2 rounded-full border-2 border-[#071F3D] bg-white -ml-0.5" />
              <span className="w-3 h-[2px] bg-[#071F3D] -ml-0.5" />
            </span>
            <span className="text-[#071B3A]">Operating Profit (Adj.)</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#536B8B] mb-2 font-medium">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#008FCB]" />
              <span className="text-[#071B3A] font-semibold">Seasonal Index Curve</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-[2px] bg-[#F59E0B] border-t border-dashed border-[#F59E0B]" />
              <span>3-Yr Historical Benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#E2EEF5] border border-[#008FCB] rounded-xs" />
              <span>Monthly Mean Variance</span>
            </div>
          </div>
          <div className="text-[11px] text-[#7A92A9]">
            Q1: <strong className="text-[#071B3A]">{quarterlySummary.Q1}</strong> &bull; Q2: <strong className="text-[#071B3A]">{quarterlySummary.Q2}</strong> &bull; Q3: <strong className="text-[#071B3A]">{quarterlySummary.Q3}</strong> &bull; Q4: <strong className="text-[#008FCB]">{quarterlySummary.Q4}</strong>
          </div>
        </div>
      )}

      {/* Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden flex-1 min-h-[250px]">
        {viewType === 'monthly' ? (
          /* ========================================================= */
          /* 1. STANDARD MONTHLY TREND VIEW                            */
          /* ========================================================= */
          <>
            {/* Y-axis top labels */}
            <div className="absolute top-0 left-2 text-[10.5px] font-medium text-[#7A92A9]">
              Revenue ({symbol} Billion)
            </div>
            <div className="absolute top-0 right-2 text-[10.5px] font-medium text-[#7A92A9] text-right">
              Operating Profit ({symbol} Billion)
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              preserveAspectRatio="none"
            >
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Horizontal Grid lines (5 intervals: 0, 1, 2, 3, 4, 5) */}
                {[0, 1, 2, 3, 4, 5].map((val) => {
                  const y = revenueY(val);
                  return (
                    <g key={`grid-${val}`}>
                      <line
                        x1={0}
                        y1={y}
                        x2={innerWidth}
                        y2={y}
                        stroke="#EAF0F6"
                        strokeWidth="1"
                      />
                      {/* Left Y-axis labels */}
                      <text
                        x={-10}
                        y={y + 3.5}
                        textAnchor="end"
                        fill="#7A92A9"
                        fontSize="11"
                        fontFamily="Inter, sans-serif"
                      >
                        {val}
                      </text>
                      {/* Right Y-axis labels */}
                      <text
                        x={innerWidth + 12}
                        y={y + 3.5}
                        textAnchor="start"
                        fill="#7A92A9"
                        fontSize="11"
                        fontFamily="Inter, sans-serif"
                      >
                        {(val * 0.5).toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Forecast boundary line indicator before Oct */}
                <line
                  x1={9 * stepX}
                  y1={0}
                  x2={9 * stepX}
                  y2={innerHeight}
                  stroke="#008FCB"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <text
                  x={9 * stepX + 6}
                  y={12}
                  fill="#008FCB"
                  fontSize="9.5"
                  fontWeight="600"
                  opacity="0.8"
                >
                  FORECAST →
                </text>

                {/* Bars for each month */}
                {transformedData.map((d, i) => {
                  const centerX = i * stepX + stepX / 2;
                  const revHeight = innerHeight - revenueY(d.revenue);
                  const newCatHeight = innerHeight - revenueY(d.newCategoriesRevenue);
                  const isHovered = hoveredIndex === i;

                  // Bar 1 (Revenue) & Bar 2 (New Categories)
                  const x1 = centerX - barWidth - barGap / 2;
                  const x2 = centerX + barGap / 2;

                  return (
                    <g
                      key={`month-bar-${d.month}`}
                      className="cursor-pointer transition-opacity"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Hover highlight column background */}
                      {isHovered && (
                        <rect
                          x={i * stepX + 2}
                          y={0}
                          width={stepX - 4}
                          height={innerHeight}
                          fill="#F0F8FD"
                          rx="4"
                          opacity="0.85"
                        />
                      )}

                      {/* Revenue Bar */}
                      <rect
                        x={x1}
                        y={revenueY(d.revenue)}
                        width={barWidth}
                        height={revHeight}
                        fill="#008FCB"
                        rx="1.5"
                        className="transition-all hover:brightness-110"
                      />

                      {/* New Categories Bar */}
                      <rect
                        x={x2}
                        y={revenueY(d.newCategoriesRevenue)}
                        width={barWidth}
                        height={newCatHeight}
                        fill="#56CCF2"
                        rx="1.5"
                        className="transition-all hover:brightness-110"
                      />

                      {/* X-axis Month Label */}
                      <text
                        x={centerX}
                        y={innerHeight + 22}
                        textAnchor="middle"
                        fill={isHovered ? '#008FCB' : '#536B8B'}
                        fontWeight={isHovered ? '700' : '500'}
                        fontSize="11.5"
                        fontFamily="Inter, sans-serif"
                      >
                        {d.month}
                      </text>
                    </g>
                  );
                })}

                {/* Operating Profit Line */}
                <path
                  d={monthlyProfitLinePath}
                  fill="none"
                  stroke="#071F3D"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Operating Profit Data Dots */}
                {monthlyProfitLinePoints.map((pt, i) => {
                  const isHovered = hoveredIndex === i;
                  return (
                    <g
                      key={`pt-${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : 4}
                        fill="#071F3D"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-all"
                      />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={9}
                          fill="none"
                          stroke="#008FCB"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Dynamic Monthly Tooltip on Hover */}
            {hoveredIndex !== null && transformedData[hoveredIndex] && (
              <div
                className="absolute z-30 bg-[#071F3D] text-white p-3 rounded-xl shadow-xl pointer-events-none transition-all text-xs border border-[#1A3D63]"
                style={{
                  left: `${Math.min(Math.max(hoveredIndex * (100 / 12) + 2, 8), 75)}%`,
                  top: '15%'
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#1E4875] pb-1.5 mb-2">
                  <span className="font-bold text-sm text-white">
                    {transformedData[hoveredIndex].monthFullName} 2025
                  </span>
                  {transformedData[hoveredIndex].isForecast ? (
                    <span className="bg-[#008FCB] text-[9.5px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider">
                      FORECAST
                    </span>
                  ) : (
                    <span className="bg-[#12A66A] text-[9.5px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider">
                      ACTUAL
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#008FCB]" /> Revenue:
                    </span>
                    <span className="font-semibold">
                      {symbol}{(transformedData[hoveredIndex].revenue * rate).toFixed(2)}B
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#56CCF2]" /> New Categories:
                    </span>
                    <span className="font-semibold">
                      {symbol}{(transformedData[hoveredIndex].newCategoriesRevenue * rate).toFixed(2)}B
                      <span className="text-[10px] text-[#56CCF2] ml-1">
                        ({((transformedData[hoveredIndex].newCategoriesRevenue / transformedData[hoveredIndex].revenue) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-1 border-t border-[#1E4875]/60">
                    <span className="text-[#A2B7CC] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FFFFFF]" /> Operating Profit:
                    </span>
                    <span className="font-semibold text-[#00D2FF]">
                      {symbol}{(transformedData[hoveredIndex].operatingProfit * rate).toFixed(2)}B
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-[10.5px]">
                    <span className="text-[#89A1BA]">Operating Margin:</span>
                    <span className="font-bold text-[#12A66A]">
                      {transformedData[hoveredIndex].operatingMarginPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* ========================================================= */
          /* 2. DYNAMIC SEASONALITY PATTERN VIEW                       */
          /* ========================================================= */
          <>
            {/* Y-axis top labels */}
            <div className="absolute top-0 left-2 text-[10.5px] font-medium text-[#7A92A9]">
              Seasonal Index (Mean = 100)
            </div>
            <div className="absolute top-0 right-2 text-[10.5px] font-medium text-[#7A92A9] text-right">
              Variance vs. Mean (%)
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-full select-none"
              preserveAspectRatio="none"
            >
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                {/* Horizontal Grid lines for Seasonality Index (60, 80, 100, 120, 140, 160, 180, 200) */}
                {[60, 80, 100, 120, 140, 160, 180, 200].map((idxVal) => {
                  const y = seasonY(idxVal);
                  const isBaseMean = idxVal === 100;
                  return (
                    <g key={`season-grid-${idxVal}`}>
                      <line
                        x1={0}
                        y1={y}
                        x2={innerWidth}
                        y2={y}
                        stroke={isBaseMean ? '#008FCB' : '#EAF0F6'}
                        strokeWidth={isBaseMean ? '1.5' : '1'}
                        strokeDasharray={isBaseMean ? '4 3' : undefined}
                        opacity={isBaseMean ? 0.8 : 1}
                      />
                      {/* Left Y-axis label */}
                      <text
                        x={-10}
                        y={y + 3.5}
                        textAnchor="end"
                        fill={isBaseMean ? '#008FCB' : '#7A92A9'}
                        fontWeight={isBaseMean ? '700' : '400'}
                        fontSize="11"
                        fontFamily="Inter, sans-serif"
                      >
                        {idxVal}
                      </text>
                      {/* Right Y-axis label: % Variance */}
                      <text
                        x={innerWidth + 12}
                        y={y + 3.5}
                        textAnchor="start"
                        fill={isBaseMean ? '#008FCB' : '#7A92A9'}
                        fontWeight={isBaseMean ? '700' : '400'}
                        fontSize="11"
                        fontFamily="Inter, sans-serif"
                      >
                        {idxVal >= 100 ? `+${idxVal - 100}%` : `${idxVal - 100}%`}
                      </text>
                    </g>
                  );
                })}

                {/* Baseline 100 Badge */}
                <rect
                  x={innerWidth - 75}
                  y={seasonY(100) - 18}
                  width="72"
                  height="16"
                  fill="#EBF6FC"
                  rx="3"
                />
                <text
                  x={innerWidth - 39}
                  y={seasonY(100) - 6}
                  textAnchor="middle"
                  fill="#008FCB"
                  fontSize="9.5"
                  fontWeight="700"
                >
                  MEAN = 100
                </text>

                {/* Seasonality Deviation Columns */}
                {transformedData.map((s, i) => {
                  const centerX = i * stepX + stepX / 2;
                  const isHovered = hoveredIndex === i;
                  const baseY = seasonY(100);
                  const currentY = seasonY(s.seasonalityIndex);
                  const colHeight = Math.abs(currentY - baseY);
                  const colY = s.seasonalityIndex >= 100 ? currentY : baseY;

                  return (
                    <g
                      key={`season-col-${s.month}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Column background hover highlight */}
                      {isHovered && (
                        <rect
                          x={i * stepX + 2}
                          y={0}
                          width={stepX - 4}
                          height={innerHeight}
                          fill="#F0F8FD"
                          rx="4"
                          opacity="0.85"
                        />
                      )}

                      {/* Deviation Bar from Mean (Base = 100) */}
                      <rect
                        x={centerX - 10}
                        y={colY}
                        width={20}
                        height={Math.max(colHeight, 2)}
                        fill={s.seasonalityIndex >= 100 ? '#008FCB' : '#A8D4EE'}
                        opacity={isHovered ? 0.95 : 0.65}
                        rx="2"
                        className="transition-all"
                      />

                      {/* X-axis Month Label */}
                      <text
                        x={centerX}
                        y={innerHeight + 20}
                        textAnchor="middle"
                        fill={isHovered ? '#008FCB' : '#536B8B'}
                        fontWeight={isHovered ? '700' : '500'}
                        fontSize="11.5"
                        fontFamily="Inter, sans-serif"
                      >
                        {s.month}
                      </text>

                      {/* Quarter pill under month */}
                      <text
                        x={centerX}
                        y={innerHeight + 33}
                        textAnchor="middle"
                        fill="#8C9EB5"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {s.quarter}
                      </text>
                    </g>
                  );
                })}

                {/* 3-Year Historical Average Benchmark (Dashed Orange Line) */}
                <path
                  d={pySeasonCurvePath}
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                />

                {/* FY2025 Seasonal Index Curve (Navy/Blue Line) */}
                <path
                  d={seasonCurvePath}
                  fill="none"
                  stroke="#071F3D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points on Seasonal Curve */}
                {seasonCurvePoints.map((pt, i) => {
                  const isHovered = hoveredIndex === i;
                  return (
                    <g
                      key={`s-dot-${i}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 5.5 : 4}
                        fill="#008FCB"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={9}
                          fill="none"
                          stroke="#008FCB"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Dynamic Seasonality Tooltip on Hover */}
            {hoveredIndex !== null && transformedData[hoveredIndex] && (
              <div
                className="absolute z-30 bg-[#071F3D] text-white p-3 rounded-xl shadow-xl pointer-events-none transition-all text-xs border border-[#1A3D63]"
                style={{
                  left: `${Math.min(Math.max(hoveredIndex * (100 / 12) + 2, 8), 75)}%`,
                  top: '15%'
                }}
              >
                <div className="flex items-center justify-between gap-3 border-b border-[#1E4875] pb-1.5 mb-2">
                  <span className="font-bold text-sm text-white">
                    {transformedData[hoveredIndex].monthFullName} ({transformedData[hoveredIndex].quarter})
                  </span>
                  <span className="bg-[#008FCB] text-[9.5px] font-bold px-1.5 py-0.5 rounded text-white tracking-wider">
                    {transformedData[hoveredIndex].annualSharePercent}% of Year
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC]">Seasonality Index:</span>
                    <span className="font-bold text-white">
                      {transformedData[hoveredIndex].seasonalityIndex}
                      <span className="text-[10px] text-[#A2B7CC] font-normal ml-1">(Base 100)</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC]">3-Yr Historical Benchmark:</span>
                    <span className="font-semibold text-[#F59E0B]">
                      {transformedData[hoveredIndex].pySeasonalityIndex}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC]">Variance from Annual Mean:</span>
                    <span
                      className={`font-bold ${
                        transformedData[hoveredIndex].deviationPercent >= 0 ? 'text-[#12A66A]' : 'text-[#F59E0B]'
                      }`}
                    >
                      {transformedData[hoveredIndex].deviationPercent >= 0 ? '+' : ''}
                      {transformedData[hoveredIndex].deviationPercent}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#A2B7CC]">Monthly Revenue:</span>
                    <span className="font-semibold text-white">
                      {symbol}{(transformedData[hoveredIndex].revenue * rate).toFixed(2)}B
                    </span>
                  </div>

                  <div className="pt-1.5 border-t border-[#1E4875]/60 text-[10.5px]">
                    <span className="text-[#89A1BA] block mb-0.5 font-semibold">Seasonal Pattern Driver:</span>
                    <span className="text-[#00D2FF]">
                      {transformedData[hoveredIndex].driverNarrative}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
};
