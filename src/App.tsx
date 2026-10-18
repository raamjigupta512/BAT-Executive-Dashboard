/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveOverviewView } from './components/views/ExecutiveOverviewView';
import { FinancialPerformanceView } from './components/views/FinancialPerformanceView';
import { BrandMarketShareView } from './components/views/BrandMarketShareView';
import { NewCategoriesView } from './components/views/NewCategoriesView';
import { CashWorkingCapitalView } from './components/views/CashWorkingCapitalView';
import { SupplyChainView } from './components/views/SupplyChainView';
import { RegulationEsgView } from './components/views/RegulationEsgView';
import { RiskIntelligenceView } from './components/views/RiskIntelligenceView';
import { ScenarioPlanningView } from './components/views/ScenarioPlanningView';
import { DecisionsActionsView } from './components/views/DecisionsActionsView';
import { ReportsView } from './components/views/ReportsView';

import { RiskDetailDrawer } from './components/drawers/RiskDetailDrawer';
import { ActionDetailDrawer } from './components/drawers/ActionDetailDrawer';
import { RegionalDetailModal } from './components/drawers/RegionalDetailModal';
import { AiAssistantDrawer } from './components/drawers/AiAssistantDrawer';
import { GlobalSearchModal } from './components/drawers/GlobalSearchModal';

import {
  NavigationTab,
  Currency,
  ReportingPeriod,
  RegionFilter,
  CompareWithMode,
  KpiMetric,
  RiskAlert,
  ManagementAction,
  RegionalPerformanceItem,
  ScenarioParams
} from './types/dashboard';

import {
  INITIAL_KPIS,
  MONTHLY_OUTLOOK,
  REGIONAL_DATA,
  INITIAL_RISKS,
  INITIAL_ACTIONS
} from './data/batData';

import { formatCurrencyValue, CURRENCY_RATES, calculateScenario } from './utils/formatters';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Global Filters
  const [period, setPeriod] = useState<ReportingPeriod>('FY 2025 (YTD)');
  const [currency, setCurrency] = useState<Currency>('GBP');
  const [region, setRegion] = useState<RegionFilter>('All Regions');
  const [compareWith, setCompareWith] = useState<CompareWithMode>('YoY');

  // Executive Demo Role
  const [currentRole, setCurrentRole] = useState<string>('cfo');

  // Dynamic Datasets
  const [kpis, setKpis] = useState<KpiMetric[]>(INITIAL_KPIS);
  const [monthlyData, setMonthlyData] = useState(MONTHLY_OUTLOOK);
  const [regionalData, setRegionalData] = useState<RegionalPerformanceItem[]>(REGIONAL_DATA);
  const [risks, setRisks] = useState<RiskAlert[]>(INITIAL_RISKS);
  const [actions, setActions] = useState<ManagementAction[]>(INITIAL_ACTIONS);

  // Drawers and Modals
  const [selectedRisk, setSelectedRisk] = useState<RiskAlert | null>(null);
  const [selectedAction, setSelectedAction] = useState<ManagementAction | null>(null);
  const [selectedRegionDetail, setSelectedRegionDetail] = useState<RegionalPerformanceItem | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');

  // Recompute KPIs when Currency or Region filter changes
  useEffect(() => {
    const rate = CURRENCY_RATES[currency].rateFromGbp;
    const symbol = CURRENCY_RATES[currency].symbol;

    // Filter scaling if a specific region is selected
    let regionalMultiplier = 1.0;
    if (region === 'Americas') regionalMultiplier = 0.34;
    else if (region === 'Europe') regionalMultiplier = 0.29;
    else if (region === 'Asia Pacific & Middle East') regionalMultiplier = 0.25;
    else if (region === 'Africa') regionalMultiplier = 0.12;

    setKpis(INITIAL_KPIS.map(k => {
      let rawVal = k.rawValue;
      let targetVal = k.targetValue;

      // Adjust raw value and target if region is filtered and metric is absolute
      if (region !== 'All Regions') {
        if (k.id === 'rev-ytd' || k.id === 'adj-profit' || k.id === 'op-cash-flow' || k.id === 'new-cat-rev') {
          rawVal = rawVal * regionalMultiplier;
          if (targetVal !== undefined) {
            targetVal = targetVal * regionalMultiplier;
          }
        }
      }

      // Format value with selected currency symbol and rate
      if (k.unit === 'B') {
        const converted = rawVal * rate;
        const targetConverted = targetVal !== undefined ? targetVal * rate : undefined;
        const mult = (region !== 'All Regions' ? regionalMultiplier : 1.0) * rate;

        const convertedHistory = k.history12Months?.map(h => ({
          ...h,
          value: +(h.value * mult).toFixed(2),
          target: h.target !== undefined ? +(h.target * mult).toFixed(2) : undefined,
          priorYear: h.priorYear !== undefined ? +(h.priorYear * mult).toFixed(2) : undefined,
        }));

        const convertedSparkline = k.sparkline?.map(s => +(s * mult).toFixed(2));

        return {
          ...k,
          rawValue: rawVal,
          targetValue: targetVal,
          prefix: symbol,
          value: `${symbol}${converted.toFixed(1)}B`,
          targetFormatted: targetConverted !== undefined ? `${symbol}${targetConverted.toFixed(1)}B` : k.targetFormatted,
          sparkline: convertedSparkline,
          history12Months: convertedHistory
        };
      }

      return {
        ...k,
        rawValue: rawVal,
        targetValue: targetVal
      };
    }));
  }, [currency, region]);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K) for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Risk updates
  const handleUpdateRiskStatus = (riskId: string, newStatus: RiskAlert['status']) => {
    setRisks(prev => prev.map(r => r.id === riskId ? { ...r, status: newStatus } : r));
    if (selectedRisk && selectedRisk.id === riskId) {
      setSelectedRisk(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Handlers for Management Action updates
  const handleUpdateAction = (updated: ManagementAction) => {
    setActions(prev => prev.map(a => a.id === updated.id ? updated : a));
    setSelectedAction(updated);
  };

  // Create new Management Action
  const handleCreateAction = (newActionData: Partial<ManagementAction>) => {
    const nextId = Math.max(...actions.map(a => a.id), 0) + 1;
    const newAct: ManagementAction = {
      id: nextId,
      priority: actions.length + 1,
      title: newActionData.title || 'Untitled Action',
      subtitle: newActionData.subtitle || '',
      rationale: newActionData.rationale || '',
      expectedFinancialImpact: newActionData.expectedFinancialImpact || 'To be calculated',
      owner: newActionData.owner || 'CFO Office',
      ownerRole: newActionData.ownerRole || 'Executive Sponsor',
      dueDate: newActionData.dueDate || '31 Dec 2026',
      status: (newActionData.status as any) || 'Proposed',
      alternativeOptions: newActionData.alternativeOptions || [],
      financialAssumptions: newActionData.financialAssumptions || [],
      auditHistory: newActionData.auditHistory || []
    };
    setActions(prev => [newAct, ...prev]);
  };

  // Apply scenario parameters directly to main dashboard model
  const handleApplyScenarioToDashboard = (params: ScenarioParams) => {
    const res = calculateScenario(25.9, 11.0, 8.2, params);
    const rate = CURRENCY_RATES[currency].rateFromGbp;
    const symbol = CURRENCY_RATES[currency].symbol;

    setKpis(prev => prev.map(k => {
      if (k.id === 'rev-ytd') {
        return {
          ...k,
          value: `${symbol}${(res.revenue * rate).toFixed(1)}B`,
          trend: `${res.revenueChange >= 0 ? '+' : ''}${res.revenueChange}%`,
          isPositive: res.revenueChange >= 0
        };
      }
      if (k.id === 'adj-profit') {
        return {
          ...k,
          value: `${symbol}${(res.operatingProfit * rate).toFixed(1)}B`,
          trend: `${res.operatingProfitChange >= 0 ? '+' : ''}${res.operatingProfitChange}%`,
          isPositive: res.operatingProfitChange >= 0
        };
      }
      if (k.id === 'op-margin') {
        return {
          ...k,
          value: `${res.operatingMargin}%`,
          trend: `${res.operatingMarginPpChange >= 0 ? '+' : ''}${res.operatingMarginPpChange} pp`,
          isPositive: res.operatingMarginPpChange >= 0
        };
      }
      if (k.id === 'op-cash-flow') {
        return {
          ...k,
          value: `${symbol}${(res.operatingCashFlow * rate).toFixed(1)}B`,
          trend: `${res.cashFlowChange >= 0 ? '+' : ''}${res.cashFlowChange}%`,
          isPositive: res.cashFlowChange >= 0
        };
      }
      return k;
    }));

    // Jump back to executive overview to see the impact
    setActiveTab('overview');
  };

  const handleOpenAiWithQuestion = (prompt: string) => {
    setAiInitialPrompt(prompt);
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#EEF7FB] text-[#071B3A] flex flex-col font-sans">
      {/* 1. Top Header Toolbar */}
      <Header
        onOpenAiDrawer={() => {
          setAiInitialPrompt('');
          setIsAiDrawerOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onNavigateToRisk={(riskId) => {
          const r = risks.find(x => x.id === riskId);
          if (r) setSelectedRisk(r);
        }}
      />

      {/* 2. Main App Layout: Sidebar + Main Content View */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Dark Navy Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Dynamic Center/Right Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {activeTab === 'overview' && (
            <ExecutiveOverviewView
              kpis={kpis}
              monthlyData={monthlyData}
              regionalData={regionalData}
              risks={risks}
              actions={actions}
              period={period}
              currency={currency}
              region={region}
              compareWith={compareWith}
              onPeriodChange={setPeriod}
              onCurrencyChange={setCurrency}
              onRegionChange={setRegion}
              onCompareWithChange={setCompareWith}
              onSelectRisk={setSelectedRisk}
              onSelectAction={setSelectedAction}
              onSelectRegion={setSelectedRegionDetail}
              onViewAllRisks={() => setActiveTab('risk-intelligence')}
              onViewAllActions={() => setActiveTab('decisions-actions')}
              onViewAllRegions={() => setSelectedRegionDetail(regionalData[0])}
              onAskAiQuestion={handleOpenAiWithQuestion}
            />
          )}

          {activeTab === 'financials' && (
            <FinancialPerformanceView currency={currency} period={period} />
          )}

          {activeTab === 'brands' && (
            <BrandMarketShareView currency={currency} />
          )}

          {activeTab === 'new-categories' && (
            <NewCategoriesView currency={currency} />
          )}

          {activeTab === 'cash-flow' && (
            <CashWorkingCapitalView currency={currency} />
          )}

          {activeTab === 'supply-chain' && (
            <SupplyChainView />
          )}

          {activeTab === 'regulation-esg' && (
            <RegulationEsgView />
          )}

          {activeTab === 'risk-intelligence' && (
            <RiskIntelligenceView
              risks={risks}
              onSelectRisk={setSelectedRisk}
            />
          )}

          {activeTab === 'scenario-planning' && (
            <ScenarioPlanningView
              currency={currency}
              onApplyScenarioToDashboard={handleApplyScenarioToDashboard}
            />
          )}

          {activeTab === 'decisions-actions' && (
            <DecisionsActionsView
              actions={actions}
              onReviewAction={setSelectedAction}
              onCreateAction={handleCreateAction}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView currency={currency} period={period} />
          )}
        </main>
      </div>

      {/* 3. Drawers & Modals */}
      {/* Risk Detail Drawer */}
      <RiskDetailDrawer
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onUpdateStatus={handleUpdateRiskStatus}
      />

      {/* Action Detail Drawer */}
      <ActionDetailDrawer
        action={selectedAction}
        onClose={() => setSelectedAction(null)}
        onUpdateAction={handleUpdateAction}
      />

      {/* Regional Detail Modal */}
      <RegionalDetailModal
        region={selectedRegionDetail}
        allRegions={regionalData}
        currency={currency}
        onClose={() => setSelectedRegionDetail(null)}
        onSelectRegion={setSelectedRegionDetail}
      />

      {/* Ask BAT Intelligence Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        currency={currency}
        initialQuestion={aiInitialPrompt}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSelectRisk={(r) => setSelectedRisk(r)}
        onSelectAction={(a) => setSelectedAction(a)}
        onOpenAiWithPrompt={handleOpenAiWithQuestion}
        risks={risks}
        actions={actions}
      />
    </div>
  );
}
