export type NavigationTab =
  | 'overview'
  | 'financials'
  | 'brands'
  | 'new-categories'
  | 'cash-flow'
  | 'supply-chain'
  | 'regulation-esg'
  | 'risk-intelligence'
  | 'scenario-planning'
  | 'decisions-actions'
  | 'reports';

export type Currency = 'GBP' | 'USD' | 'EUR';
export type ReportingPeriod = 'FY 2025 (YTD)' | 'FY 2024 (Full Year)' | 'Q3 2025' | 'Q2 2025' | 'Q1 2025';
export type RegionFilter = 'All Regions' | 'Americas' | 'Europe' | 'Asia Pacific & Middle East' | 'Africa';
export type CompareWithMode = 'YoY' | 'QoQ' | 'Target';

export interface MonthlyHistoryPoint {
  month: string;
  monthFull: string;
  value: number;
  target?: number;
  priorYear?: number;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  rawValue: number;
  unit: string;
  prefix?: string;
  suffix?: string;
  trend: string;
  trendValue: number;
  isPositive: boolean;
  comparisonLabel: string;
  iconType: 'chart' | 'coins' | 'gauge' | 'bank' | 'leaf' | 'target';
  tooltip: string;
  sparkline?: number[];
  sparklineMonths?: string[];
  sparklineLabel?: string;
  targetValue?: number;
  targetFormatted?: string;
  targetDirection?: 'higher-is-better' | 'lower-is-better';
  deviationTolerancePercent?: number;
  qoqTrend?: string;
  qoqTrendValue?: number;
  qoqIsPositive?: boolean;
  yoyTrend?: string;
  yoyTrendValue?: number;
  yoyIsPositive?: boolean;
  history12Months?: MonthlyHistoryPoint[];
}

export interface MonthlyOutlookItem {
  month: string;
  monthFullName: string;
  revenue: number; // in Billions
  newCategoriesRevenue: number; // in Billions
  operatingProfit: number; // in Billions
  isForecast?: boolean;
}

export interface RegionalPerformanceItem {
  id: string;
  name: string;
  shareOfRevenue: number; // percentage, e.g. 34
  revenue: number; // in Billions
  yoyGrowth: number; // percentage, e.g. 4.2
  operatingMargin: number; // percentage, e.g. 46.2
  headwinds: string[];
  keyMarkets: {
    country: string;
    revenue: number;
    share: number;
    volumeTrend: string;
  }[];
}

export type RiskSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface RiskAlert {
  id: string;
  title: string;
  subtitle: string;
  severity: RiskSeverity;
  geography: string;
  exposureEstimate: string; // e.g. "£450M - £600M"
  owner: string;
  lastUpdated: string;
  iconType: 'alert-red' | 'alert-amber' | 'leaf-green';
  description: string;
  evidence: string;
  existingControls: string;
  mitigationPlan: string;
  dueDate: string;
  status: 'Active' | 'Mitigating' | 'Monitored' | 'Escalated';
}

export type ActionStatus = 'Proposed' | 'Under Review' | 'Approved' | 'In Progress' | 'Completed';

export interface ManagementAction {
  id: number;
  priority: number;
  title: string;
  subtitle: string;
  rationale: string;
  expectedFinancialImpact: string;
  owner: string;
  ownerRole: string;
  dueDate: string;
  status: ActionStatus;
  alternativeOptions: string[];
  financialAssumptions: string[];
  auditHistory: {
    date: string;
    user: string;
    action: string;
  }[];
}

export interface ScenarioParams {
  priceChangePercent: number; // -5% to +10%
  combustibleVolumePercent: number; // -10% to +5%
  newCategoriesGrowthPercent: number; // 0% to +35%
  inputCostInflationPercent: number; // 0% to +12%
  exciseTaxHikePercent: number; // 0% to +15%
  fxShiftPercent: number; // -10% to +10%
  workingCapitalDaysShift: number; // -15 to +15 days
  capexShiftPercent: number; // -20% to +20%
}

export interface ScenarioOutput {
  revenue: number;
  revenueChange: number;
  operatingProfit: number;
  operatingProfitChange: number;
  operatingMargin: number;
  operatingMarginPpChange: number;
  operatingCashFlow: number;
  cashFlowChange: number;
  workingCapitalImpact: number;
}
