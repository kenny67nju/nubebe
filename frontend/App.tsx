
import React, { useState, useMemo } from 'react';
import { mockEvents } from './mockData';
import { RiskMetrics } from './types';
import Dashboard from './components/Dashboard';
import Timeline from './components/Timeline';
import FlowGraph from './components/FlowGraph';
import Reporting from './components/Reporting';
import RiskControl from './components/RiskControl';
import TrustStructure from './components/TrustStructure';
import TaxLogicCanvas from './components/TaxLogicCanvas';
import ComplianceLedger from './components/ComplianceLedger';
import ClientView from './components/ClientView';
import Assistant from './components/Assistant';
import EventManager from './components/EventManager';
import Logo from './components/Logo';

type TabType = 'ledger' | 'dashboard' | 'trust' | 'event_hub' | 'flows' | 'tracing' | 'tax_assessment' | 'reports' | 'monitor';
type ViewMode = 'EXPERT' | 'CLIENT';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('EXPERT');
  const [activeTab, setActiveTab] = useState<TabType>('ledger');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const riskMetrics: RiskMetrics = useMemo(() => {
    const large = mockEvents.filter(e => Math.abs(e.functional_amount) > 500000).length;
    const crossBorder = mockEvents.filter(e => e.currency !== 'CNY' && (e.event_type.includes('TRANSFER_OUT') || e.event_type.includes('WITHDRAWAL'))).length;
    const cryptoSuspicious = mockEvents.filter(e => e.asset_class === 'CRYPTO' && e.compliance_status !== 'COMPLIANT').length;
    const score = (large * 10) + (crossBorder * 15) + (cryptoSuspicious * 50);
    return { large_transaction_count: large, cross_border_count: crossBorder, suspicious_crypto_count: cryptoSuspicious, broken_flow_count: 0, total_risk_score: score };
  }, []);

  const handleEventSelect = (id: string) => {
    setSelectedEventId(id);
    setActiveTab('tracing');
  };

  const renderExpertContent = () => {
    switch (activeTab) {
      case 'ledger': return <ComplianceLedger />;
      case 'dashboard': return <Dashboard events={mockEvents} riskMetrics={riskMetrics} />;
      case 'trust': return <TrustStructure />;
      case 'event_hub': return <EventManager />;
      case 'flows': return <Timeline events={mockEvents} onSelectEvent={handleEventSelect} />;
      case 'tracing': return <FlowGraph events={mockEvents} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />;
      case 'tax_assessment': return <TaxLogicCanvas />;
      case 'reports': return <Reporting events={mockEvents} />;
      case 'monitor': return <RiskControl events={mockEvents} riskMetrics={riskMetrics} />;
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

      {/* 侧边栏 - 响应式宽度 */}
      {viewMode === 'EXPERT' && (
        <aside className="w-64 lg:w-72 xl:w-80 nubebe-sidebar flex flex-col text-slate-300 animate-fade-in relative z-50">
          <div className="p-4 md:p-6 lg:p-8 h-full flex flex-col">
            <div className="mb-6 lg:mb-10 px-2 shrink-0">
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

            <div className="mt-auto pt-6 border-t border-white/5 shrink-0">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
                 <div className="w-10 h-10 rounded-full bg-[var(--nubebe-gold)] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-yellow-500/20">V</div>
                 <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">VIP Auditor</p>
                    <p className="text-[10px] text-white/40 uppercase italic font-black tracking-widest">Master Audit Engine</p>
                 </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* 主区域 */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        <header className={`h-16 md:h-20 lg:h-24 flex items-center justify-between px-4 md:px-8 lg:px-12 z-50 transition-all ${viewMode === 'CLIENT' ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md border-b border-slate-100'}`}>
          <div className="flex items-center gap-4 md:gap-8 flex-1 min-w-0">
            {viewMode === 'CLIENT' && (
               <div className="flex items-center gap-2 md:gap-4 animate-fade-in min-w-0">
                 <Logo variant="dark" withText={false} />
                 <span className="font-serif italic font-black text-responsive-3xl md:text-responsive-4xl text-emerald-950 border-l border-emerald-900/10 pl-3 md:pl-6 ml-2 tracking-tight truncate">Nubebe Private Ledger-Journal</span>
               </div>
            )}
            {viewMode === 'EXPERT' && (
              <div className="text-slate-400 text-responsive-xs font-black uppercase tracking-widest flex items-center gap-2 md:gap-3 min-w-0">
                 <span className="hidden md:inline">审计中心</span> <span className="text-[var(--nubebe-gold)] text-responsive-lg">/</span> <span className="text-slate-900 text-responsive-sm font-black tracking-tight truncate">{getTabDisplayName(activeTab)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center bg-slate-100 p-1 md:p-1.5 rounded-full border border-slate-200 flex-shrink-0">
             <button
               onClick={() => setViewMode('CLIENT')}
               className={`px-3 md:px-6 lg:px-8 py-1.5 md:py-2 lg:py-2.5 rounded-full text-responsive-xs font-black tracking-wider md:tracking-widest transition-all ${viewMode === 'CLIENT' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="hidden md:inline">客户视图</span>
               <span className="md:hidden">客户</span>
             </button>
             <button
               onClick={() => setViewMode('EXPERT')}
               className={`px-3 md:px-6 lg:px-8 py-1.5 md:py-2 lg:py-2.5 rounded-full text-responsive-xs font-black tracking-wider md:tracking-widest transition-all ${viewMode === 'EXPERT' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
             >
               <span className="hidden md:inline">专家视图</span>
               <span className="md:hidden">专家</span>
             </button>
          </div>

          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
             <button className={`${viewMode === 'CLIENT' ? 'text-emerald-950 border-emerald-950 hover:bg-emerald-950 hover:text-white' : 'bg-slate-900 text-white hover:bg-black'} px-4 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 text-responsive-xs font-black uppercase tracking-widest border-2 transition-all rounded-2xl whitespace-nowrap`}>
               <span className="hidden xl:inline">导出全域审计报告</span>
               <span className="xl:hidden">导出报告</span>
             </button>
          </div>
        </header>

        <section className={`flex-1 overflow-auto transition-all custom-scrollbar ${viewMode === 'CLIENT' ? 'p-0' : 'p-4 md:p-8 lg:p-12 xl:p-16 bg-[#FDFDFD]'}`}>
          {viewMode === 'EXPERT' ? renderExpertContent() : <ClientView events={mockEvents} />}
        </section>
      </main>

      <Assistant />
    </div>
  );
};

const SidebarItem = ({ icon, label, sub, active, onClick, gold }: { icon: string, label: string, sub?: string, active?: boolean, onClick?: () => void, gold?: boolean }) => (
  <button
    onClick={onClick}
    className={`w-full group flex flex-col px-3 md:px-4 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 ${
      active
      ? 'bg-white text-slate-900 shadow-[0_15px_40px_rgba(0,0,0,0.3)]'
      : 'hover:bg-white/5 text-white/60'
    }`}
  >
    <div className="flex items-center gap-2 md:gap-4 w-full">
      <span className={`material-icons-round text-xl md:text-2xl ${gold && active ? 'text-[var(--nubebe-gold)]' : ''}`}>{icon}</span>
      <div className="flex flex-col items-start overflow-hidden flex-1 min-w-0">
        <span className="text-responsive-sm font-black tracking-tight truncate w-full">{label}</span>
        {sub && (
          <span className={`text-responsive-xs font-bold italic tracking-wider transition-opacity duration-300 ${active ? 'text-slate-400 opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'} hidden lg:block`}>
            {sub}
          </span>
        )}
      </div>
    </div>
  </button>
);

const SidebarDivider = () => (
  <div className="py-2 px-4">
    <div className="h-px w-full bg-white/5"></div>
  </div>
);

export default App;
