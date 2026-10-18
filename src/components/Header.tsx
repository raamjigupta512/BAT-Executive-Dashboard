import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Bell, ChevronDown, Check, Shield, User, SlidersHorizontal } from 'lucide-react';
import { BATLogo } from './BATLogo';
import { DEMO_ROLES, DEMO_NOTIFICATIONS } from '../data/batData';

interface HeaderProps {
  onOpenAiDrawer: () => void;
  onOpenSearch: () => void;
  currentRole: string;
  onSelectRole: (roleId: string) => void;
  onNavigateToRisk?: (riskId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAiDrawer,
  onOpenSearch,
  currentRole,
  onSelectRole,
  onNavigateToRisk
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const activeRoleObj = DEMO_ROLES.find(r => r.id === currentRole) || DEMO_ROLES[0];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="h-[70px] bg-white border-b border-[#DCE8F0] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-6">
        <BATLogo />
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <button
          onClick={onOpenSearch}
          type="button"
          className="w-full h-11 px-4 bg-[#F2F7FA] hover:bg-[#EAF2F7] border border-[#DCE8F0] focus:border-[#008FCB] rounded-full flex items-center gap-3 text-left transition-colors cursor-text group"
        >
          <Search className="w-4 h-4 text-[#536B8B] group-hover:text-[#071B3A] shrink-0" />
          <span className="text-sm text-[#536B8B] truncate">
            Search markets, brands, performance or ask AI...
          </span>
          <kbd className="hidden sm:inline-block ml-auto text-[11px] font-mono text-[#7A92A9] bg-white border border-[#DCE8F0] px-2 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls: AI Trigger, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Ask BAT Intelligence Button */}
        <button
          onClick={onOpenAiDrawer}
          className="h-10 px-4 rounded-full bg-[#EBF6FC] hover:bg-[#DDF0FA] active:bg-[#CDE8F7] border border-[#BCE1F5] text-[#008FCB] font-medium text-sm flex items-center gap-2 transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
          title="Open AI Executive Intelligence Assistant"
        >
          <Sparkles className="w-4 h-4 text-[#00A6E8] group-hover:scale-110 transition-transform" />
          <span>Ask BAT Intelligence</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#F0F5F9] text-[#536B8B] hover:text-[#071B3A] transition-colors relative cursor-pointer"
            title="Executive Notifications & Alerts"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#EF4444] rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-84 bg-white rounded-xl shadow-xl border border-[#DCE8F0] py-3 z-50">
              <div className="px-4 pb-2 border-b border-[#EEF2F6] flex items-center justify-between">
                <span className="font-semibold text-sm text-[#071B3A]">Executive Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-[#008FCB] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (onNavigateToRisk) onNavigateToRisk('risk-1');
                      setNotifOpen(false);
                    }}
                    className={`p-3 text-left hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                      item.unread ? 'bg-[#F0F9FF]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#071B3A]">{item.title}</span>
                      <span className="text-[11px] text-[#8C9EB5]">{item.time}</span>
                    </div>
                    <p className="text-xs text-[#536B8B] mt-1 line-clamp-2">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Executive Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-lg hover:bg-[#F0F5F9] transition-colors cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-full bg-[#071F3D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {activeRoleObj.code}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-[#071B3A] leading-tight">
                {activeRoleObj.team}
              </span>
              <span className="text-[11px] text-[#536B8B] leading-tight">
                {activeRoleObj.name}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#536B8B]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-76 bg-white rounded-xl shadow-xl border border-[#DCE8F0] p-2 z-50">
              <div className="px-3 py-2 border-b border-[#EEF2F6]">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#071B3A]">
                  <Shield className="w-4 h-4 text-[#008FCB]" />
                  <span>Executive Governance & Access</span>
                </div>
                <p className="text-[11px] text-[#536B8B] mt-0.5">
                  Simulate different governance perspectives
                </p>
              </div>

              <div className="py-1">
                <span className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#8C9EB5]">
                  Select Demo Role
                </span>
                {DEMO_ROLES.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      onSelectRole(role.id);
                      setProfileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      currentRole === role.id
                        ? 'bg-[#EBF6FC] text-[#008FCB] font-semibold'
                        : 'hover:bg-[#F8FAFC] text-[#071B3A]'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{role.name}</div>
                      <div className="text-[10px] text-[#536B8B]">{role.access}</div>
                    </div>
                    {currentRole === role.id && (
                      <Check className="w-4 h-4 text-[#008FCB] shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EEF2F6] px-3 py-1 text-[11px] text-[#8C9EB5] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Protected Executive Session</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
