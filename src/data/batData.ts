import {
  KpiMetric,
  MonthlyOutlookItem,
  RegionalPerformanceItem,
  RiskAlert,
  ManagementAction,
  ScenarioParams
} from '../types/dashboard';

export const INITIAL_KPIS: KpiMetric[] = [
  {
    id: 'rev-ytd',
    title: 'Revenue (YTD)',
    value: '£25.9B',
    rawValue: 25.9,
    unit: 'B',
    prefix: '£',
    trend: '+3.1%',
    trendValue: 3.1,
    isPositive: true,
    comparisonLabel: 'vs. PY',
    iconType: 'chart',
    tooltip: 'Total consolidated group revenue year-to-date across combustibles and New Categories.',
    sparkline: [2.10, 2.18, 2.25, 2.30, 2.38, 2.45],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '+16.7%',
    targetValue: 26.2,
    targetFormatted: '£26.2B',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '+3.1%',
    yoyTrendValue: 3.1,
    yoyIsPositive: true,
    qoqTrend: '+1.8%',
    qoqTrendValue: 1.8,
    qoqIsPositive: true,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 2.05, target: 2.10, priorYear: 1.96 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 2.15, target: 2.18, priorYear: 2.06 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 1.92, target: 1.95, priorYear: 1.85 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 1.98, target: 2.00, priorYear: 1.91 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 2.05, target: 2.08, priorYear: 1.98 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 2.10, target: 2.12, priorYear: 2.02 },
      { month: 'May 25', monthFull: 'May 2025', value: 2.18, target: 2.20, priorYear: 2.10 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 2.25, target: 2.24, priorYear: 2.16 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 2.30, target: 2.32, priorYear: 2.21 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 2.38, target: 2.40, priorYear: 2.29 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 2.45, target: 2.48, priorYear: 2.36 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 2.52, target: 2.55, priorYear: 2.42 }
    ]
  },
  {
    id: 'adj-profit',
    title: 'Adjusted Profit',
    value: '£11.0B',
    rawValue: 11.0,
    unit: 'B',
    prefix: '£',
    trend: '+2.4%',
    trendValue: 2.4,
    isPositive: true,
    comparisonLabel: 'vs. PY',
    iconType: 'coins',
    tooltip: 'Adjusted operating profit from operations before amortisation, impairment and adjusting items.',
    sparkline: [1.32, 1.35, 1.40, 1.45, 1.55, 1.68],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '+27.3%',
    targetValue: 10.8,
    targetFormatted: '£10.8B',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '+2.4%',
    yoyTrendValue: 2.4,
    yoyIsPositive: true,
    qoqTrend: '+0.9%',
    qoqTrendValue: 0.9,
    qoqIsPositive: true,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 0.88, target: 0.86, priorYear: 0.85 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 0.92, target: 0.90, priorYear: 0.89 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 0.82, target: 0.80, priorYear: 0.79 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 0.85, target: 0.84, priorYear: 0.82 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 0.89, target: 0.87, priorYear: 0.86 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 0.91, target: 0.90, priorYear: 0.88 },
      { month: 'May 25', monthFull: 'May 2025', value: 0.95, target: 0.93, priorYear: 0.92 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 0.98, target: 0.96, priorYear: 0.95 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 1.01, target: 0.99, priorYear: 0.98 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 1.05, target: 1.02, priorYear: 1.01 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 1.10, target: 1.08, priorYear: 1.06 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 1.14, target: 1.10, priorYear: 1.09 }
    ]
  },
  {
    id: 'op-margin',
    title: 'Operating Margin',
    value: '42.5%',
    rawValue: 42.5,
    unit: '%',
    suffix: '%',
    trend: '+0.6 pp',
    trendValue: 0.6,
    isPositive: true,
    comparisonLabel: 'vs. PY',
    iconType: 'gauge',
    tooltip: 'Adjusted operating profit divided by adjusted net revenue, expressed in percentage points.',
    sparkline: [41.5, 41.8, 42.0, 42.2, 42.4, 42.5],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '+1.0 pp',
    targetValue: 43.0,
    targetFormatted: '43.0%',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '+0.6 pp',
    yoyTrendValue: 0.6,
    yoyIsPositive: true,
    qoqTrend: '+0.3 pp',
    qoqTrendValue: 0.3,
    qoqIsPositive: true,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 41.2, target: 42.0, priorYear: 40.8 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 41.4, target: 42.0, priorYear: 41.0 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 41.5, target: 42.2, priorYear: 41.0 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 41.6, target: 42.4, priorYear: 41.1 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 41.8, target: 42.5, priorYear: 41.3 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 41.9, target: 42.6, priorYear: 41.4 },
      { month: 'May 25', monthFull: 'May 2025', value: 42.0, target: 42.8, priorYear: 41.5 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 42.1, target: 42.8, priorYear: 41.6 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 42.2, target: 42.9, priorYear: 41.7 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 42.3, target: 43.0, priorYear: 41.8 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 42.4, target: 43.0, priorYear: 41.9 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 42.5, target: 43.0, priorYear: 41.9 }
    ]
  },
  {
    id: 'op-cash-flow',
    title: 'Operating Cash Flow',
    value: '£8.2B',
    rawValue: 8.2,
    unit: 'B',
    prefix: '£',
    trend: '+4.8%',
    trendValue: 4.8,
    isPositive: true,
    comparisonLabel: 'vs. PY',
    iconType: 'bank',
    tooltip: 'Cash generated from core operating activities after working capital movements.',
    sparkline: [6.9, 7.1, 7.3, 7.5, 7.8, 8.2],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '+18.8%',
    targetValue: 8.0,
    targetFormatted: '£8.0B',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '+4.8%',
    yoyTrendValue: 4.8,
    yoyIsPositive: true,
    qoqTrend: '+2.4%',
    qoqTrendValue: 2.4,
    qoqIsPositive: true,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 0.62, target: 0.60, priorYear: 0.58 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 0.68, target: 0.65, priorYear: 0.64 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 0.58, target: 0.56, priorYear: 0.55 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 0.62, target: 0.60, priorYear: 0.58 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 0.67, target: 0.65, priorYear: 0.63 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 0.70, target: 0.68, priorYear: 0.66 },
      { month: 'May 25', monthFull: 'May 2025', value: 0.74, target: 0.72, priorYear: 0.70 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 0.78, target: 0.76, priorYear: 0.74 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 0.81, target: 0.79, priorYear: 0.77 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 0.85, target: 0.83, priorYear: 0.80 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 0.90, target: 0.87, priorYear: 0.85 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 0.95, target: 0.91, priorYear: 0.89 }
    ]
  },
  {
    id: 'new-cat-rev',
    title: 'New Categories Revenue',
    value: '£3.4B',
    rawValue: 3.4,
    unit: 'B',
    prefix: '£',
    trend: '+12.6%',
    trendValue: 12.6,
    isPositive: true,
    comparisonLabel: 'vs. PY',
    iconType: 'leaf',
    tooltip: 'Gross contribution from non-combustible next-generation portfolios: Vuse (vapour), glo (heated tobacco), and Velo (modern oral).',
    sparkline: [0.27, 0.28, 0.29, 0.31, 0.32, 0.34],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '+25.9%',
    targetValue: 3.2,
    targetFormatted: '£3.2B',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '+12.6%',
    yoyTrendValue: 12.6,
    yoyIsPositive: true,
    qoqTrend: '+5.2%',
    qoqTrendValue: 5.2,
    qoqIsPositive: true,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 0.23, target: 0.22, priorYear: 0.19 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 0.25, target: 0.23, priorYear: 0.21 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 0.24, target: 0.23, priorYear: 0.20 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 0.25, target: 0.24, priorYear: 0.22 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 0.26, target: 0.25, priorYear: 0.23 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 0.27, target: 0.26, priorYear: 0.24 },
      { month: 'May 25', monthFull: 'May 2025', value: 0.28, target: 0.27, priorYear: 0.25 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 0.29, target: 0.28, priorYear: 0.26 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 0.31, target: 0.30, priorYear: 0.27 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 0.32, target: 0.31, priorYear: 0.28 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 0.34, target: 0.32, priorYear: 0.29 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 0.36, target: 0.34, priorYear: 0.31 }
    ]
  },
  {
    id: 'market-share',
    title: 'Market Share (Key Markets)',
    value: '27.8%',
    rawValue: 27.8,
    unit: '%',
    suffix: '%',
    trend: '-0.3 pp',
    trendValue: -0.3,
    isPositive: false,
    comparisonLabel: 'vs. target',
    iconType: 'target',
    tooltip: 'Volume market share across top 20 operating priority markets, weighted by retail sales volume.',
    sparkline: [28.3, 28.2, 28.0, 27.9, 27.9, 27.8],
    sparklineMonths: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    sparklineLabel: '-0.5 pp',
    targetValue: 29.5,
    targetFormatted: '29.5%',
    targetDirection: 'higher-is-better',
    deviationTolerancePercent: 5,
    yoyTrend: '-0.3 pp',
    yoyTrendValue: -0.3,
    yoyIsPositive: false,
    qoqTrend: '-0.2 pp',
    qoqTrendValue: -0.2,
    qoqIsPositive: false,
    history12Months: [
      { month: 'Nov 24', monthFull: 'November 2024', value: 28.6, target: 29.5, priorYear: 28.9 },
      { month: 'Dec 24', monthFull: 'December 2024', value: 28.5, target: 29.5, priorYear: 28.8 },
      { month: 'Jan 25', monthFull: 'January 2025', value: 28.4, target: 29.5, priorYear: 28.7 },
      { month: 'Feb 25', monthFull: 'February 2025', value: 28.3, target: 29.5, priorYear: 28.6 },
      { month: 'Mar 25', monthFull: 'March 2025', value: 28.2, target: 29.5, priorYear: 28.5 },
      { month: 'Apr 25', monthFull: 'April 2025', value: 28.1, target: 29.5, priorYear: 28.4 },
      { month: 'May 25', monthFull: 'May 2025', value: 28.0, target: 29.5, priorYear: 28.3 },
      { month: 'Jun 25', monthFull: 'June 2025', value: 27.9, target: 29.5, priorYear: 28.2 },
      { month: 'Jul 25', monthFull: 'July 2025', value: 27.9, target: 29.5, priorYear: 28.2 },
      { month: 'Aug 25', monthFull: 'August 2025', value: 27.9, target: 29.5, priorYear: 28.1 },
      { month: 'Sep 25', monthFull: 'September 2025', value: 27.8, target: 29.5, priorYear: 28.1 },
      { month: 'Oct 25', monthFull: 'October 2025', value: 27.8, target: 29.5, priorYear: 28.1 }
    ]
  }
];

export const MONTHLY_OUTLOOK: MonthlyOutlookItem[] = [
  { month: 'Jan', monthFullName: 'January', revenue: 1.62, newCategoriesRevenue: 0.22, operatingProfit: 1.15, isForecast: false },
  { month: 'Feb', monthFullName: 'February', revenue: 1.78, newCategoriesRevenue: 0.24, operatingProfit: 1.25, isForecast: false },
  { month: 'Mar', monthFullName: 'March', revenue: 1.95, newCategoriesRevenue: 0.26, operatingProfit: 1.30, isForecast: false },
  { month: 'Apr', monthFullName: 'April', revenue: 2.10, newCategoriesRevenue: 0.27, operatingProfit: 1.32, isForecast: false },
  { month: 'May', monthFullName: 'May', revenue: 2.18, newCategoriesRevenue: 0.28, operatingProfit: 1.35, isForecast: false },
  { month: 'Jun', monthFullName: 'June', revenue: 2.25, newCategoriesRevenue: 0.29, operatingProfit: 1.40, isForecast: false },
  { month: 'Jul', monthFullName: 'July', revenue: 2.30, newCategoriesRevenue: 0.31, operatingProfit: 1.45, isForecast: false },
  { month: 'Aug', monthFullName: 'August', revenue: 2.38, newCategoriesRevenue: 0.32, operatingProfit: 1.55, isForecast: false },
  { month: 'Sep', monthFullName: 'September', revenue: 2.45, newCategoriesRevenue: 0.34, operatingProfit: 1.68, isForecast: false },
  { month: 'Oct', monthFullName: 'October', revenue: 2.70, newCategoriesRevenue: 0.38, operatingProfit: 1.82, isForecast: true },
  { month: 'Nov', monthFullName: 'November', revenue: 3.10, newCategoriesRevenue: 0.44, operatingProfit: 1.98, isForecast: true },
  { month: 'Dec', monthFullName: 'December', revenue: 3.80, newCategoriesRevenue: 0.55, operatingProfit: 2.42, isForecast: true }
];

export const REGIONAL_DATA: RegionalPerformanceItem[] = [
  {
    id: 'americas',
    name: 'Americas',
    shareOfRevenue: 34,
    revenue: 8.8,
    yoyGrowth: 4.2,
    operatingMargin: 46.2,
    headwinds: ['US illicit disposable vapour imports', 'Menthol regulatory discussions in California & Federal FDA'],
    keyMarkets: [
      { country: 'United States', revenue: 6.9, share: 78, volumeTrend: '+2.1% (New Categories: +18%)' },
      { country: 'Canada', revenue: 0.9, share: 10, volumeTrend: '-1.4% (Plain packaging shift)' },
      { country: 'Brazil & Latin America', revenue: 1.0, share: 12, volumeTrend: '+3.5% (Combustibles pricing)' }
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    shareOfRevenue: 29,
    revenue: 7.5,
    yoyGrowth: 2.8,
    operatingMargin: 41.0,
    headwinds: ['EU Tobacco Products Directive (TPD3) revisions', 'Flavour restriction proposals in Germany & France'],
    keyMarkets: [
      { country: 'United Kingdom', revenue: 2.4, share: 32, volumeTrend: '+5.8% (Velo modern oral adoption)' },
      { country: 'Germany', revenue: 2.1, share: 28, volumeTrend: '+1.9% (glo heated tobacco growth)' },
      { country: 'Poland & Eastern Europe', revenue: 1.8, share: 24, volumeTrend: '+3.2% (Resilient volume)' },
      { country: 'Italy & Southern Europe', revenue: 1.2, share: 16, volumeTrend: '+0.8% (Pricing power)' }
    ]
  },
  {
    id: 'apme',
    name: 'Asia Pacific & Middle East',
    shareOfRevenue: 25,
    revenue: 6.5,
    yoyGrowth: 3.4,
    operatingMargin: 39.8,
    headwinds: ['Excise tax indexation in Australia & Pakistan', 'Cross-border counterfeit trade in SE Asia'],
    keyMarkets: [
      { country: 'Japan', revenue: 2.2, share: 34, volumeTrend: '+4.1% (glo Hyper Pro device upgrades)' },
      { country: 'Middle East Hubs (UAE/KSA)', revenue: 1.9, share: 29, volumeTrend: '+6.2% (Premium portfolio expansion)' },
      { country: 'Indonesia & Malaysia', revenue: 1.4, share: 22, volumeTrend: '-0.9% (Illicit excise pressure)' },
      { country: 'Australia & New Zealand', revenue: 1.0, share: 15, volumeTrend: '-4.2% (Severe excise compression)' }
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    shareOfRevenue: 12,
    revenue: 3.1,
    yoyGrowth: 1.1,
    operatingMargin: 37.5,
    headwinds: ['Currency devaluations (Nigeria, Egypt)', 'Consumer purchasing power erosion'],
    keyMarkets: [
      { country: 'South Africa', revenue: 1.5, share: 48, volumeTrend: '+2.4% (Direct store distribution gain)' },
      { country: 'Nigeria', revenue: 0.8, share: 26, volumeTrend: '-3.8% (Naira FX devaluation impact)' },
      { country: 'East Africa (Kenya/Tanzania)', revenue: 0.8, share: 26, volumeTrend: '+4.5% (Price elasticity positive)' }
    ]
  }
];

export const INITIAL_RISKS: RiskAlert[] = [
  {
    id: 'risk-1',
    title: 'Regulatory & Excise Changes',
    subtitle: 'Potential tax increases and regulatory changes in key markets',
    severity: 'High',
    geography: 'United States & European Union',
    exposureEstimate: '£380M - £550M',
    owner: 'T. Kingsley (Head of Corporate & Regulatory Affairs)',
    lastUpdated: '14 Oct 2026, 09:30 UTC',
    iconType: 'alert-red',
    description: 'Upcoming EU Excise Duty Directive (TED) review proposing higher minimum excise on heated tobacco and nicotine pouches, combined with US FDA pending rulemaking on product characterisations.',
    evidence: 'European Commission draft consultation paper WP/2026/89; US Court of Appeals appellate filings docket #26-1049.',
    existingControls: 'Active legislative consultation, economic impact submissions to ministries, portfolio flexibility toward reduced-risk categories.',
    mitigationPlan: 'Scenario-tested 3-tier price pass-through model; accelerate pre-submission engagement with regulatory scientific advisory boards.',
    dueDate: '31 Dec 2026',
    status: 'Mitigating'
  },
  {
    id: 'risk-2',
    title: 'Illicit Trade Exposure',
    subtitle: 'Continued risk from illicit trade and enforcement challenges',
    severity: 'High',
    geography: 'Malaysia, South Africa, Eastern Europe & US Non-Compliant Vapes',
    exposureEstimate: '£220M - £340M',
    owner: 'M. Vance (Chief Security & Brand Integrity Officer)',
    lastUpdated: '12 Oct 2026, 16:15 UTC',
    iconType: 'alert-red',
    description: 'Inflow of illicit, untaxed disposable vaping products evading customs and FDA warning letters in North America, alongside illicit combustible cigarettes holding >40% share in selected developing markets.',
    evidence: 'KPMG Project Sun 2025 illicit trade survey; Port of Los Angeles customs seizure log Q3 2026.',
    existingControls: 'Codentify and digital track-and-trace serialization; intelligence sharing with law enforcement (Interpol, Europol, CBP).',
    mitigationPlan: 'Expand digital border tracing; lobby for port-of-entry seizure enforcement and strict retail directory compliance laws.',
    dueDate: '15 Nov 2026',
    status: 'Active'
  },
  {
    id: 'risk-3',
    title: 'FX & Inflation Volatility',
    subtitle: 'Currency fluctuations and input cost inflation impacting margins',
    severity: 'Medium',
    geography: 'Sub-Saharan Africa, Latin America, Japan (JPY/GBP)',
    exposureEstimate: '£140M - £210M',
    owner: 'C. Sterling (Group Treasurer)',
    lastUpdated: '15 Oct 2026, 11:00 UTC',
    iconType: 'alert-amber',
    description: 'Volatility in JPY and emerging market currencies against GBP, coupled with rising packaging paperboard and shipping container indexation.',
    evidence: 'Bank of England trade-weighted index reports; Baltic Freight Container benchmark indices.',
    existingControls: 'Rolling 12-month forward FX derivative hedges (covering 75% of forecasted cash flows); dual-sourcing container agreements.',
    mitigationPlan: 'Adjust dynamic hedging threshold to 85% for high-beta emerging currencies; lock 2027 paperboard volume contracts before Q4.',
    dueDate: '30 Nov 2026',
    status: 'Monitored'
  },
  {
    id: 'risk-4',
    title: 'Supply Chain Resilience',
    subtitle: 'Geopolitical risks and supplier concentration in key markets',
    severity: 'Medium',
    geography: 'East Asia component suppliers, Eastern European logistics corridors',
    exposureEstimate: '£90M - £160M',
    owner: 'D. Ross (Global Operations Director)',
    lastUpdated: '11 Oct 2026, 14:20 UTC',
    iconType: 'alert-amber',
    description: 'Concentration of battery and microchip fabrication for Vuse and glo devices across three Tier-1 manufacturers in Shenzhen and Taiwan.',
    evidence: 'Supplier quarterly audit report; logistics corridor delay telemetry.',
    existingControls: '60-day strategic buffer inventory for key sub-assemblies; secondary production qualifications in Southeast Asia and Europe.',
    mitigationPlan: 'Qualify two additional European assembly partners for glo Hyper modules by Q1 2027; enforce vendor safety buffer stock.',
    dueDate: '28 Feb 2027',
    status: 'Monitored'
  },
  {
    id: 'risk-5',
    title: 'Climate & ESG Commitments',
    subtitle: 'Progress against net zero and sustainability targets under scrutiny',
    severity: 'Low',
    geography: 'Global Agricultural Supply Chain',
    exposureEstimate: '£30M - £70M (regulatory compliance fees)',
    owner: 'E. Lindqvist (Chief Sustainability & ESG Officer)',
    lastUpdated: '08 Oct 2026, 10:45 UTC',
    iconType: 'leaf-green',
    description: 'Auditing of Scope 3 farmer emissions and compliance with European Corporate Sustainability Due Diligence Directive (CSDDD).',
    evidence: 'Science Based Targets initiative (SBTi) milestone scorecard; Ernst & Young ESG limited assurance engagement review.',
    existingControls: 'Contract farmer precision irrigation programs; renewable energy sourcing across all primary manufacturing hubs.',
    mitigationPlan: 'Deploy farmer mobile app for carbon offset verification; transition remaining 15% product packaging to fully recyclable substrates.',
    dueDate: '15 Jan 2027',
    status: 'Mitigating'
  }
];

export const INITIAL_ACTIONS: ManagementAction[] = [
  {
    id: 1,
    priority: 1,
    title: 'Review pricing and excise scenarios',
    subtitle: 'Assess impact of upcoming regulatory changes across key markets',
    rationale: 'Protect operating margin above 42.5% through elastic pricing corridors ahead of H1 excise indexations in Europe and APME.',
    expectedFinancialImpact: '+£350M Net Operating Profit protection',
    owner: 'A. Campbell',
    ownerRole: 'Group Financial Controller & Pricing Lead',
    dueDate: '24 Oct 2026',
    status: 'Under Review',
    alternativeOptions: [
      'Option A: Full pass-through of excise with 3% margin expansion (recommended)',
      'Option B: Partial absorption in premium tier to capture competitor volume share',
      'Option C: Phased quarterly price adjustments to test regional price elasticities'
    ],
    financialAssumptions: [
      'Combustible volume price elasticity modelled at -0.18',
      'Consumer trade-down buffer: ~15% migrating to value brands or Velo modern oral',
      'Distributor inventory pre-buying window assumed at 18 days'
    ],
    auditHistory: [
      { date: '10 Oct 2026', user: 'CFO Office', action: 'Created action draft and linked to Q4 pricing simulation' },
      { date: '14 Oct 2026', user: 'A. Campbell', action: 'Submitted revised elasticities across 14 priority markets' }
    ]
  },
  {
    id: 2,
    priority: 2,
    title: 'Accelerate smoke-free portfolio growth',
    subtitle: 'Scale New Categories through targeted investment and market activation',
    rationale: 'Drive towards £5B New Categories milestone by expanding glo Hyper Pro and Velo Max in top 10 metropolitan markets.',
    expectedFinancialImpact: '+£480M Incremental Revenue (+14.2% YoY run-rate)',
    owner: 'K. Patel',
    ownerRole: 'Chief Growth Officer - New Categories',
    dueDate: '15 Nov 2026',
    status: 'In Progress',
    alternativeOptions: [
      'Option A: Prioritise modern oral (Velo) where gross margins exceed 62%',
      'Option B: Aggressive retail device subsidy for glo Hyper Pro in Japan and Germany',
      'Option C: Omnichannel direct-to-consumer subscription rollout across UK and Nordics'
    ],
    financialAssumptions: [
      'Device subsidy recouped within 2.8 consumable pack purchases',
      'Velo modern oral pouch gross margin: 64.5%',
      'Average monthly active consumer retention rate: 71%'
    ],
    auditHistory: [
      { date: '01 Oct 2026', user: 'Executive Committee', action: 'Approved £120M H2 marketing allocation reallocation' },
      { date: '12 Oct 2026', user: 'K. Patel', action: 'Activated Tokyo and London launch campaigns' }
    ]
  },
  {
    id: 3,
    priority: 3,
    title: 'Strengthen illicit trade monitoring',
    subtitle: 'Enhance data analytics and cross-border collaboration',
    rationale: 'Counter unregulated illicit disposable vapes in North America and Western Europe that dilute legitimate retail market share.',
    expectedFinancialImpact: '£120M Recoverable Revenue & Brand Equity Protection',
    owner: 'M. Vance',
    ownerRole: 'Chief Security Officer',
    dueDate: '30 Nov 2026',
    status: 'Approved',
    alternativeOptions: [
      'Option A: Deploy proprietary AI retail scrapers and undercover store audits (recommended)',
      'Option B: Joint industry legal injunction against non-compliant overseas wholesalers',
      'Option C: Consumer QR authentication incentive campaigns'
    ],
    financialAssumptions: [
      'Enforcement seizures will restore 1.2% legal market share in US convenience retail',
      'Investigation and litigation expenditure estimated at £8.5M'
    ],
    auditHistory: [
      { date: '05 Oct 2026', user: 'Legal & Compliance', action: 'Drafted federal trade commission petition' },
      { date: '15 Oct 2026', user: 'CFO Office', action: 'Approved budget and operationalized task force' }
    ]
  },
  {
    id: 4,
    priority: 4,
    title: 'Optimize working capital by region',
    subtitle: 'Improve inventory turns and receivables across markets',
    rationale: 'Reduce group Cash Conversion Cycle from 68 days down to 62 days to release balance sheet cash for share buyback and deleveraging.',
    expectedFinancialImpact: '£240M Operating Liquidity unlocked',
    owner: 'S. Al-Mansoor',
    ownerRole: 'Group Treasury & Working Capital Lead',
    dueDate: '15 Dec 2026',
    status: 'In Progress',
    alternativeOptions: [
      'Option A: Harmonise distributor payment terms across Western Europe to net-30 days',
      'Option B: Dynamic supply chain financing facility with Tier-1 banking syndicates',
      'Option C: Regional leaf warehouse safety stock reduction via regional replenishment hubs'
    ],
    financialAssumptions: [
      'Days Sales Outstanding (DSO) compression of 3.2 days',
      'Days Inventory Outstanding (DIO) reduction of 4.0 days',
      'Distributor default risk remains below 0.05%'
    ],
    auditHistory: [
      { date: '28 Sep 2026', user: 'S. Al-Mansoor', action: 'Initiated European DSO audit with regional controllers' },
      { date: '11 Oct 2026', user: 'CFO Office', action: 'Approved new supplier payment term governance' }
    ]
  },
  {
    id: 5,
    priority: 5,
    title: 'Track scope 3 transition milestones',
    subtitle: 'Ensure delivery against climate and ESG commitments',
    rationale: 'Meet 2030 Science Based Targets and satisfy institutional ESG investors maintaining sovereign wealth and sustainability mandates.',
    expectedFinancialImpact: 'Risk mitigation against carbon border tax (£45M potential penalty)',
    owner: 'E. Lindqvist',
    ownerRole: 'Head of ESG Strategy & Compliance',
    dueDate: '20 Jan 2027',
    status: 'Proposed',
    alternativeOptions: [
      'Option A: Direct farmer solar water pumping investments with co-op subsidies',
      'Option B: Carbon credit hedging via certified nature-based removals',
      'Option C: Packaging weight reduction across all combustible and vaping lines'
    ],
    financialAssumptions: [
      'Capital expenditure requirement: £18M over 24 months',
      'Cost of carbon avoided estimated at €85 per metric tonne'
    ],
    auditHistory: [
      { date: '12 Oct 2026', user: 'E. Lindqvist', action: 'Submitted draft charter to Sustainability Steering Committee' }
    ]
  }
];

export const BASE_SCENARIO_PARAMS: ScenarioParams = {
  priceChangePercent: 3.5,
  combustibleVolumePercent: -3.2,
  newCategoriesGrowthPercent: 12.6,
  inputCostInflationPercent: 2.8,
  exciseTaxHikePercent: 3.0,
  fxShiftPercent: 0.0,
  workingCapitalDaysShift: -2,
  capexShiftPercent: 0.0
};

export const DEMO_ROLES = [
  { id: 'cfo', name: 'Chief Financial Officer', code: 'CFO', team: 'Executive Committee', access: 'Full Executive & Financial Approval Authority' },
  { id: 'fpa', name: 'Director of Group FP&A', code: 'FP&A', team: 'Corporate Finance', access: 'Planning, Forecasting & Scenario Modelling' },
  { id: 'regional', name: 'Regional Finance VP (Americas)', code: 'R-VP', team: 'Americas Leadership', access: 'Regional Financials & Market Drill-downs' },
  { id: 'risk', name: 'Chief Risk & Compliance Officer', code: 'CRO', team: 'Enterprise Risk', access: 'Risk Register & Mitigation Approval' },
  { id: 'board', name: 'Non-Executive Board Member', code: 'NED', team: 'Board of Directors', access: 'Read-Only Executive Review' }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'US Menthol Review Updated',
    message: 'FDA guidance draft submitted to OMB for inter-agency review.',
    time: '15m ago',
    unread: true,
    type: 'risk'
  },
  {
    id: 'notif-2',
    title: 'Working Capital Target Met',
    message: 'Americas DSO declined to 31.8 days, releasing £42M cash.',
    time: '2h ago',
    unread: true,
    type: 'action'
  },
  {
    id: 'notif-3',
    title: 'New Categories Growth Milestone',
    message: 'Velo modern oral reached #1 volume share in Sweden and Denmark.',
    time: '5h ago',
    unread: false,
    type: 'kpi'
  }
];
