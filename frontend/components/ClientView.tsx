
import React from 'react';
import { UnifiedEvent, EventType, AssetClass } from '../types';
import Logo from './Logo';

interface ClientViewProps {
  events: UnifiedEvent[];
}

const ClientView: React.FC<ClientViewProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(b.transaction_time).getTime() - new Date(a.transaction_time).getTime());

  return (
    <div className="max-w-7xl mx-auto py-32 px-12 leading-relaxed bg-[#FDFDFD]">
      <header className="mb-64 text-center animate-fade-in flex flex-col items-center">
        <Logo variant="dark" withText={false} className="mb-16 scale-[2.5]" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[1em] mb-6">NUBEBE PRIVATE LEDGER-JOURNAL</p>
        <h2 className="font-serif italic text-9xl text-emerald-950 mb-12 tracking-tighter leading-none">
          私享账刊
        </h2>
        <div className="h-px w-48 bg-emerald-900/10 mx-auto mb-12"></div>
        <div className="flex items-center gap-12 text-slate-500 font-bold tracking-[0.4em] uppercase text-[13px]">
           <span>VOLUME 08</span>
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
           <span>2024 夏季刊</span>
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
           <span>GLOBAL EDITION</span>
        </div>
      </header>

      <section className="mb-80">
        <div className="flex items-center gap-6 mb-32">
           <span className="text-6xl font-serif italic text-emerald-900/20">01.</span>
           <h3 className="text-4xl font-serif font-black text-slate-900 tracking-tighter italic">资产事实：价值的精确刻度</h3>
        </div>
        
        <div className="space-y-48">
          {sortedEvents.map((event, idx) => (
            <article key={event.event_id} className="grid grid-cols-1 md:grid-cols-12 gap-24 group animate-fade-in">
              <div className="md:col-span-4 flex flex-col items-start text-left">
                <span className="text-[13px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">{event.posting_date}</span>
                <div className="w-full h-px bg-slate-100 mb-8"></div>
                <div className="space-y-4">
                  <p className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">{translateAssetClass(event.asset_class)}</p>
                  <p className="text-4xl font-mono font-black text-slate-900 leading-none">
                    {event.net_amount > 0 ? '+' : ''}{event.net_amount.toLocaleString()}
                  </p>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{event.currency} / {event.institution_name}</p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-12 text-left">
                <h4 className="font-serif text-6xl text-slate-900 leading-tight group-hover:italic transition-all duration-700">
                  {narrativeTitle(event.event_type)}
                </h4>
                <p className="text-slate-600 leading-[1.8] text-2xl font-light max-w-2xl">
                   {event.remark ? translateRemark(event.remark) : "捕捉全球市场的微小波动，将其转化为确定的财富坐标。每一笔资金流转均已通过 Nubebe 全域合规校验。"}
                </p>
                <div className="pt-6">
                  <button className="text-sm font-black uppercase text-emerald-700 border-b-2 border-emerald-700/20 pb-1 hover:tracking-[0.2em] transition-all">
                    查看溯源审计 →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-80">
        <div className="flex items-center gap-6 mb-32">
           <span className="text-6xl font-serif italic text-emerald-900/20">02.</span>
           <h3 className="text-4xl font-serif font-black text-slate-900 tracking-tighter italic">私享频道：生活的极致向往</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <LifestyleCard 
            category="ELITE ESTATE"
            title="上海 · 翠湖天地六合"
            subtitle="都市核心的宁静坐标"
            desc="翠湖天地全新力作，六合系列以极致的私密性与艺术感重塑新天地版图。Nubebe 独家持有稀缺高层复式评估建议。"
            icon="location_city"
            imageColor="bg-slate-100"
          />
          <LifestyleCard 
            category="ARTISANSHIP"
            title="爱马仕：时间的手工作法"
            subtitle="从 Birkin 到皮具艺术"
            desc="本季全球爱马仕配额趋势分析，针对 24/25 年度特别定制系列 (SO) 的合规税务规划与资产记账建议。"
            icon="shopping_bag"
            imageColor="bg-emerald-50"
          />
          <LifestyleCard 
            category="EXPEDITION"
            title="南极：跨越极境的航行"
            subtitle="私人定制极地探险"
            desc="不止于旅行，更是一场关于生命维度的探索。Nubebe 礼宾部为您对接全球顶级探险机构，确保旅途中的合规财务支持。"
            icon="explore"
            imageColor="bg-blue-50"
          />
          <LifestyleCard 
            category="CURATION"
            title="当代艺术：流动的资产"
            subtitle="艺术品金融化趋势"
            desc="如何将艺术品收藏纳入家族信托架构？解析佳士得 (Christie's) 秋季拍卖重点作品的资产配置潜力。"
            icon="palette"
            imageColor="bg-purple-50"
          />
        </div>
      </section>

      <footer className="mt-80 border-t border-slate-200 pt-48 pb-64 text-center flex flex-col items-center">
        <Logo variant="dark" withText={false} className="mb-12 opacity-30 scale-150" />
        <h5 className="font-serif italic text-5xl text-emerald-950 mb-8">财富不仅是数字，更是自由。</h5>
        <div className="flex gap-12 mb-16">
           <FooterLink label="合规事实存证" />
           <FooterLink label="礼宾定制服务" />
           <FooterLink label="全球税务优化" />
        </div>
        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[1em] mt-12">
          NUBEBE DIGITAL AUDIT OFFICE © 2024
        </p>
      </footer>
    </div>
  );
};

const LifestyleCard = ({ category, title, subtitle, desc, icon, imageColor }: any) => (
  <div className="flex flex-col text-left group cursor-pointer">
    <div className={`aspect-[4/5] ${imageColor} rounded-[40px] mb-12 flex items-center justify-center relative overflow-hidden transition-all duration-700 group-hover:scale-[1.02] shadow-sm`}>
       <span className="material-icons-round text-9xl text-slate-900/10 group-hover:scale-110 transition-transform duration-1000">{icon}</span>
       <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div className="space-y-6">
       <span className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.5em]">{category}</span>
       <h4 className="text-5xl font-serif text-slate-900 group-hover:italic transition-all">{title}</h4>
       <p className="text-xl font-bold text-slate-400">{subtitle}</p>
       <p className="text-lg text-slate-500 font-light leading-relaxed max-w-md">
         {desc}
       </p>
    </div>
  </div>
);

const FooterLink = ({ label }: { label: string }) => (
  <a href="#" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-emerald-700 transition-colors border-b border-transparent hover:border-emerald-700/20 pb-1">
    {label}
  </a>
);

const narrativeTitle = (type: EventType) => {
  const map: Record<string, string> = {
    TRADE_SELL: '流动性的优雅释放',
    TRADE_BUY: '核心资产的战略版图',
    BANK_WITHDRAWAL: '跨域资本的精准调拨',
    TRANSFER_IN: '外部价值的平稳注入',
    TRANSFER_OUT: '全球视野下的资金流转',
    CRYPTO_BUY: '数字边疆的掘金实践',
    TRUST_DISTRIBUTION: '家族传承的丰盈收获',
    INCOME: '经营智慧的内生增长',
    ASSET_ACQUISITION: '珍稀资产的永久铭记',
    ASSET_DISPOSAL: '资产组合的动态调优',
    FEE: '合规价值的持续守护'
  };
  return map[type] || '财务生命线的律动';
};

const translateAssetClass = (cls: AssetClass) => {
  const map: Record<string, string> = { 
    CASH: '货币流动性', 
    SECURITY: '权益类证券', 
    CRYPTO: '加密资产创新', 
    TRUST: '信托保护架构',
    REAL_ESTATE: '全球不动产',
    GOLD: '实物贵金属',
    ART: '另类收藏资产',
    INSURANCE: '风险隔离工具'
  };
  return map[cls] || cls;
};

const translateRemark = (remark: string) => {
  const map: Record<string, string> = {
    'Sell Tencent stock': '优化腾讯控股仓位，为后续全球科技布局腾挪流动性。',
    'Withdraw to HK bank account': '资金归集至香港离岸账户，强化跨司法管辖区支付能力。',
    'Fund received from brokerage': '券商结算资金精准入账，标志着本阶段投资指令的高效闭环。',
    'Cross-border remittance': '执行跨国资本调拨，确保全球生活方式支出与资产平衡。',
    'Crypto investment': '前瞻性布局数字资产，在波动中捕捉非对称增长机会。',
    'Buy 0.5 BTC': '配置核心加密资产，作为家族对冲法币风险的数字黄金。',
    'Quarterly Dividend Distribution': '季度性信托红利如期而至，见证财富传承架构的稳健运行。',
    'Acquisition of residential property in Hong Kong': '成功锁定香港半山核心区位，确立不动产组合的基石。',
    'Purchase of physical gold bars for vault storage': '实物金条入库，在极端不确定性中锚定物理层面的安全感。',
    'Acquisition of contemporary art piece at auction': '拍卖会落槌，将时代艺术之光纳入家族另类资产版图。',
    'Annual premium payment for offshore insurance policy': '保费缴纳完成，为家族财富的跨代传递与健康安全构建坚固防线。'
  };
  return map[remark] || remark;
}

export default ClientView;
