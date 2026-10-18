import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BarChart3, ShieldAlert, CheckSquare, Globe, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { NavigationTab, RiskAlert, ManagementAction } from '../../types/dashboard';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectRisk: (risk: RiskAlert) => void;
  onSelectAction: (action: ManagementAction) => void;
  onOpenAiWithPrompt: (prompt: string) => void;
  risks: RiskAlert[];
  actions: ManagementAction[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectRisk,
  onSelectAction,
  onOpenAiWithPrompt,
  risks,
  actions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const term = searchTerm.toLowerCase();

  // Search through navigation pages
  const modules = [
    { id: 'overview' as NavigationTab, name: 'Executive Overview', desc: 'Consolidated KPIs, outlook, regional share and risks' },
    { id: 'financials' as NavigationTab, name: 'Financial Performance', desc: 'Income statement, margin bridge, price-volume-mix' },
    { id: 'brands' as NavigationTab, name: 'Brand & Market Share', desc: 'Vuse, glo, Velo, Dunhill, Lucky Strike shares' },
    { id: 'new-categories' as NavigationTab, name: 'New Categories', desc: 'Vapour, Heated Products, Modern Oral transformation' },
    { id: 'cash-flow' as NavigationTab, name: 'Cash & Working Capital', desc: 'Operating cash flow, cash conversion cycle, DSO/DIO/DPO' },
    { id: 'supply-chain' as NavigationTab, name: 'Supply Chain', desc: 'Leaf sourcing, logistics corridors, vendor resilience' },
    { id: 'regulation-esg' as NavigationTab, name: 'Regulation & ESG', desc: 'Menthol directives, excise indices, Scope 1-3 progress' },
    { id: 'risk-intelligence' as NavigationTab, name: 'Risk Intelligence', desc: 'Risk register, financial exposure, mitigation timelines' },
    { id: 'scenario-planning' as NavigationTab, name: 'Scenario Planning', desc: 'Interactive sensitivity workbench, price/cost/FX levers' },
    { id: 'decisions-actions' as NavigationTab, name: 'Decisions & Actions', desc: 'Action register, executive approvals, audit history' },
    { id: 'reports' as NavigationTab, name: 'Reports', desc: 'Board deck briefings, printable summaries, CSV exports' }
  ].filter(m => m.name.toLowerCase().includes(term) || m.desc.toLowerCase().includes(term));

  const matchedRisks = risks.filter(r =>
    r.title.toLowerCase().includes(term) ||
    r.subtitle.toLowerCase().includes(term) ||
    r.geography.toLowerCase().includes(term)
  );

  const matchedActions = actions.filter(a =>
    a.title.toLowerCase().includes(term) ||
    a.subtitle.toLowerCase().includes(term) ||
    a.owner.toLowerCase().includes(term)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#DCE8F0] overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="p-4 border-b border-[#EEF2F6] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#536B8B]" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search markets, brands, risks, actions or ask AI..."
            className="flex-1 text-sm text-[#071B3A] placeholder-[#7A92A9] focus:outline-hidden"
          />
          <kbd className="text-[11px] font-mono text-[#8C9EB5] bg-[#F1F5F9] px-2 py-0.5 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8C9EB5] hover:text-[#071B3A] hover:bg-[#F1F5F9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {searchTerm.trim() !== '' && (
            <div
              onClick={() => {
                onOpenAiWithPrompt(searchTerm);
                onClose();
              }}
              className="p-3 bg-[#EBF6FC] hover:bg-[#DDF0FA] border border-[#BCE1F5] rounded-xl flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#008FCB]" />
                <span className="text-xs font-semibold text-[#008FCB]">
                  Ask AI: &quot;{searchTerm}&quot;
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#008FCB]" />
            </div>
          )}

          {/* Modules */}
          {modules.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-[#8C9EB5] uppercase tracking-wider block mb-2 px-1">
                Dashboard Modules ({modules.length})
              </span>
              <div className="space-y-1">
                {modules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onNavigateTab(m.id);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#F4F8FA] flex items-center justify-between text-xs text-[#071B3A] transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-[#071B3A] group-hover:text-[#008FCB]">
                        {m.name}
                      </span>
                      <p className="text-[11px] text-[#536B8B]">{m.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8C9EB5] group-hover:text-[#008FCB] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Risks */}
          {matchedRisks.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-[#8C9EB5] uppercase tracking-wider block mb-2 px-1">
                Risks &amp; Alerts ({matchedRisks.length})
              </span>
              <div className="space-y-1">
                {matchedRisks.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onSelectRisk(r);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#F4F8FA] flex items-center justify-between text-xs text-[#071B3A] transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-[#071B3A] group-hover:text-[#008FCB]">
                        {r.title}
                      </span>
                      <p className="text-[11px] text-[#536B8B]">{r.subtitle} • {r.geography}</p>
                    </div>
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                      r.severity === 'High' ? 'bg-[#FEE2E2] text-[#EF4444]' : 'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {r.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Management Actions */}
          {matchedActions.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-[#8C9EB5] uppercase tracking-wider block mb-2 px-1">
                Management Actions ({matchedActions.length})
              </span>
              <div className="space-y-1">
                {matchedActions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onSelectAction(a);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#F4F8FA] flex items-center justify-between text-xs text-[#071B3A] transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-semibold text-[#071B3A] group-hover:text-[#008FCB]">
                        {a.title}
                      </span>
                      <p className="text-[11px] text-[#536B8B]">{a.subtitle} • Owner: {a.owner}</p>
                    </div>
                    <span className="text-[10.5px] font-semibold text-[#008FCB] bg-[#EBF6FC] px-2 py-0.5 rounded">
                      {a.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {modules.length === 0 && matchedRisks.length === 0 && matchedActions.length === 0 && (
            <div className="p-8 text-center text-[#536B8B] text-xs">
              No matching records found. Try &quot;revenue&quot;, &quot;excise&quot;, &quot;Vuse&quot;, or &quot;Europe&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
