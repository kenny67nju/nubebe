
export enum AssetClass {
  CASH = 'CASH',
  SECURITY = 'SECURITY',
  CRYPTO = 'CRYPTO',
  TRUST = 'TRUST',
  REAL_ESTATE = 'REAL_ESTATE',
  INSURANCE = 'INSURANCE',
  GOLD = 'GOLD',
  ART = 'ART',
  ALTERNATIVE = 'ALTERNATIVE'
}

export enum EventType {
  // 交易事件 (Transaction Events)
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  INCOME = 'INCOME', // 被动收入/主动收入需通过 Nature 区分
  FEE = 'FEE', // 维持性支出
  ADJUSTMENT = 'ADJUSTMENT',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  BANK_WITHDRAWAL = 'BANK_WITHDRAWAL',
  INTEREST_CREDIT = 'INTEREST_CREDIT',
  QUICK_PAYMENT = 'QUICK_PAYMENT',
  TRADE_BUY = 'TRADE_BUY',
  TRADE_SELL = 'TRADE_SELL',
  DIVIDEND = 'DIVIDEND',
  CRYPTO_BUY = 'CRYPTO_BUY',
  CRYPTO_SELL = 'CRYPTO_SELL',
  CRYPTO_TRANSFER = 'CRYPTO_TRANSFER',
  STAKING_REWARD = 'STAKING_REWARD',
  TRUST_SUBSCRIBE = 'TRUST_SUBSCRIBE',
  TRUST_DISTRIBUTION = 'TRUST_DISTRIBUTION',
  TRUST_REDEMPTION = 'TRUST_REDEMPTION',
  ASSET_ACQUISITION = 'ASSET_ACQUISITION',
  ASSET_DISPOSAL = 'ASSET_DISPOSAL',
  DONATION = 'DONATION' // 新增慈善
}

// 身份事件类型 (Bio-Identity Events)
export enum BioEventType {
  IMMIGRATION_ENTRY = 'IMMIGRATION_ENTRY',
  IMMIGRATION_EXIT = 'IMMIGRATION_EXIT',
  MARRIAGE = 'MARRIAGE',
  DIVORCE = 'DIVORCE',
  BIRTH = 'BIRTH',
  DEATH = 'DEATH',
  NATIONALITY_CHANGE = 'NATIONALITY_CHANGE',
  TAX_RESIDENCY_CHANGE = 'TAX_RESIDENCY_CHANGE'
}

// 实体治理事件类型 (Entity Governance Events)
export enum GovernanceEventType {
  INCORPORATION = 'INCORPORATION',
  DISSOLUTION = 'DISSOLUTION',
  BOARD_RESOLUTION = 'BOARD_RESOLUTION',
  SHARE_TRANSFER = 'SHARE_TRANSFER',
  CAPITAL_INCREASE = 'CAPITAL_INCREASE',
  TRUST_SETTLEMENT = 'TRUST_SETTLEMENT',
  DIRECTOR_APPOINTMENT = 'DIRECTOR_APPOINTMENT'
}

// PDF 新增维度枚举
export enum LegalStructure {
  INDIVIDUAL = 'INDIVIDUAL', // 自然人直持 (高风险)
  CORPORATE = 'CORPORATE',   // 公司持有 (有限隔离)
  TRUST = 'TRUST'            // 信托/基金会 (完全隔离)
}

export enum JurisdictionType {
  ONSHORE = 'ONSHORE',     // 境内 (CN)
  OFFSHORE = 'OFFSHORE',   // 离岸 (BVI, Cayman, SG)
  LONG_ARM = 'LONG_ARM'    // 长臂管辖 (US - FATCA/Estate Tax)
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',       // L6 证据链完整
  UNVERIFIED = 'UNVERIFIED',   // 未溯源
  RISK_FLAG = 'RISK_FLAG'      // 风险资产
}

export enum CashFlowNature {
  PASSIVE_IN = 'PASSIVE_IN',       // 睡后收入 (股息/利息/租金)
  MAINTENANCE_OUT = 'MAINTENANCE_OUT', // 刚性维持成本 (税/费/险)
  FREE_CASH_FLOW = 'FREE_CASH_FLOW', // 自由现金流
  CAPITAL_MOVEMENT = 'CAPITAL_MOVEMENT' // 本金变动
}

export interface UnifiedEvent {
  event_id: string;
  client_id: string;
  event_type: EventType;
  asset_class: AssetClass;
  transaction_time: string;
  posting_date: string;
  settle_date?: string;
  asset_name: string;
  institution_name: string;
  account_id: string;
  quantity: number;
  price: number;
  gross_amount: number;
  net_amount: number;
  currency: string;
  functional_amount: number; // Converted to base currency (CNY)
  counterparty_name?: string;
  linked_event_id?: string;
  fund_flow_path?: string[];
  
  // 原有状态保留
  compliance_status: 'COMPLIANT' | 'UNDER_REVIEW' | 'NON_COMPLIANT';
  
  // PDF 新增核心字段 (Standard 4 & Custom X)
  legal_structure: LegalStructure;
  source_country: string; // e.g., 'CN', 'US', 'SG', 'BVI'
  jurisdiction_type: JurisdictionType; 
  verification_status: VerificationStatus;
  cash_flow_nature?: CashFlowNature;
  
  // Custom X Tags
  purpose_category?: 'EDUCATION' | 'LIVING' | 'INVESTMENT' | 'PHILANTHROPY' | 'OTHER';
  project_tag?: string[]; // e.g., ['Harvard_Tuition', 'Family_Trust_A']

  remark?: string;
  raw_data?: any;
}

export interface BioIdentityEvent {
  event_id: string;
  client_id: string;
  event_type: BioEventType;
  occurrence_date: string;
  jurisdiction: string;
  document_number: string;
  document_type: string;
  expiry_date?: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'PENDING_VERIFICATION';
  remark?: string;
  witness_or_notary?: string;
}

export interface EntityGovernanceEvent {
  event_id: string;
  entity_id: string;
  entity_name: string;
  event_type: GovernanceEventType;
  resolution_date: string;
  resolution_number?: string;
  signatory: string;
  affected_stakeholders: string[];
  governing_law: string;
  compliance_tags: string[];
  remark?: string;
}

export interface RiskMetrics {
  large_transaction_count: number;
  cross_border_count: number;
  suspicious_crypto_count: number;
  broken_flow_count: number;
  total_risk_score: number;
}
