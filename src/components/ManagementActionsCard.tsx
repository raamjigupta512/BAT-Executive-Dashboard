import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ManagementAction } from '../types/dashboard';

interface ManagementActionsCardProps {
  actions: ManagementAction[];
  onReviewAction: (action: ManagementAction) => void;
  onViewAll: () => void;
}

export const ManagementActionsCard: React.FC<ManagementActionsCardProps> = ({
  actions,
  onReviewAction,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs flex flex-col justify-between h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-[#071B3A]">
          Top Management Actions
        </h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-[#008FCB] hover:text-[#0070A0] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Ranked Action Items List */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {actions.slice(0, 5).map((action) => {
          return (
            <div
              key={action.id}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors group"
            >
              {/* Priority Number Blue Circle Badge */}
              <div className="w-6 h-6 rounded-full bg-[#008FCB] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {action.priority}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-[13px] font-semibold text-[#071B3A] group-hover:text-[#008FCB] transition-colors truncate">
                  {action.title}
                </div>
                <div className="text-[11.5px] text-[#536B8B] line-clamp-1 leading-snug">
                  {action.subtitle}
                </div>
              </div>

              {/* Review Button */}
              <div className="shrink-0">
                <button
                  onClick={() => onReviewAction(action)}
                  className="px-3.5 py-1 text-xs font-semibold text-white bg-[#008FCB] hover:bg-[#007AB8] active:bg-[#006A9E] rounded-md transition-colors shadow-2xs cursor-pointer"
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
