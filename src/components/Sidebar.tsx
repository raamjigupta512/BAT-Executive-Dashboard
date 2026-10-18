import React from 'react';
import {
  Home,
  BarChart3,
  TrendingUp,
  Leaf,
  Coins,
  Factory,
  ShieldCheck,
  Globe2,
  GitFork,
  CheckSquare,
  FileText
} from 'lucide-react';
import { NavigationTab } from '../types/dashboard';
import batTobaccoFieldImg from '../assets/images/bat_tobacco_field_1792146756151.jpg';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  className?: string;
}

interface NavItemDef {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'overview', label: 'Executive Overview', icon: Home },
  { id: 'financials', label: 'Financial Performance', icon: BarChart3 },
  { id: 'brands', label: 'Brand & Market Share', icon: TrendingUp },
  { id: 'new-categories', label: 'New Categories', icon: Leaf },
  { id: 'cash-flow', label: 'Cash & Working Capital', icon: Coins },
  { id: 'supply-chain', label: 'Supply Chain', icon: Factory },
  { id: 'regulation-esg', label: 'Regulation & ESG', icon: ShieldCheck },
  { id: 'risk-intelligence', label: 'Risk Intelligence', icon: Globe2 },
  { id: 'scenario-planning', label: 'Scenario Planning', icon: GitFork },
  { id: 'decisions-actions', label: 'Decisions & Actions', icon: CheckSquare },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <aside
      className={`w-64 bg-[#062544] text-[#8C9EB5] flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-70px)] sticky top-[70px] self-start border-r border-[#0C3056] ${className}`}
    >
      {/* Navigation Items List */}
      <nav className="p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-[#008FCB] text-white shadow-sm'
                  : 'hover:bg-[#0E355D] hover:text-white text-[#9DB2C9]'
              }`}
            >
              {/* Active State Indicator Pill */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#00D2FF] rounded-r" />
              )}

              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-[#7D95AF] group-hover:text-white'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Aligning Image below Reports Option: High-Resolution BAT Tobacco Field Landscape with Sunrise */}
      <div className="relative mt-2 flex-1 min-h-[260px] overflow-hidden border-t border-[#0A2E52] flex flex-col justify-end">
        {/* Background Image of Tobacco Crop Field at Sunrise */}
        <img
          src={batTobaccoFieldImg}
          alt="BAT Tobacco Field at Sunrise"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Top Fade Gradient to blend with Dark Navy Sidebar background */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#062544] via-[#062544]/60 to-transparent z-10 pointer-events-none" />

        {/* Bottom Shading Gradient to ensure pristine legibility for the typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#021326] via-[#041D37]/75 to-transparent z-10 pointer-events-none" />

        {/* Signature BAT "A BETTER TOMORROW" Brand Typography (Exact match to reference screenshot) */}
        <div className="relative z-20 p-5 pt-8">
          <h3 className="text-[15px] font-extrabold tracking-[0.24em] text-white uppercase leading-tight font-sans drop-shadow-md">
            A BETTER<br />TOMORROW
          </h3>

          <div className="text-[9px] font-semibold tracking-[0.16em] text-[#CBDDE9] mt-3 uppercase leading-[1.65] font-sans drop-shadow-sm">
            BUILDING A SMOKE-FREE<br />
            WORLD THROUGH<br />
            INNOVATION, PEOPLE<br />
            AND SUSTAINABLE GROWTH
          </div>
        </div>
      </div>
    </aside>
  );
};
