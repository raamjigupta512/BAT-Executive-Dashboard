import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, RefreshCw } from 'lucide-react';

interface AiInsightCardProps {
  onAskQuestion: (query: string) => void;
  reportingPeriod: string;
  currency: string;
  region: string;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({
  onAskQuestion,
  reportingPeriod,
  currency,
  region
}) => {
  const [inputVal, setInputVal] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onAskQuestion(inputVal.trim());
      setInputVal('');
    }
  };

  const handleQuickQuestion = (q: string) => {
    onAskQuestion(q);
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs flex flex-col justify-between h-full relative overflow-hidden">
      {/* Subtle background glow for AI card */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#E6F7FD] to-transparent pointer-events-none rounded-tr-xl" />

      {/* Top Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#E6F7FD] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-[#008FCB]" />
          </div>
          <h3 className="text-base font-bold text-[#071B3A]">
            AI Executive Insight
          </h3>
        </div>

        <span className="text-[10px] font-semibold tracking-wider text-[#008FCB] bg-[#EBF6FC] px-2 py-0.5 rounded-full border border-[#CDE8F7]">
          GROUNDED MODEL
        </span>
      </div>

      {/* Executive Briefing Text (faithful to screenshot) */}
      <div className="flex-1 my-1 relative z-10">
        <p className="text-[12.5px] leading-relaxed text-[#071B3A] font-normal">
          Growth remains resilient, supported by pricing and continued expansion in New Categories.
          Regulatory changes, illicit trade and currency volatility remain key watchpoints.
          Prioritize market-specific pricing scenarios and disciplined investment in transformation.
          Early indicators suggest further upside in New Categories in H2, with operating margin
          expected to remain stable within 42–43% range, barring significant regulatory headwinds.
        </p>

        {/* Supporting pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => handleQuickQuestion('What explains the revenue variance?')}
            className="text-[11px] text-[#536B8B] bg-[#F1F6FA] hover:bg-[#E2EEF5] hover:text-[#008FCB] px-2 py-0.5 rounded transition-colors cursor-pointer"
          >
            Explain revenue variance →
          </button>
          <button
            onClick={() => handleQuickQuestion('Which working capital actions have greatest impact?')}
            className="text-[11px] text-[#536B8B] bg-[#F1F6FA] hover:bg-[#E2EEF5] hover:text-[#008FCB] px-2 py-0.5 rounded transition-colors cursor-pointer"
          >
            Working capital impact →
          </button>
        </div>
      </div>

      {/* Bottom Interactive Query Input */}
      <form onSubmit={handleSubmit} className="mt-3 relative z-10">
        <div className="h-10 bg-[#F4F8FA] hover:bg-[#EAF2F7] focus-within:bg-white border border-[#DCE8F0] focus-within:border-[#008FCB] rounded-full px-3.5 flex items-center justify-between transition-all shadow-2xs group">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-[#008FCB] shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question about BAT performance..."
              className="w-full bg-transparent text-xs text-[#071B3A] placeholder-[#7A92A9] focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="w-7 h-7 rounded-full bg-[#008FCB] hover:bg-[#007AB8] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1.5 shadow-2xs"
            title="Ask BAT Intelligence"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
