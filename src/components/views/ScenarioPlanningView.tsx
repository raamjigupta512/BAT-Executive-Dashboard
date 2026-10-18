import React, { useState } from 'react';
import { Currency, ScenarioParams } from '../../types/dashboard';
import { BASE_SCENARIO_PARAMS } from '../../data/batData';
import { calculateScenario, CURRENCY_RATES } from '../../utils/formatters';
import { Sliders, RotateCcw, Save, TrendingUp, TrendingDown, Check, Info } from 'lucide-react';

interface ScenarioPlanningViewProps {
  currency: Currency;
  onApplyScenarioToDashboard?: (params: ScenarioParams) => void;
}

export const ScenarioPlanningView: React.FC<ScenarioPlanningViewProps> = ({
  currency,
  onApplyScenarioToDashboard
}) => {
  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const [params, setParams] = useState<ScenarioParams>({ ...BASE_SCENARIO_PARAMS });
  const [activePreset, setActivePreset] = useState<'Base' | 'Upside' | 'Downside' | 'Custom'>('Base');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Baseline figures
  const baseRevenue = 25.9;
  const baseProfit = 11.0;
  const baseCashFlow = 8.2;

  const output = calculateScenario(baseRevenue, baseProfit, baseCashFlow, params);

  const handlePreset = (preset: 'Base' | 'Upside' | 'Downside') => {
    setActivePreset(preset);
    if (preset === 'Base') {
      setParams({ ...BASE_SCENARIO_PARAMS });
    } else if (preset === 'Upside') {
      setParams({
        priceChangePercent: 5.5,
        combustibleVolumePercent: -1.5,
        newCategoriesGrowthPercent: 22.0,
        inputCostInflationPercent: 1.5,
        exciseTaxHikePercent: 2.0,
        fxShiftPercent: 3.0,
        workingCapitalDaysShift: -5,
        capexShiftPercent: 5.0
      });
    } else if (preset === 'Downside') {
      setParams({
        priceChangePercent: 1.0,
        combustibleVolumePercent: -6.5,
        newCategoriesGrowthPercent: 5.0,
        inputCostInflationPercent: 6.0,
        exciseTaxHikePercent: 7.0,
        fxShiftPercent: -4.0,
        workingCapitalDaysShift: 6,
        capexShiftPercent: -10.0
      });
    }
  };

  const handleSliderChange = (key: keyof ScenarioParams, val: number) => {
    setActivePreset('Custom');
    setParams(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    if (onApplyScenarioToDashboard) {
      onApplyScenarioToDashboard(params);
    }
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#071B3A]">Scenario Planning &amp; Sensitivity Workbench</h1>
          <p className="text-xs text-[#536B8B]">
            Interactive CFO decision model: adjust pricing, volumes, inflation, and excise to simulate multi-year P&amp;L impact
          </p>
        </div>

        {/* Preset buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white rounded-lg border border-[#DCE8F0] p-1 text-xs font-semibold">
            {(['Base', 'Upside', 'Downside', 'Custom'] as const).map((p) => (
              <button
                key={p}
                onClick={() => p !== 'Custom' && handlePreset(p)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  activePreset === p
                    ? 'bg-[#008FCB] text-white shadow-2xs'
                    : 'text-[#536B8B] hover:text-[#071B3A]'
                }`}
              >
                {p === 'Base' ? 'Base Case' : p === 'Upside' ? 'Upside Case' : p === 'Downside' ? 'Downside Stress' : 'Custom'}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePreset('Base')}
            className="p-2 rounded-lg bg-white border border-[#DCE8F0] text-[#536B8B] hover:text-[#071B3A] cursor-pointer"
            title="Reset to Base Case"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#008FCB] hover:bg-[#007AB8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Applied to Model</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save &amp; Apply Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recalculated Output Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Output 1: Revenue */}
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Modelled Revenue</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">
            {symbol}{(output.revenue * rate).toFixed(2)}B
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            {output.revenueChange >= 0 ? (
              <span className="text-[#12A66A]">▲ +{output.revenueChange}% vs. Baseline</span>
            ) : (
              <span className="text-[#EF4444]">▼ {output.revenueChange}% vs. Baseline</span>
            )}
          </div>
        </div>

        {/* Output 2: Operating Profit */}
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Adjusted Operating Profit</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">
            {symbol}{(output.operatingProfit * rate).toFixed(2)}B
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            {output.operatingProfitChange >= 0 ? (
              <span className="text-[#12A66A]">▲ +{output.operatingProfitChange}% vs. Baseline</span>
            ) : (
              <span className="text-[#EF4444]">▼ {output.operatingProfitChange}% vs. Baseline</span>
            )}
          </div>
        </div>

        {/* Output 3: Operating Margin */}
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Operating Margin</span>
          <div className="text-2xl font-bold text-[#008FCB] mt-1">
            {output.operatingMargin}%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            {output.operatingMarginPpChange >= 0 ? (
              <span className="text-[#12A66A]">▲ +{output.operatingMarginPpChange} pp</span>
            ) : (
              <span className="text-[#EF4444]">▼ {output.operatingMarginPpChange} pp</span>
            )}
            <span className="text-[#7A92A9] font-normal text-[11px]">(Base: 42.5%)</span>
          </div>
        </div>

        {/* Output 4: Operating Cash Flow */}
        <div className="p-4 bg-white rounded-xl border border-[#DCE8F0] shadow-xs">
          <span className="text-xs font-semibold text-[#536B8B]">Operating Cash Flow</span>
          <div className="text-2xl font-bold text-[#071B3A] mt-1">
            {symbol}{(output.operatingCashFlow * rate).toFixed(2)}B
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-1">
            {output.cashFlowChange >= 0 ? (
              <span className="text-[#12A66A]">▲ +{output.cashFlowChange}% vs. Baseline</span>
            ) : (
              <span className="text-[#EF4444]">▼ {output.cashFlowChange}% vs. Baseline</span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Levers Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Commercial & Market Levers */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071B3A] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#008FCB]" />
            Commercial &amp; Volume Levers
          </h3>

          {/* Slider 1: Combustible Pricing */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Combustible Price Realisation</span>
              <span className="font-bold text-[#008FCB]">{params.priceChangePercent > 0 ? `+${params.priceChangePercent}%` : `${params.priceChangePercent}%`}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="10"
              step="0.5"
              value={params.priceChangePercent}
              onChange={(e) => handleSliderChange('priceChangePercent', parseFloat(e.target.value))}
              className="w-full accent-[#008FCB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>-2% (Price cuts)</span>
              <span>+3.5% (Base)</span>
              <span>+10% (Aggressive pass-through)</span>
            </div>
          </div>

          {/* Slider 2: Combustible Volume */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Combustible Industry Volume</span>
              <span className="font-bold text-[#008FCB]">{params.combustibleVolumePercent > 0 ? `+${params.combustibleVolumePercent}%` : `${params.combustibleVolumePercent}%`}</span>
            </div>
            <input
              type="range"
              min="-10"
              max="2"
              step="0.5"
              value={params.combustibleVolumePercent}
              onChange={(e) => handleSliderChange('combustibleVolumePercent', parseFloat(e.target.value))}
              className="w-full accent-[#008FCB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>-10% (Severe contraction)</span>
              <span>-3.2% (Base trend)</span>
              <span>+2% (Resilient)</span>
            </div>
          </div>

          {/* Slider 3: New Categories Growth */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">New Categories YoY Growth</span>
              <span className="font-bold text-[#10B981]">+{params.newCategoriesGrowthPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              step="1"
              value={params.newCategoriesGrowthPercent}
              onChange={(e) => handleSliderChange('newCategoriesGrowthPercent', parseFloat(e.target.value))}
              className="w-full accent-[#10B981] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>0% (Stall)</span>
              <span>+12.6% (Base)</span>
              <span>+35% (Accelerated rollout)</span>
            </div>
          </div>

          {/* Slider 4: FX Rate Shift */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Foreign Exchange Rate Movement (vs GBP)</span>
              <span className="font-bold text-[#008FCB]">{params.fxShiftPercent > 0 ? `+${params.fxShiftPercent}%` : `${params.fxShiftPercent}%`}</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={params.fxShiftPercent}
              onChange={(e) => handleSliderChange('fxShiftPercent', parseFloat(e.target.value))}
              className="w-full accent-[#008FCB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>-10% (Emerging FX shock)</span>
              <span>0% (Neutral hedge)</span>
              <span>+10% (Currency tailwind)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cost, Excise & Working Capital Levers */}
        <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#071B3A] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#F59E0B]" />
            Cost, Tax &amp; Balance Sheet Levers
          </h3>

          {/* Slider 5: Input Cost Inflation */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Input Cost Inflation (Leaf, Energy, Paper)</span>
              <span className="font-bold text-[#EF4444]">+{params.inputCostInflationPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={params.inputCostInflationPercent}
              onChange={(e) => handleSliderChange('inputCostInflationPercent', parseFloat(e.target.value))}
              className="w-full accent-[#EF4444] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>0% (Deflationary)</span>
              <span>+2.8% (Base)</span>
              <span>+12% (Severe commodity spike)</span>
            </div>
          </div>

          {/* Slider 6: Excise Tax Hike */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Government Excise Tax Indexation</span>
              <span className="font-bold text-[#EF4444]">+{params.exciseTaxHikePercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="0.5"
              value={params.exciseTaxHikePercent}
              onChange={(e) => handleSliderChange('exciseTaxHikePercent', parseFloat(e.target.value))}
              className="w-full accent-[#EF4444] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>0% (Frozen rates)</span>
              <span>+3.0% (Base inflation)</span>
              <span>+15% (Disruptive tax hike)</span>
            </div>
          </div>

          {/* Slider 7: Working Capital Days Shift */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Cash Conversion Cycle Shift (Days)</span>
              <span className="font-bold text-[#008FCB]">{params.workingCapitalDaysShift > 0 ? `+${params.workingCapitalDaysShift} Days` : `${params.workingCapitalDaysShift} Days`}</span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={params.workingCapitalDaysShift}
              onChange={(e) => handleSliderChange('workingCapitalDaysShift', parseInt(e.target.value))}
              className="w-full accent-[#008FCB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>-10 Days (Release ~£710M cash)</span>
              <span>-2 Days (Base)</span>
              <span>+10 Days (Inventory trap)</span>
            </div>
          </div>

          {/* Slider 8: Capex Shift */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#071B3A]">Capex &amp; Transformation Spend Variance</span>
              <span className="font-bold text-[#008FCB]">{params.capexShiftPercent > 0 ? `+${params.capexShiftPercent}%` : `${params.capexShiftPercent}%`}</span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="5"
              value={params.capexShiftPercent}
              onChange={(e) => handleSliderChange('capexShiftPercent', parseFloat(e.target.value))}
              className="w-full accent-[#008FCB] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8C9EB5]">
              <span>-20% (Austerity freeze)</span>
              <span>0% (Base ~£850M)</span>
              <span>+20% (Accelerate plants)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
