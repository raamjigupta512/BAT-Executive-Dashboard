import React, { useState } from 'react';
import {
  ArrowRight,
  X,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Activity,
  Globe,
  MapPin,
  Sparkles,
  Zap,
  CheckCircle2,
  DollarSign,
  Clock,
  ExternalLink,
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RegionalPerformanceItem, Currency } from '../types/dashboard';
import { CURRENCY_RATES } from '../utils/formatters';

interface RegionalPerformanceCardProps {
  data: RegionalPerformanceItem[];
  currency: Currency;
  onSelectRegion: (region: RegionalPerformanceItem) => void;
  onViewAllDetails: () => void;
}

interface RegionalHealthProfile {
  healthScore: number;
  healthGrade: 'Strong' | 'Stable' | 'Resilient' | 'Watchpoint';
  ratingCode: string;
  dsoDays: number;
  workingCapitalStatus: 'Optimal' | 'Stable' | 'Monitored';
  newCategoriesShare: string;
  freeCashFlowGbp: number; // in Billions GBP
  strategicDriver: string;
  pinCoord: { x: number; y: number; pctX: number; pctY: number; labelPos: 'right' | 'left' | 'top' | 'bottom' };
  keyHighlights: string[];
}

const REGIONAL_HEALTH_DATA: Record<string, RegionalHealthProfile> = {
  americas: {
    healthScore: 94,
    healthGrade: 'Strong',
    ratingCode: 'AAA Health',
    dsoDays: 31.8,
    workingCapitalStatus: 'Optimal',
    newCategoriesShare: '18.4% of regional rev',
    freeCashFlowGbp: 3.8,
    strategicDriver: 'US Vuse closed-vapour market leadership and premium combustible pricing power.',
    pinCoord: { x: 68, y: 60, pctX: 21.25, pctY: 30, labelPos: 'right' },
    keyHighlights: ['US Market #1 Vuse Vapour', 'Strong Operating Margin (46.2%)', 'Highest FCF Generation (£3.8B)']
  },
  europe: {
    healthScore: 89,
    healthGrade: 'Stable',
    ratingCode: 'AA Stable',
    dsoDays: 35.4,
    workingCapitalStatus: 'Stable',
    newCategoriesShare: '22.1% of regional rev',
    freeCashFlowGbp: 2.4,
    strategicDriver: 'Accelerated Velo modern oral adoption in UK/Nordics & glo Hyper Pro rollout.',
    pinCoord: { x: 160, y: 50, pctX: 50.0, pctY: 25, labelPos: 'top' },
    keyHighlights: ['Velo Modern Oral Surge', 'Top Smokeless Revenue Mix (22.1%)', 'Reliable UK/Germany Volume']
  },
  apme: {
    healthScore: 86,
    healthGrade: 'Resilient',
    ratingCode: 'A+ Resilient',
    dsoDays: 37.1,
    workingCapitalStatus: 'Stable',
    newCategoriesShare: '14.8% of regional rev',
    freeCashFlowGbp: 1.9,
    strategicDriver: 'Japan heated tobacco loyalty and Middle East travel retail volume rebound.',
    pinCoord: { x: 215, y: 82, pctX: 67.2, pctY: 41, labelPos: 'right' },
    keyHighlights: ['Japan glo Hyper Pro Adoption', 'Middle East Travel Retail Rebound', 'Resilient Combustible Cash Flows']
  },
  africa: {
    healthScore: 78,
    healthGrade: 'Watchpoint',
    ratingCode: 'BBB Monitored',
    dsoDays: 41.2,
    workingCapitalStatus: 'Monitored',
    newCategoriesShare: '5.2% of regional rev',
    freeCashFlowGbp: 0.9,
    strategicDriver: 'Solid combustible pricing power offsetting local currency translation volatility.',
    pinCoord: { x: 162, y: 122, pctX: 50.6, pctY: 61, labelPos: 'bottom' },
    keyHighlights: ['Direct Store Distribution Expansion', 'Disciplined Price Elasticity', 'Monitored Working Capital & FX']
  }
};

export const RegionalPerformanceCard: React.FC<RegionalPerformanceCardProps> = ({
  data,
  currency,
  onSelectRegion,
  onViewAllDetails,
}) => {
  const [activePopRegion, setActivePopRegion] = useState<RegionalPerformanceItem | null>(null);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  const rate = CURRENCY_RATES[currency].rateFromGbp;
  const symbol = CURRENCY_RATES[currency].symbol;

  const handlePinClick = (region: RegionalPerformanceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePopRegion?.id === region.id) {
      setActivePopRegion(null);
    } else {
      setActivePopRegion(region);
    }
  };

  const activeHealth = activePopRegion ? REGIONAL_HEALTH_DATA[activePopRegion.id] : null;

  return (
    <div
      onClick={() => setActivePopRegion(null)}
      className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs flex flex-col justify-between h-full relative select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-[#071B3A]">
            Regional Performance
          </h3>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#536B8B] bg-[#F4F8FA] px-2 py-0.5 rounded-md border border-[#DCE8F0]">
            <MapPin className="w-3 h-3 text-[#008FCB]" />
            Interactive Map Pins
          </span>
        </div>
        <button
          onClick={onViewAllDetails}
          className="text-xs font-semibold text-[#008FCB] hover:text-[#0070A0] flex items-center gap-1 transition-colors cursor-pointer group"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Content: Side-by-Side Map on Left and Performance Table on Right */}
      <div className="flex-1 flex flex-col lg:flex-row items-center gap-3 xl:gap-4 relative my-auto">
        {/* Left Side: Interactive World Map with Pins & Anchored Pop-Over Tooltip */}
        <div className="w-full lg:w-[48%] h-52 sm:h-60 flex items-center justify-center relative overflow-hidden rounded-xl bg-radial from-[#F9FCFE] to-[#EEF5FA] border border-[#E1EDF5]">
          {/* Subtle Latitude / Longitude Decorative Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#CDE2F0" strokeDasharray="3 4" strokeWidth="0.8" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#CDE2F0" strokeDasharray="3 4" strokeWidth="0.8" />
              <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#CDE2F0" strokeDasharray="3 4" strokeWidth="0.8" />
              <line x1="33%" y1="0" x2="33%" y2="100%" stroke="#CDE2F0" strokeDasharray="3 4" strokeWidth="0.8" />
              <line x1="66%" y1="0" x2="66%" y2="100%" stroke="#CDE2F0" strokeDasharray="3 4" strokeWidth="0.8" />
            </svg>
          </div>

          <svg
            viewBox="0 0 320 200"
            className="w-full h-full select-none relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Radial gradient for pin glow */}
              <radialGradient id="pin-pulse-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#008FCB" stopOpacity="0" />
              </radialGradient>
              <filter id="marker-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#071F3D" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Continents - North America */}
            <path
              d="M 35 30 Q 55 25 75 35 Q 90 48 80 75 Q 60 90 45 70 Q 30 50 35 30 Z"
              fill={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[0] && handlePinClick(data[0], e)}
            />
            {/* Central & South America */}
            <path
              d="M 70 85 Q 85 80 95 100 Q 100 130 85 165 Q 70 155 65 120 Q 60 95 70 85 Z"
              fill={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[0] && handlePinClick(data[0], e)}
            />
            {/* Europe */}
            <path
              d="M 145 32 Q 165 28 178 45 Q 180 62 165 68 Q 148 68 142 52 Q 138 40 145 32 Z"
              fill={activePopRegion?.id === 'europe' || hoveredPinId === 'europe' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'europe' || hoveredPinId === 'europe' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[1] && handlePinClick(data[1], e)}
            />
            {/* Africa */}
            <path
              d="M 148 78 Q 175 74 182 100 Q 178 135 162 160 Q 145 135 142 105 Q 142 85 148 78 Z"
              fill={activePopRegion?.id === 'africa' || hoveredPinId === 'africa' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'africa' || hoveredPinId === 'africa' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[3] && handlePinClick(data[3], e)}
            />
            {/* Asia Main */}
            <path
              d="M 185 30 Q 245 28 270 60 Q 265 100 230 105 Q 200 95 188 65 Z"
              fill={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[2] && handlePinClick(data[2], e)}
            />
            {/* Middle East & Indian Subcontinent */}
            <path
              d="M 188 70 Q 205 70 215 90 Q 202 100 188 92 Z"
              fill={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[2] && handlePinClick(data[2], e)}
            />
            {/* Australia / Oceania */}
            <path
              d="M 255 125 Q 290 120 295 148 Q 280 165 260 158 Q 250 142 255 125 Z"
              fill={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#B8DFF5' : '#D2E3EF'}
              stroke={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? '#008FCB' : '#C1D7E8'}
              strokeWidth="0.8"
              className="transition-colors duration-200 cursor-pointer"
              onClick={(e) => data[2] && handlePinClick(data[2], e)}
            />

            {/* Inter-regional Trade Vectors (Subtle connectivity) */}
            <path d="M 68 60 Q 115 40 160 50" stroke="#008FCB" strokeOpacity="0.25" strokeDasharray="2 3" strokeWidth="0.8" />
            <path d="M 160 50 Q 185 55 215 82" stroke="#008FCB" strokeOpacity="0.25" strokeDasharray="2 3" strokeWidth="0.8" />
            <path d="M 160 50 Q 160 85 162 122" stroke="#008FCB" strokeOpacity="0.25" strokeDasharray="2 3" strokeWidth="0.8" />

            {/* Sub-node: Latin America connected to Americas Hub */}
            <g opacity="0.6">
              <line x1="68" y1="60" x2="80" y2="120" stroke="#008FCB" strokeDasharray="1.5 2" strokeWidth="0.7" />
              <circle cx="80" cy="120" r="2.5" fill="#008FCB" fillOpacity="0.6" />
            </g>

            {/* Sub-node: Tokyo/East Asia connected to APME Hub */}
            <g opacity="0.6">
              <line x1="215" y1="82" x2="258" y2="65" stroke="#008FCB" strokeDasharray="1.5 2" strokeWidth="0.7" />
              <circle cx="258" cy="65" r="2.5" fill="#008FCB" fillOpacity="0.6" />
            </g>

            {/* ======================================================== */}
            {/* Interactive Pins / Markers with Teardrop Pin + Sonar Beacon */}
            {/* ======================================================== */}

            {/* 1. Americas Interactive Pin */}
            {data[0] && (
              <g
                className="cursor-pointer group"
                onClick={(e) => handlePinClick(data[0], e)}
                onMouseEnter={() => setHoveredPinId('americas')}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {/* Sonar Pulsing Radar Ring */}
                <circle cx="68" cy="60" r="16" fill="#008FCB" fillOpacity="0.18" className="animate-ping" />
                {/* Outer Glow Halo */}
                <circle
                  cx="68"
                  cy="60"
                  r={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? 12 : 9}
                  fill={activePopRegion?.id === 'americas' ? '#00D2FF' : '#008FCB'}
                  fillOpacity={activePopRegion?.id === 'americas' ? 0.35 : 0.2}
                  className="transition-all duration-200"
                />
                {/* Teardrop Pin Marker */}
                <g
                  transform={`translate(68, 60) ${activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? 'scale(1.2)' : 'scale(1)'}`}
                  className="transition-transform duration-200"
                  style={{ transformOrigin: '68px 60px' }}
                >
                  {/* Pin Body */}
                  <path
                    d="M 0 0 C -4.5 -6 -7 -9.5 -7 -13.5 C -7 -17.5 -3.8 -20.5 0 -20.5 C 3.8 -20.5 7 -17.5 7 -13.5 C 7 -9.5 4.5 -6 0 0 Z"
                    fill={activePopRegion?.id === 'americas' ? '#00D2FF' : '#008FCB'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    filter="url(#marker-shadow)"
                  />
                  {/* Pin Inner Dot */}
                  <circle cx="0" cy="-13.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="0" cy="-13.5" r="1.5" fill={activePopRegion?.id === 'americas' ? '#071F3D' : '#008FCB'} />
                </g>
                {/* Map Label Chip */}
                <rect
                  x="78"
                  y="52"
                  width="48"
                  height="14"
                  rx="3"
                  fill="#071F3D"
                  fillOpacity={activePopRegion?.id === 'americas' || hoveredPinId === 'americas' ? 0.95 : 0.75}
                  stroke={activePopRegion?.id === 'americas' ? '#00D2FF' : '#1A3D63'}
                  strokeWidth="0.8"
                />
                <text x="82" y="62" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                  Americas <tspan fill="#00D2FF">34%</tspan>
                </text>
              </g>
            )}

            {/* 2. Europe Interactive Pin */}
            {data[1] && (
              <g
                className="cursor-pointer group"
                onClick={(e) => handlePinClick(data[1], e)}
                onMouseEnter={() => setHoveredPinId('europe')}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {/* Sonar Pulsing Radar Ring */}
                <circle cx="160" cy="50" r="16" fill="#008FCB" fillOpacity="0.18" className="animate-ping" style={{ animationDelay: '0.4s' }} />
                {/* Outer Glow Halo */}
                <circle
                  cx="160"
                  cy="50"
                  r={activePopRegion?.id === 'europe' || hoveredPinId === 'europe' ? 12 : 9}
                  fill={activePopRegion?.id === 'europe' ? '#00D2FF' : '#008FCB'}
                  fillOpacity={activePopRegion?.id === 'europe' ? 0.35 : 0.2}
                  className="transition-all duration-200"
                />
                {/* Teardrop Pin Marker */}
                <g
                  transform={`translate(160, 50) ${activePopRegion?.id === 'europe' || hoveredPinId === 'europe' ? 'scale(1.2)' : 'scale(1)'}`}
                  className="transition-transform duration-200"
                  style={{ transformOrigin: '160px 50px' }}
                >
                  <path
                    d="M 0 0 C -4.5 -6 -7 -9.5 -7 -13.5 C -7 -17.5 -3.8 -20.5 0 -20.5 C 3.8 -20.5 7 -17.5 7 -13.5 C 7 -9.5 4.5 -6 0 0 Z"
                    fill={activePopRegion?.id === 'europe' ? '#00D2FF' : '#008FCB'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    filter="url(#marker-shadow)"
                  />
                  <circle cx="0" cy="-13.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="0" cy="-13.5" r="1.5" fill={activePopRegion?.id === 'europe' ? '#071F3D' : '#008FCB'} />
                </g>
                {/* Map Label Chip */}
                <rect
                  x="138"
                  y="20"
                  width="44"
                  height="14"
                  rx="3"
                  fill="#071F3D"
                  fillOpacity={activePopRegion?.id === 'europe' || hoveredPinId === 'europe' ? 0.95 : 0.75}
                  stroke={activePopRegion?.id === 'europe' ? '#00D2FF' : '#1A3D63'}
                  strokeWidth="0.8"
                />
                <text x="142" y="30" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                  Europe <tspan fill="#00D2FF">29%</tspan>
                </text>
              </g>
            )}

            {/* 3. Asia Pacific & Middle East (APME) Interactive Pin */}
            {data[2] && (
              <g
                className="cursor-pointer group"
                onClick={(e) => handlePinClick(data[2], e)}
                onMouseEnter={() => setHoveredPinId('apme')}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {/* Sonar Pulsing Radar Ring */}
                <circle cx="215" cy="82" r="16" fill="#008FCB" fillOpacity="0.18" className="animate-ping" style={{ animationDelay: '0.8s' }} />
                {/* Outer Glow Halo */}
                <circle
                  cx="215"
                  cy="82"
                  r={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? 12 : 9}
                  fill={activePopRegion?.id === 'apme' ? '#00D2FF' : '#008FCB'}
                  fillOpacity={activePopRegion?.id === 'apme' ? 0.35 : 0.2}
                  className="transition-all duration-200"
                />
                {/* Teardrop Pin Marker */}
                <g
                  transform={`translate(215, 82) ${activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? 'scale(1.2)' : 'scale(1)'}`}
                  className="transition-transform duration-200"
                  style={{ transformOrigin: '215px 82px' }}
                >
                  <path
                    d="M 0 0 C -4.5 -6 -7 -9.5 -7 -13.5 C -7 -17.5 -3.8 -20.5 0 -20.5 C 3.8 -20.5 7 -17.5 7 -13.5 C 7 -9.5 4.5 -6 0 0 Z"
                    fill={activePopRegion?.id === 'apme' ? '#00D2FF' : '#008FCB'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    filter="url(#marker-shadow)"
                  />
                  <circle cx="0" cy="-13.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="0" cy="-13.5" r="1.5" fill={activePopRegion?.id === 'apme' ? '#071F3D' : '#008FCB'} />
                </g>
                {/* Map Label Chip */}
                <rect
                  x="225"
                  y="74"
                  width="42"
                  height="14"
                  rx="3"
                  fill="#071F3D"
                  fillOpacity={activePopRegion?.id === 'apme' || hoveredPinId === 'apme' ? 0.95 : 0.75}
                  stroke={activePopRegion?.id === 'apme' ? '#00D2FF' : '#1A3D63'}
                  strokeWidth="0.8"
                />
                <text x="229" y="84" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                  APME <tspan fill="#00D2FF">25%</tspan>
                </text>
              </g>
            )}

            {/* 4. Africa Interactive Pin */}
            {data[3] && (
              <g
                className="cursor-pointer group"
                onClick={(e) => handlePinClick(data[3], e)}
                onMouseEnter={() => setHoveredPinId('africa')}
                onMouseLeave={() => setHoveredPinId(null)}
              >
                {/* Sonar Pulsing Radar Ring */}
                <circle cx="162" cy="122" r="15" fill="#56CCF2" fillOpacity="0.22" className="animate-ping" style={{ animationDelay: '1.2s' }} />
                {/* Outer Glow Halo */}
                <circle
                  cx="162"
                  cy="122"
                  r={activePopRegion?.id === 'africa' || hoveredPinId === 'africa' ? 11.5 : 8.5}
                  fill={activePopRegion?.id === 'africa' ? '#00D2FF' : '#56CCF2'}
                  fillOpacity={activePopRegion?.id === 'africa' ? 0.35 : 0.22}
                  className="transition-all duration-200"
                />
                {/* Teardrop Pin Marker */}
                <g
                  transform={`translate(162, 122) ${activePopRegion?.id === 'africa' || hoveredPinId === 'africa' ? 'scale(1.2)' : 'scale(1)'}`}
                  className="transition-transform duration-200"
                  style={{ transformOrigin: '162px 122px' }}
                >
                  <path
                    d="M 0 0 C -4.5 -6 -7 -9.5 -7 -13.5 C -7 -17.5 -3.8 -20.5 0 -20.5 C 3.8 -20.5 7 -17.5 7 -13.5 C 7 -9.5 4.5 -6 0 0 Z"
                    fill={activePopRegion?.id === 'africa' ? '#00D2FF' : '#56CCF2'}
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                    filter="url(#marker-shadow)"
                  />
                  <circle cx="0" cy="-13.5" r="2.8" fill="#FFFFFF" />
                  <circle cx="0" cy="-13.5" r="1.5" fill={activePopRegion?.id === 'africa' ? '#071F3D' : '#008FCB'} />
                </g>
                {/* Map Label Chip */}
                <rect
                  x="142"
                  y="136"
                  width="40"
                  height="14"
                  rx="3"
                  fill="#071F3D"
                  fillOpacity={activePopRegion?.id === 'africa' || hoveredPinId === 'africa' ? 0.95 : 0.75}
                  stroke={activePopRegion?.id === 'africa' ? '#00D2FF' : '#1A3D63'}
                  strokeWidth="0.8"
                />
                <text x="146" y="146" fill="#FFFFFF" fontSize="7.5" fontWeight="bold">
                  Africa <tspan fill="#56CCF2">12%</tspan>
                </text>
              </g>
            )}
          </svg>

          {/* Micro Hover Hint when hovering over pins */}
          {hoveredPinId && !activePopRegion && (
            <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none flex items-center justify-center">
              <span className="bg-[#071F3D]/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-[#1A3D63] flex items-center gap-1.5 animate-in fade-in duration-150">
                <MapPin className="w-3 h-3 text-[#00D2FF]" />
                Click pin to inspect primary financial health indicators
              </span>
            </div>
          )}

          {/* ======================================================== */}
          {/* Interactive Pop-Over Tooltip (Financial Health Indicators) */}
          {/* ======================================================== */}
          <AnimatePresence>
            {activePopRegion && activeHealth && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-1 sm:inset-1.5 z-40 bg-[#071F3D]/96 backdrop-blur-md text-white rounded-xl p-3 shadow-2xl border border-[#1A3D63] flex flex-col justify-between overflow-hidden"
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between border-b border-[#1A3D63] pb-2">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded-md bg-[#008FCB]/25 border border-[#008FCB]/50 flex items-center justify-center text-[#00D2FF] shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">
                          {activePopRegion.name}
                        </span>
                        <span className="text-[10px] text-[#00D2FF] font-semibold shrink-0">
                          ({activePopRegion.shareOfRevenue}% share)
                        </span>
                      </div>
                      <span className="text-[9.5px] text-[#8C9EB5] block truncate">
                        BAT Enterprise Regional Division
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="bg-[#12A66A]/20 text-[#22C55E] border border-[#22C55E]/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{activeHealth.healthScore}/100</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePopRegion(null)}
                      className="text-[#8C9EB5] hover:text-white p-1 rounded-md hover:bg-[#1A3D63]/50 transition-colors cursor-pointer"
                      title="Close tooltip"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Financial Health Indicators (4 Core Pillars) */}
                <div className="grid grid-cols-2 gap-1.5 my-1.5 text-[10.5px]">
                  {/* Revenue Contribution */}
                  <div className="bg-[#0A2647] p-2 rounded-lg border border-[#1E4875]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8C9EB5] text-[9.5px]">Net Revenue</span>
                      <DollarSign className="w-3 h-3 text-[#00D2FF]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-bold text-xs text-white">
                        {symbol}{(activePopRegion.revenue * rate).toFixed(1)}B
                      </span>
                      <span className="text-[9px] text-[#22C55E] font-medium">
                        +{activePopRegion.yoyGrowth}% YoY
                      </span>
                    </div>
                  </div>

                  {/* Operating Margin */}
                  <div className="bg-[#0A2647] p-2 rounded-lg border border-[#1E4875]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8C9EB5] text-[9.5px]">Operating Margin</span>
                      <Activity className="w-3 h-3 text-[#22C55E]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-bold text-xs text-[#22C55E]">
                        {activePopRegion.operatingMargin}%
                      </span>
                      <span className="text-[9px] text-[#8C9EB5]">
                        vs 44.8% Grp
                      </span>
                    </div>
                  </div>

                  {/* DSO Liquidity / Working Capital */}
                  <div className="bg-[#0A2647] p-2 rounded-lg border border-[#1E4875]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8C9EB5] text-[9.5px]">DSO Liquidity</span>
                      <Clock className="w-3 h-3 text-[#E0A82E]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-bold text-xs text-white">
                        {activeHealth.dsoDays} days
                      </span>
                      <span className="text-[9px] text-[#00D2FF] font-medium">
                        {activeHealth.workingCapitalStatus}
                      </span>
                    </div>
                  </div>

                  {/* Estimated Free Cash Flow */}
                  <div className="bg-[#0A2647] p-2 rounded-lg border border-[#1E4875]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8C9EB5] text-[9.5px]">Est. Free Cash Flow</span>
                      <TrendingUp className="w-3 h-3 text-[#00D2FF]" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="font-bold text-xs text-[#00D2FF]">
                        {symbol}{(activeHealth.freeCashFlowGbp * rate).toFixed(1)}B
                      </span>
                      <span className="text-[9px] text-[#8C9EB5]">
                        FCF Conv.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Strategic Health Driver & Smokeless Mix */}
                <div className="bg-[#06182E] p-1.5 rounded-lg border border-[#153456] flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                  <div className="truncate text-[9.5px]">
                    <span className="text-white font-semibold">Smokeless Growth: </span>
                    <span className="text-[#8C9EB5]">{activeHealth.newCategoriesShare}</span>
                  </div>
                </div>

                {/* Footer Controls: Direct Drilldown & Region Switcher */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-[#1A3D63]">
                  {/* Region Switcher Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5 shrink-0">
                    {data.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePopRegion(r);
                        }}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          r.id === activePopRegion.id
                            ? 'bg-[#00D2FF] text-[#071F3D]'
                            : 'bg-[#0A2647] text-[#8C9EB5] hover:text-white'
                        }`}
                      >
                        {r.id.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Primary Drill Down Action */}
                  <button
                    type="button"
                    onClick={() => onSelectRegion(activePopRegion)}
                    className="flex-1 py-1 px-2 bg-[#008FCB] hover:bg-[#007AB8] text-white text-[10px] font-semibold rounded-md flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-xs"
                  >
                    <span>Full Drill-Down &amp; Compare</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Regional Performance Table with Pin Indicator Interactivity */}
        <div className="w-full lg:w-[52%]">
          {/* Table Header */}
          <div className="grid grid-cols-12 text-[11.5px] font-medium text-[#7A92A9] pb-2 border-b border-[#EEF2F6]">
            <div className="col-span-5">Region &amp; Pin</div>
            <div className="col-span-4 text-center">Share of Revenue</div>
            <div className="col-span-3 text-right">Revenue</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#F4F7FA]">
            {data.map((item) => {
              const convertedRevenue = (item.revenue * rate).toFixed(1);
              const isSelected = activePopRegion?.id === item.id;
              const isHovered = hoveredPinId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={(e) => handlePinClick(item, e)}
                  onMouseEnter={() => setHoveredPinId(item.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                  className={`grid grid-cols-12 items-center py-2 text-xs text-[#071B3A] px-2 rounded-lg cursor-pointer transition-all group ${
                    isSelected
                      ? 'bg-[#EBF6FC] text-[#008FCB] border border-[#BCE0F5] shadow-xs'
                      : isHovered
                      ? 'bg-[#F4F9FD] text-[#008FCB]'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                >
                  {/* Region Name with Interactive Pin Badge */}
                  <div className="col-span-5 font-semibold group-hover:text-[#008FCB] transition-colors leading-tight pr-1 flex items-center gap-1.5">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#008FCB] text-white'
                          : isHovered
                          ? 'bg-[#CDE8F7] text-[#008FCB]'
                          : 'bg-[#EEF4F8] text-[#536B8B] group-hover:bg-[#CDE8F7] group-hover:text-[#008FCB]'
                      }`}
                      title="Click to focus map pin & view financial health"
                    >
                      <MapPin className="w-3 h-3" />
                    </span>

                    <div className="truncate">
                      {item.name === 'Asia Pacific & Middle East' ? (
                        <>
                          <span className="block truncate">Asia Pacific &amp;</span>
                          <span className="block text-[11px] text-[#536B8B] font-medium group-hover:text-[#008FCB] truncate">
                            Middle East
                          </span>
                        </>
                      ) : (
                        <span className="truncate block">{item.name}</span>
                      )}
                    </div>
                  </div>

                  {/* Share Progress Bar & Percentage Pill */}
                  <div className="col-span-4 flex items-center justify-center gap-2">
                    <div className="w-14 sm:w-16 h-2 bg-[#E2EEF5] rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.id === 'africa' ? 'bg-[#98D8F4]' : 'bg-[#008FCB]'
                        }`}
                        style={{ width: `${item.shareOfRevenue}%` }}
                      />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#536B8B] w-7 text-right">
                      {item.shareOfRevenue}%
                    </span>
                  </div>

                  {/* Converted Revenue */}
                  <div className="col-span-3 text-right font-bold text-[#071B3A]">
                    {symbol}{convertedRevenue}B
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guide Footnote */}
          <div className="mt-2.5 pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-[11px] text-[#7A92A9]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#008FCB] inline-block" />
              Pins indicate regional enterprise centers
            </span>
            <span className="text-[#008FCB] font-medium cursor-pointer hover:underline" onClick={onViewAllDetails}>
              Compare Regions →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
