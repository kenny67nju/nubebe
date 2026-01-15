
import { UnifiedEvent, AssetClass, EventType, BioIdentityEvent, BioEventType, EntityGovernanceEvent, GovernanceEventType, LegalStructure, JurisdictionType, VerificationStatus, CashFlowNature } from './types';

export const mockEvents: UnifiedEvent[] = [
  // 1. 腾讯股票卖出 (离岸/个人/投资)
  {
    event_id: 'evt_001',
    client_id: 'CLIENT_001',
    event_type: EventType.TRADE_SELL,
    asset_class: AssetClass.SECURITY,
    transaction_time: '2024-06-01 09:30:00',
    posting_date: '2024-06-01',
    asset_name: 'Tencent (00700)',
    institution_name: 'CMBI',
    account_id: 'CMBI_I108002',
    quantity: 10000,
    price: 385,
    gross_amount: 3850000,
    net_amount: 3850000,
    currency: 'HKD',
    functional_amount: 3500000,
    compliance_status: 'COMPLIANT',
    
    legal_structure: LegalStructure.INDIVIDUAL,
    source_country: 'HK',
    jurisdiction_type: JurisdictionType.OFFSHORE,
    verification_status: VerificationStatus.VERIFIED,
    cash_flow_nature: CashFlowNature.CAPITAL_MOVEMENT,
    purpose_category: 'INVESTMENT',
    
    remark: 'Sell Tencent stock',
    fund_flow_path: ['evt_001']
  },
  // 2. 工资收入 (境内/个人/主动收入)
  {
    event_id: 'evt_inc_001',
    client_id: 'CLIENT_001',
    event_type: EventType.INCOME,
    asset_class: AssetClass.CASH,
    transaction_time: '2024-05-15 10:00:00',
    posting_date: '2024-05-15',
    asset_name: 'Monthly Salary',
    institution_name: 'Nubebe Tech Ltd',
    account_id: 'CIB_MAIN',
    quantity: 1,
    price: 150000,
    gross_amount: 150000,
    net_amount: 105000,
    currency: 'CNY',
    functional_amount: 150000,
    compliance_status: 'COMPLIANT',
    
    legal_structure: LegalStructure.INDIVIDUAL,
    source_country: 'CN',
    jurisdiction_type: JurisdictionType.ONSHORE,
    verification_status: VerificationStatus.VERIFIED,
    cash_flow_nature: CashFlowNature.FREE_CASH_FLOW, // 暂时归类为自由现金流来源
    purpose_category: 'LIVING',

    remark: 'Wages and salaries income',
    fund_flow_path: ['evt_inc_001']
  },
  // 3. 跨境汇款 (风险/个人/生活) -> 用于 Custom View: Education (假设用于子女)
  {
    event_id: 'evt_xborder_edu',
    client_id: 'CLIENT_001',
    event_type: EventType.TRANSFER_OUT,
    asset_class: AssetClass.CASH,
    transaction_time: '2024-05-20 14:00:00',
    posting_date: '2024-05-20',
    asset_name: 'Tuition Fee Remittance',
    institution_name: 'HSBC HK',
    account_id: 'HSBC_8892',
    quantity: 1,
    price: 70000,
    gross_amount: 70000,
    net_amount: -70000, // 支出
    currency: 'USD',
    functional_amount: -507500,
    compliance_status: 'UNDER_REVIEW',

    legal_structure: LegalStructure.INDIVIDUAL,
    source_country: 'US',
    jurisdiction_type: JurisdictionType.LONG_ARM, // 汇往美国
    verification_status: VerificationStatus.RISK_FLAG, // 未完全溯源
    cash_flow_nature: CashFlowNature.MAINTENANCE_OUT,
    purpose_category: 'EDUCATION',
    project_tag: ['Harvard_Tuition_2024'],

    remark: 'Remittance to University',
    fund_flow_path: ['evt_xborder_edu']
  },
  // 4. 美股股息 (长臂管辖/信托/被动收入)
  {
    event_id: 'evt_div_us',
    client_id: 'CLIENT_001',
    event_type: EventType.DIVIDEND,
    asset_class: AssetClass.SECURITY,
    transaction_time: '2024-06-10 09:00:00',
    posting_date: '2024-06-10',
    asset_name: 'Apple Inc. Dividend',
    institution_name: 'Morgan Stanley',
    account_id: 'MS_TRUST_001',
    quantity: 1,
    price: 5000,
    gross_amount: 5000,
    net_amount: 4500, // after tax
    currency: 'USD',
    functional_amount: 32600,
    compliance_status: 'COMPLIANT',

    legal_structure: LegalStructure.TRUST, // 信托持有，隔离风险
    source_country: 'US',
    jurisdiction_type: JurisdictionType.LONG_ARM,
    verification_status: VerificationStatus.VERIFIED,
    cash_flow_nature: CashFlowNature.PASSIVE_IN,
    purpose_category: 'INVESTMENT',

    remark: 'Quarterly Dividend'
  },
  // 5. 加密货币 (离岸/个人/投资) -> Custom View: Crypto
  {
    event_id: 'evt_crypto_01',
    client_id: 'CLIENT_001',
    event_type: EventType.CRYPTO_BUY,
    asset_class: AssetClass.CRYPTO,
    transaction_time: '2024-04-01 22:00:00',
    posting_date: '2024-04-01',
    asset_name: 'Bitcoin (BTC)',
    institution_name: 'Ledger Cold Wallet',
    account_id: '0x...A1B2',
    quantity: 2.5,
    price: 65000,
    gross_amount: 162500,
    net_amount: 162500,
    currency: 'USD',
    functional_amount: 1178000,
    compliance_status: 'COMPLIANT',

    legal_structure: LegalStructure.INDIVIDUAL,
    source_country: 'SG', // 假设主体在新加坡
    jurisdiction_type: JurisdictionType.OFFSHORE,
    verification_status: VerificationStatus.VERIFIED,
    cash_flow_nature: CashFlowNature.CAPITAL_MOVEMENT,
    purpose_category: 'INVESTMENT',

    remark: 'Strategic BTC Allocation'
  },
  // 6. 慈善捐赠 (境内/个人/支出) -> Custom View: Philanthropy
  {
    event_id: 'evt_donate_01',
    client_id: 'CLIENT_001',
    event_type: EventType.DONATION,
    asset_class: AssetClass.CASH,
    transaction_time: '2024-01-20 10:00:00',
    posting_date: '2024-01-20',
    asset_name: 'Charity Foundation',
    institution_name: 'ICBC',
    account_id: 'ICBC_MAIN',
    quantity: 1,
    price: 500000,
    gross_amount: 500000,
    net_amount: -500000,
    currency: 'CNY',
    functional_amount: -500000,
    compliance_status: 'COMPLIANT',

    legal_structure: LegalStructure.INDIVIDUAL,
    source_country: 'CN',
    jurisdiction_type: JurisdictionType.ONSHORE,
    verification_status: VerificationStatus.VERIFIED,
    cash_flow_nature: CashFlowNature.FREE_CASH_FLOW, // 自由现金流支出
    purpose_category: 'PHILANTHROPY',

    remark: 'Annual Donation to Arts Foundation'
  }
];

export const mockBioEvents: BioIdentityEvent[] = [
  {
    event_id: 'bio_001',
    client_id: 'CLIENT_001',
    event_type: BioEventType.IMMIGRATION_ENTRY,
    occurrence_date: '2024-05-10',
    jurisdiction: 'China Mainland',
    document_number: 'E78901234',
    document_type: 'Passport',
    status: 'ACTIVE',
    remark: 'Standard entry'
  },
  {
    event_id: 'bio_002',
    client_id: 'CLIENT_001',
    event_type: BioEventType.TAX_RESIDENCY_CHANGE,
    occurrence_date: '2023-12-31',
    jurisdiction: 'Singapore',
    document_number: 'SG-TAX-2023',
    document_type: 'Tax Certificate',
    status: 'ACTIVE',
    remark: 'Established SG residency'
  }
];

export const mockGovEvents: EntityGovernanceEvent[] = [
  {
    event_id: 'gov_001',
    entity_id: 'ENT_BVI_01',
    entity_name: 'Lumina Holding (BVI)',
    event_type: GovernanceEventType.INCORPORATION,
    resolution_date: '2022-01-15',
    signatory: 'Mr. Alpha',
    affected_stakeholders: ['Mr. Alpha'],
    governing_law: 'BVI Law',
    compliance_tags: ['UBO_VERIFIED'],
    remark: 'Holding structure setup'
  }
];
