// Main Application Content Component
import React, { useState, useMemo, useEffect } from 'react';
import { mockEvents } from '../mockData';
import { RiskMetrics, UnifiedEvent } from '../types';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import Dashboard from './Dashboard';
import Timeline from './Timeline';
import FlowGraph from './FlowGraph';
import Reporting from './Reporting';
import RiskControl from './RiskControl';
import TrustStructure from './TrustStructure';
import TaxLogicCanvas from './TaxLogicCanvas';
import ComplianceLedger from './ComplianceLedger';
import ClientView from './ClientView';
import Assistant from './Assistant';
import EventManager from './EventManager';
import Logo from './Logo';
import { LogOut, User as UserIcon, RefreshCw } from 'lucide-react';

type TabType = 'ledger' | 'dashboard' | 'trust' | 'event_hub' | 'flows' | 'tracing' | 'tax_assessment' | 'reports' | 'monitor';
type ViewMode = 'EXPERT' | 'CLIENT';

interface SidebarItemProps {
  icon: string;
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  gold?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, sub, active, onClick, gold }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 ${
      active
        ? gold
          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-l-4 border-[var(--nubebe-gold)] shadow-lg'
          : 'bg-white/10 border-l-4 border-emerald-400'
        : 'hover:bg-white/5 border-l-4 border-transparent'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`material-icons text-2xl ${active ? (gold ? 'text-[var(--nubebe-gold)]' : 'text-emerald-400') : 'text-slate-400'}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${active ? 'text-white' : 'text-slate-300'}`}>{label}</div>
        <div className={`text-xs ${active ? 'text-slate-300' : 'text-slate-500'} truncate`}>{sub}</div>
      </div>
    </div>
  </button>
);

const SidebarDivider: React.FC = () => (
  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3"></div>
);

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('EXPERT');
  const [activeTab, setActiveTab] = useState<TabType>('ledger');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<UnifiedEvent[]>(mockEvents);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [useRealAPI, setUseRealAPI] = useState(true);

  // Try to load events from API
  useEffect(() => {
    const loadEvents = async () => {
      if (!useRealAPI) return;

      setIsLoadingEvents(true);
      try {
        const response = await eventService.getEvents({ limit: 100 });
        if (response.success && response.data) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Failed to load events from API, using mock data:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, [useRealAPI]);

  const riskMetrics: RiskMetrics = useMemo(() => {
    const large = events.filter(e => Math.abs(e.functional_amount) > 500000).length;
    const crossBorder = events.filter(e => e.currency !== 'CNY' && (e.event_type.includes('TRANSFER_OUT') || e.event_type.includes('WITHDRAWAL'))).length;
    const cryptoSuspicious = events.filter(e => e.asset_class === 'CRYPTO' && e.compliance_status !== 'COMPLIANT').length;
    const score = (large * 10) + (crossBorder * 15) + (cryptoSuspicious * 50);
    return {
      largeTransactionCount: large,
      crossBorderCount: crossBorder,
      suspiciousCryptoCount: cryptoSuspicious,
      brokenFlowCount: 0,
      totalRiskScore: score
    };
  }, [events]);

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setActiveTab('tracing');
  };

  const renderExpertContent = () => {
    switch (activeTab) {
      case 'ledger': return <ComplianceLedger />;
      case 'dashboard': return <Dashboard events={events} riskMetrics={riskMetrics} />;
      case 'trust': return <TrustStructure />;
      case 'event_hub': return <EventManager />;
      case 'flows': return <Timeline events={events} onSelectEvent={handleEventSelect} />;
      case 'tracing': return <FlowGraph events={events} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />;
      case 'tax_assessment': return <TaxLogicCanvas />;
      case 'reports': return <Reporting events={events} />;
      case 'monitor': return <RiskControl events={events} riskMetrics={riskMetrics} />;
      default: return <ComplianceLedger />;
    }
  };

  const getTabDisplayName = (tab: TabType) => {
    const map: Record<TabType, string> = {
      ledger: '全域合规账本',
      dashboard: '资产全景架构',
      trust: '法律实体矩阵',
      event_hub: '全域事件中枢',
      flows: '财务交易流水',
      tracing: '资金穿透溯源',
      tax_assessment: '全球税务测算',
      reports: '法定合规报告',
      monitor: '风险敞口监控'
    };
    return map[tab];
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-700 ${viewMode === 'CLIENT' ? 'bg-[#FDFDFD]' : ''}`}>

      {/* Sidebar */}
      {viewMode === 'EXPERT' && (
        <aside className="w-72 nubebe-sidebar flex flex-col text-slate-300 animate-fade-in relative z-50">
          <div className="p-8 h-full flex flex-col">
            <div className="mb-10 px-2 shrink-0">
              <Logo variant="light" />
            </div>

            <nav className="space-y-1.5 overflow-y-auto flex-1 scrollbar-hide pr-2 custom-scrollbar">
              <SidebarItem icon="language" label="全域合规账本" sub="心安的总账" active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} gold />
              <SidebarItem icon="dashboard" label="资产全景架构" sub="基业长青的版图" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
              <SidebarItem icon="account_balance" label="法律实体矩阵" sub="隐形的守护盾牌" active={activeTab === 'trust'} onClick={() => setActiveTab('trust')} />

              <SidebarDivider />

              <SidebarItem icon="fact_check" label="全域事件中枢" sub="铭刻家族的里程碑" active={activeTab === 'event_hub'} onClick={() => setActiveTab('event_hub')} />
              <SidebarItem icon="swap_horiz" label="财务交易流水" sub="感知财富的脉搏" active={activeTab === 'flows'} onClick={() => setActiveTab('flows')} />
              <SidebarItem icon="account_tree" label="资金穿透溯源" sub="清白财富的荣耀" active={activeTab === 'tracing'} onClick={() => setActiveTab('tracing')} />

              <SidebarDivider />

              <SidebarItem icon="architecture" label="全球税务测算" sub="运筹帷幄的从容" active={activeTab === 'tax_assessment'} onClick={() => setActiveTab('tax_assessment')} />
              <SidebarItem icon="description" label="法定合规报告" sub="通往世界的护照" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
              <SidebarItem icon="shield" label="风险敞口监控" sub="风雨未至的预判" active={activeTab === 'monitor'} onClick={() => setActiveTab('monitor')} />
            </nav>

            {/* User Info & Logout */}
            <div className="mt-auto pt-6 border-t border-white/5 shrink-0 space-y-3">
              {/* API Toggle */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-slate-400">使用真实 API</span>
                <button
                  onClick={() => setUseRealAPI(!useRealAPI)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${useRealAPI ? 'bg-emerald-500' : 'bg-slate-600'}`}
                >
                  <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${useRealAPI ? 'left-5' : 'left-1'}`} />
                </button>
              </div>

              {/* User Card */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                <div className="w-10 h-10 rounded-full bg-[var(--nubebe-gold)] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-yellow-500/20">
                  {user?.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white truncate">{user?.name || 'User'}</div>
                  <div className="text-xs text-slate-400 truncate">{user?.role || 'ADVISOR'}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="登出"
                >
                  <LogOut className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className={`shrink-0 ${viewMode === 'CLIENT' ? 'bg-white border-b border-slate-200' : 'bg-slate-900/50 border-b border-white/5'} backdrop-blur-sm`}>
          <div className="px-8 py-6 flex items-center justify-between">
            <div>
              {viewMode === 'CLIENT' && <Logo variant="dark" />}
              <h1 className={`text-2xl font-bold ${viewMode === 'CLIENT' ? 'text-slate-800' : 'text-white'}`}>
                {viewMode === 'EXPERT' ? getTabDisplayName(activeTab) : '财富日志'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Data Source Indicator */}
              {isLoadingEvents && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>加载中...</span>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-slate-800/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('EXPERT')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'EXPERT'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  专家视图
                </button>
                <button
                  onClick={() => setViewMode('CLIENT')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    viewMode === 'CLIENT'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  客户视图
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'EXPERT' ? renderExpertContent() : <ClientView events={events} />}
        </div>
      </main>

      {/* AI Assistant (Fixed Position) */}
      <Assistant />
    </div>
  );
};

export default AppContent;
