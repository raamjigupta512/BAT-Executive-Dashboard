import { KpiMetric } from '../types/dashboard';

export interface KpiDeviationResult {
  isFlagged: boolean;
  deviationPercent: number;
  formattedDeviation: string;
  targetValue: number;
  formattedTarget: string;
  isAdverse: boolean;
  thresholdPercent: number;
  alertReason: string;
  status: 'critical' | 'healthy' | 'overperforming';
}

/**
 * Standard default executive targets for BAT KPIs if not explicitly provided on the metric
 */
export const DEFAULT_KPI_TARGETS: Record<
  string,
  { targetValue: number; formattedTarget: string; direction: 'higher-is-better' | 'lower-is-better' }
> = {
  'rev-ytd': {
    targetValue: 26.2,
    formattedTarget: '£26.2B',
    direction: 'higher-is-better'
  },
  'adj-profit': {
    targetValue: 10.8,
    formattedTarget: '£10.8B',
    direction: 'higher-is-better'
  },
  'op-margin': {
    targetValue: 43.0,
    formattedTarget: '43.0%',
    direction: 'higher-is-better'
  },
  'op-cash-flow': {
    targetValue: 8.0,
    formattedTarget: '£8.0B',
    direction: 'higher-is-better'
  },
  'new-cat-rev': {
    targetValue: 3.2,
    formattedTarget: '£3.2B',
    direction: 'higher-is-better'
  },
  'market-share': {
    targetValue: 29.5,
    formattedTarget: '29.5%',
    direction: 'higher-is-better'
  }
};

export interface CheckKpiDeviationOptions {
  /** Threshold percentage at which to flag an alert (defaults to 5) */
  thresholdPercent?: number;
  /**
   * 'adverse': flag only when the KPI underperforms target by > threshold% (standard executive risk alerting)
   * 'both': flag whenever KPI deviates from target by > threshold% in either direction
   */
  mode?: 'adverse' | 'both';
  /** Optional override for target value */
  customTargetValue?: number;
  /** Optional override for target label */
  customTargetFormatted?: string;
}

/**
 * Calculates whether a KPI in the dashboard deviates from its target by more than the specified threshold (default 5%).
 * 
 * Deviation Formula:
 * ((actual - target) / target) * 100
 * 
 * Returns a comprehensive `KpiDeviationResult` containing:
 * - isFlagged: boolean (true if deviation exceeds threshold)
 * - deviationPercent: number (e.g. -5.76)
 * - formattedDeviation: string (e.g. "-5.8%")
 * - targetValue: number
 * - formattedTarget: string
 * - isAdverse: boolean
 * - alertReason: explanation string for tooltips and screen readers
 */
export function checkKpiDeviation(
  kpi: KpiMetric,
  options: CheckKpiDeviationOptions = {}
): KpiDeviationResult {
  const threshold = options.thresholdPercent ?? kpi.deviationTolerancePercent ?? 5.0;
  const mode = options.mode ?? 'adverse';

  // Determine target value
  const defaultMeta = DEFAULT_KPI_TARGETS[kpi.id];
  const target =
    options.customTargetValue ??
    kpi.targetValue ??
    (defaultMeta ? defaultMeta.targetValue : kpi.rawValue);

  const direction = kpi.targetDirection ?? defaultMeta?.direction ?? 'higher-is-better';

  const formattedTarget =
    options.customTargetFormatted ??
    kpi.targetFormatted ??
    defaultMeta?.formattedTarget ??
    `${target}${kpi.unit === '%' ? '%' : kpi.unit}`;

  // If target is zero or invalid, return unflagged
  if (!target || target === 0) {
    return {
      isFlagged: false,
      deviationPercent: 0,
      formattedDeviation: '0.0%',
      targetValue: 0,
      formattedTarget: 'N/A',
      isAdverse: false,
      thresholdPercent: threshold,
      alertReason: 'No valid target specified',
      status: 'healthy'
    };
  }

  // Calculate percentage variance relative to target: ((Actual - Target) / Target) * 100
  const deviation = ((kpi.rawValue - target) / target) * 100;
  const roundedDeviation = Math.round(deviation * 10) / 10;
  const formattedDeviation = `${deviation > 0 ? '+' : ''}${roundedDeviation.toFixed(1)}%`;

  // Determine adversity based on direction
  const isUnderperforming =
    direction === 'higher-is-better' ? deviation < 0 : deviation > 0;

  // Check if deviation exceeds threshold
  let isFlagged = false;
  if (mode === 'adverse') {
    // Flag if adverse deviation exceeds threshold (e.g. deviation <= -5.0%)
    isFlagged = isUnderperforming && Math.abs(deviation) >= threshold;
  } else {
    // Flag if absolute deviation in any direction exceeds threshold
    isFlagged = Math.abs(deviation) >= threshold;
  }

  // Construct descriptive alert message
  let alertReason = '';
  let status: 'critical' | 'healthy' | 'overperforming' = 'healthy';

  if (isFlagged) {
    status = isUnderperforming ? 'critical' : 'overperforming';
    alertReason = `${kpi.title} deviates by ${formattedDeviation} from target (${formattedTarget}), exceeding the ${threshold}% tolerance threshold.`;
  } else if (isUnderperforming) {
    status = 'healthy';
    alertReason = `${kpi.title} is ${formattedDeviation} vs target (${formattedTarget}), within acceptable ±${threshold}% tolerance.`;
  } else {
    status = deviation >= threshold ? 'overperforming' : 'healthy';
    alertReason = `${kpi.title} is on track (${formattedDeviation} vs target ${formattedTarget}).`;
  }

  return {
    isFlagged,
    deviationPercent: roundedDeviation,
    formattedDeviation,
    targetValue: target,
    formattedTarget,
    isAdverse: isUnderperforming,
    thresholdPercent: threshold,
    alertReason,
    status
  };
}

/**
 * Convenience helper to quickly check whether a KPI is flagged for target deviation
 */
export function isKpiDeviationAlert(
  kpi: KpiMetric,
  thresholdPercent: number = 5.0,
  mode: 'adverse' | 'both' = 'adverse'
): boolean {
  return checkKpiDeviation(kpi, { thresholdPercent, mode }).isFlagged;
}

/**
 * Flags and returns all KPIs in a list that deviate from targets by more than the threshold
 */
export function getFlaggedKpis(
  kpis: KpiMetric[],
  thresholdPercent: number = 5.0,
  mode: 'adverse' | 'both' = 'adverse'
): Array<{ kpi: KpiMetric; deviation: KpiDeviationResult }> {
  return kpis
    .map((kpi) => ({
      kpi,
      deviation: checkKpiDeviation(kpi, { thresholdPercent, mode })
    }))
    .filter((item) => item.deviation.isFlagged);
}
