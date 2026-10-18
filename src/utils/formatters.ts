import { Currency, ScenarioParams, ScenarioOutput } from '../types/dashboard';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rateFromGbp: number }> = {
  GBP: { symbol: '£', rateFromGbp: 1.0 },
  USD: { symbol: '$', rateFromGbp: 1.28 },
  EUR: { symbol: '€', rateFromGbp: 1.17 },
};

export * from './kpiDeviation';

export function formatCurrencyValue(valueInBillionsGbp: number, currency: Currency): string {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;
  const converted = valueInBillionsGbp * rate;
  return `${symbol}${converted.toFixed(1)}B`;
}

export function formatCurrencyDirect(amount: number, currency: Currency, unit: 'B' | 'M' = 'B'): string {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;
  const converted = amount * rate;
  return `${symbol}${converted.toFixed(1)}${unit}`;
}

export function calculateScenario(baseRevenueGbp: number, baseProfitGbp: number, baseCashFlowGbp: number, params: ScenarioParams): ScenarioOutput {
  // Baseline BAT financials:
  // Revenue: ~£25.9B
  // Adjusted Profit: ~£11.0B (Base Margin = ~42.5%)
  // Cash flow: ~£8.2B
  
  // Price elasticity on revenue: +1% price yields approx +0.85% net revenue (price elasticity ~ -0.15 for tobacco)
  const priceRevenueImpact = baseRevenueGbp * (params.priceChangePercent / 100) * 0.85;

  // Combustible volume impact on revenue:
  const combustibleBaseRevenue = baseRevenueGbp * 0.869; // ~87% combustible
  const volumeRevenueImpact = combustibleBaseRevenue * (params.combustibleVolumePercent / 100);

  // New Categories growth impact:
  const newCatBaseRevenue = baseRevenueGbp * 0.131; // ~13.1% new categories (£3.4B)
  const newCatGrowthDelta = params.newCategoriesGrowthPercent - 12.6; // baseline is 12.6%
  const newCatRevenueImpact = newCatBaseRevenue * (newCatGrowthDelta / 100);

  // FX shift impact:
  const fxRevenueImpact = baseRevenueGbp * (params.fxShiftPercent / 100) * 0.65; // unhedged portion

  const newRevenue = baseRevenueGbp + priceRevenueImpact + volumeRevenueImpact + newCatRevenueImpact + fxRevenueImpact;

  // Cost effects:
  // Base COGS & Opex = baseRevenueGbp - baseProfitGbp (~£14.9B)
  const baseCost = baseRevenueGbp - baseProfitGbp;
  const inflationCostImpact = baseCost * 0.45 * (params.inputCostInflationPercent / 100);
  const exciseCostImpact = baseRevenueGbp * 0.25 * (params.exciseTaxHikePercent / 100);
  
  // Price drops directly to bottom line (net of ~10% distributor margin):
  const priceProfitImpact = priceRevenueImpact * 0.90;
  // Volume drops at gross margin (~68% contribution):
  const volumeProfitImpact = volumeRevenueImpact * 0.68;
  // New Categories gross margin (~52%):
  const newCatProfitImpact = newCatRevenueImpact * 0.52;
  const fxProfitImpact = fxRevenueImpact * 0.42;

  const newOperatingProfit = baseProfitGbp + priceProfitImpact + volumeProfitImpact + newCatProfitImpact + fxProfitImpact - inflationCostImpact - exciseCostImpact;
  const newOperatingMargin = (newOperatingProfit / newRevenue) * 100;
  const baseOperatingMargin = (baseProfitGbp / baseRevenueGbp) * 100;

  // Cash flow effects:
  // Working capital days shift: each day of working capital on £25.9B revenue is ~£71M
  const workingCapitalImpact = -(params.workingCapitalDaysShift * (baseRevenueGbp * 1000 / 365)); // in millions
  const capexImpact = -(850 * (params.capexShiftPercent / 100)); // base capex ~£850M

  const cashFlowFromProfit = (newOperatingProfit - baseProfitGbp) * 0.75; // cash conversion ratio
  const newOperatingCashFlow = baseCashFlowGbp + cashFlowFromProfit + (workingCapitalImpact / 1000);

  return {
    revenue: Number(newRevenue.toFixed(2)),
    revenueChange: Number(((newRevenue - baseRevenueGbp) / baseRevenueGbp * 100).toFixed(1)),
    operatingProfit: Number(newOperatingProfit.toFixed(2)),
    operatingProfitChange: Number(((newOperatingProfit - baseProfitGbp) / baseProfitGbp * 100).toFixed(1)),
    operatingMargin: Number(newOperatingMargin.toFixed(1)),
    operatingMarginPpChange: Number((newOperatingMargin - baseOperatingMargin).toFixed(1)),
    operatingCashFlow: Number(newOperatingCashFlow.toFixed(2)),
    cashFlowChange: Number(((newOperatingCashFlow - baseCashFlowGbp) / baseCashFlowGbp * 100).toFixed(1)),
    workingCapitalImpact: Math.round(workingCapitalImpact)
  };
}
