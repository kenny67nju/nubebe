# CLAUDE.md - Nubebe (牛倍贝) Codebase Guide

> **Last Updated:** 2026-01-15
> **AI Assistant Guide** for understanding and working with the Nubebe wealth management platform

---

## 🎯 Project Overview

**Nubebe (牛倍贝)** is a sophisticated wealth management and global compliance audit platform designed as a comprehensive compliance ledger system for high-net-worth individuals and wealth managers. The platform provides:

- Cross-asset tracking and fund flow visualization
- Multi-dimensional compliance and tax reporting
- Global wealth auditing and risk management
- Multi-jurisdictional financial analysis
- AI-powered compliance consultation (Google Gemini integration)

### Project Type
React-based single-page application (SPA) with TypeScript, integrated with Google AI Studio

### Current Status
- **Version:** 0.0.0 (active development)
- **Repository:** Git-based, branch: `claude/claude-md-mkfnijdpv6svjqj2-1mIlE`
- **Commits:** 2 commits (initial setup)
- **Language:** Bilingual (Chinese/English UI)

---

## 📁 Repository Structure

```
/home/user/nubebe/
├── .git/                          # Git repository
├── .vscode/
│   └── settings.json              # VSCode configuration
├── README.md                      # Root documentation (minimal)
├── CLAUDE.md                      # This file - AI assistant guide
└── frontend/                      # Main application directory
    ├── package.json               # Dependencies & npm scripts
    ├── tsconfig.json              # TypeScript configuration
    ├── vite.config.ts             # Vite build configuration
    ├── .gitignore                 # Git ignore rules
    ├── index.html                 # Entry HTML (Tailwind CDN)
    ├── index.tsx                  # React entry point
    ├── App.tsx                    # Main app (1,900+ lines)
    ├── types.ts                   # TypeScript type definitions
    ├── mockData.ts                # Mock event data
    ├── metadata.json              # AI Studio metadata
    └── components/                # React components
        ├── Dashboard.tsx           # Asset architecture dashboard
        ├── ComplianceLedger.tsx    # Master compliance view
        ├── ClientView.tsx          # Client-facing narrative
        ├── Reporting.tsx           # Compliance reporting
        ├── TransactionFactStream.tsx # Transaction streaming
        ├── TaxLogicCanvas.tsx      # Global tax calculation
        ├── Assistant.tsx           # Gemini AI chat interface
        ├── RiskControl.tsx         # Risk monitoring
        ├── TrustStructure.tsx      # Legal entity matrix
        ├── EventManager.tsx        # Event management hub
        ├── FlowGraph.tsx           # Fund flow visualization
        ├── StayTracker.tsx         # Immigration tracking
        ├── Timeline.tsx            # Transaction timeline
        └── Logo.tsx                # Brand logo component
```

### File Size Overview
- **Total Components:** ~2,600 lines across 14 component files
- **App.tsx:** 1,900+ lines (main application logic)
- **types.ts:** ~160 lines (comprehensive type system)

---

## 🛠️ Technology Stack

### Frontend Framework
- **React:** 19.2.3 (latest, with concurrent features)
- **TypeScript:** ~5.8.2 (strict mode enabled)
- **Build Tool:** Vite 6.2.0
- **Dev Server:** Port 3000 (accessible from 0.0.0.0)

### Libraries & Dependencies
- **UI Components:** Custom React components (no UI library)
- **Charts:** Recharts 3.6.0 (PieChart, AreaChart, BarChart)
- **Icons:** Lucide React 0.562.0
- **Styling:** Tailwind CSS 4+ (via CDN) + custom CSS
- **AI Integration:** @google/genai v1.34.0 (Gemini API)

### Development Tools
- **Module System:** ESNext with React JSX
- **Target:** ES2022
- **Path Aliases:** `@/*` points to frontend root
- **Node Types:** @types/node ^22.14.0

---

## 🏗️ Architecture & Design Patterns

### Application Architecture

**Dual View Mode System:**

1. **EXPERT MODE** (Dark Theme)
   - Dark sidebar with 9 functional tabs
   - Professional compliance audit interface
   - Full feature access for advisors/auditors
   - Color scheme: Dark slate with emerald/gold accents

2. **CLIENT MODE** (Light Theme)
   - Light, narrative-focused journal view
   - Simplified interface for end clients
   - Friendly, less technical presentation
   - Color scheme: White/cream background

### Component Hierarchy

```
App.tsx (Main Component)
├── ViewMode Toggle (EXPERT/CLIENT)
├── Sidebar Navigation (EXPERT mode only)
│   ├── Logo
│   └── 9 Tab Navigation Items
├── Main Content Area
│   ├── ComplianceLedger (全域合规账本)
│   ├── Dashboard (资产全景架构)
│   ├── TrustStructure (法律实体矩阵)
│   ├── EventManager (全域事件中枢)
│   ├── Timeline (财务交易流水)
│   ├── FlowGraph (资金穿透溯源)
│   ├── TaxLogicCanvas (全球税务测算)
│   ├── Reporting (法定合规报告)
│   └── RiskControl (风险敞口监控)
└── Assistant (Fixed bottom-right chatbot)
```

### State Management
- **Local State:** React `useState` hooks
- **Computed Values:** `useMemo` for expensive calculations
- **Data Flow:** Props-based (no Redux/Context yet)
- **Mock Data:** `mockEvents` array passed via props

---

## 📊 Data Models & Type System

### Core Enums (types.ts)

#### AssetClass
```typescript
CASH | SECURITY | CRYPTO | TRUST | REAL_ESTATE |
INSURANCE | GOLD | ART | ALTERNATIVE
```

#### EventType (Transaction Events)
```typescript
TRANSFER_IN | TRANSFER_OUT | INCOME | FEE |
BANK_DEPOSIT | BANK_WITHDRAWAL | INTEREST_CREDIT |
TRADE_BUY | TRADE_SELL | DIVIDEND |
CRYPTO_BUY | CRYPTO_SELL | CRYPTO_TRANSFER | STAKING_REWARD |
TRUST_SUBSCRIBE | TRUST_DISTRIBUTION | TRUST_REDEMPTION |
ASSET_ACQUISITION | ASSET_DISPOSAL | DONATION
```

#### BioEventType (Identity Events)
```typescript
IMMIGRATION_ENTRY | IMMIGRATION_EXIT | MARRIAGE | DIVORCE |
BIRTH | DEATH | NATIONALITY_CHANGE | TAX_RESIDENCY_CHANGE
```

#### GovernanceEventType (Corporate Events)
```typescript
INCORPORATION | DISSOLUTION | BOARD_RESOLUTION |
SHARE_TRANSFER | CAPITAL_INCREASE | TRUST_SETTLEMENT |
DIRECTOR_APPOINTMENT
```

#### Compliance Dimensions
```typescript
// Legal Structure
INDIVIDUAL | CORPORATE | TRUST

// Jurisdiction Type
ONSHORE | OFFSHORE | LONG_ARM

// Verification Status
VERIFIED | UNVERIFIED | RISK_FLAG

// Cash Flow Nature
PASSIVE_IN | MAINTENANCE_OUT | FREE_CASH_FLOW | CAPITAL_MOVEMENT
```

### Core Interfaces

#### UnifiedEvent (Primary Data Model)
```typescript
interface UnifiedEvent {
  // Identity
  event_id: string;
  client_id: string;

  // Transaction Details
  event_type: EventType;
  asset_class: AssetClass;
  transaction_time: string;
  posting_date: string;
  settle_date?: string;

  // Asset Information
  asset_name: string;
  institution_name: string;
  account_id: string;

  // Financial Data
  quantity: number;
  price: number;
  gross_amount: number;
  net_amount: number;
  currency: string;
  functional_amount: number; // Converted to CNY

  // Compliance Dimensions (PDF Standard 4 + Custom X)
  legal_structure: LegalStructure;
  source_country: string;
  jurisdiction_type: JurisdictionType;
  verification_status: VerificationStatus;
  cash_flow_nature?: CashFlowNature;

  // Compliance Status
  compliance_status: 'COMPLIANT' | 'UNDER_REVIEW' | 'NON_COMPLIANT';

  // Fund Flow Tracing
  counterparty_name?: string;
  linked_event_id?: string;
  fund_flow_path?: string[]; // Transaction lineage

  // Custom Tags
  purpose_category?: 'EDUCATION' | 'LIVING' | 'INVESTMENT' | 'PHILANTHROPY' | 'OTHER';
  project_tag?: string[];

  remark?: string;
  raw_data?: any;
}
```

#### RiskMetrics
```typescript
interface RiskMetrics {
  large_transaction_count: number;    // > 500K CNY
  cross_border_count: number;         // Non-CNY transfers
  suspicious_crypto_count: number;    // Non-compliant crypto
  broken_flow_count: number;          // Missing lineage
  total_risk_score: number;           // Weighted score
}
```

---

## 🎨 Styling & Design System

### Color Palette
```css
/* Primary Brand Colors */
--nubebe-emerald-900: #064e3b;    /* Dark emerald */
--nubebe-gold: #d4af37;           /* Brand gold */

/* Theme Colors */
EXPERT MODE: Dark slate backgrounds (#0f172a, #1e293b)
CLIENT MODE: Light cream (#FDFDFD)
```

### Tailwind Configuration
- **CDN:** Loaded via `index.html` (Tailwind CSS 4+)
- **Utility-First:** Heavy use of Tailwind classes
- **Custom Classes:**
  - `nubebe-sidebar` - Dark sidebar styling
  - `card-jewelry` - Premium card design
  - `animate-fade-in` - Fade-in animation
  - `gold-pulse` - Gold accent animation

### Typography
- **Primary:** Inter (body text)
- **Serif:** Playfair Display (elegant headings)
- **Chinese:** Noto Sans SC
- **Monospace:** Roboto Mono (numbers, code)

### Component Patterns
- **Rounded Corners:** `rounded-2xl`, `rounded-[32px]`
- **Shadows:** Subtle elevation (`shadow-lg`, custom shadows)
- **Glassmorphism:** `bg-white/5`, `backdrop-blur`
- **Transitions:** `transition-colors duration-700`

---

## 🔧 Development Workflow

### Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local` in `frontend/`:
   ```env
   GEMINI_API_KEY=your_google_ai_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:3000

4. **Build for Production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

### Git Workflow

**Branch Naming:**
- Development branches: `claude/claude-md-*` (AI-generated)
- Feature branches: `feature/*`
- Bug fixes: `fix/*`

**Commit Guidelines:**
- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused and atomic

**Push Protocol:**
```bash
# Always use -u flag for new branches
git push -u origin claude/claude-md-mkfnijdpv6svjqj2-1mIlE

# Retry logic: 2s, 4s, 8s, 16s backoff on network errors
```

### File Modification Rules

**DO:**
- Read existing files before modifying
- Use Edit tool for existing files
- Maintain existing code style and patterns
- Test changes thoroughly

**DON'T:**
- Create new files unnecessarily
- Use Write tool on existing files (use Edit)
- Modify multiple unrelated files in one commit
- Skip reading files before suggesting changes

---

## 🧪 Testing & Quality

### Current State
- **No test framework installed** (no Jest/Vitest)
- **No test files present**
- Manual testing only

### Future Testing Strategy
When implementing tests:
- Use Vitest (Vite-native testing)
- Test component rendering
- Test data transformations
- Test risk calculations
- Mock API calls to Gemini

### Code Quality
- **TypeScript:** Strict mode enabled
- **Linting:** No ESLint config (to be added)
- **Formatting:** No Prettier config (to be added)

---

## 🔐 Security Considerations

### API Key Management
- **Storage:** Environment variables only (`.env.local`)
- **Never commit:** API keys to version control
- **Vite Config:** Keys injected at build time

### Compliance Data
- Mock data only (no real PII in codebase)
- Production should use encrypted storage
- Consider GDPR/CCPA compliance for real data

### Common Vulnerabilities
**Avoid:**
- XSS through unsanitized HTML
- SQL injection (when DB is added)
- Insecure API endpoints
- Hardcoded secrets

---

## 🚀 AI Integration (Gemini)

### Configuration
```typescript
Model: gemini-3-pro-preview
Temperature: 0.7
System Role: Compliance Auditor
Context: Family office wealth management
```

### Assistant Features
- **Location:** Fixed bottom-right chatbot
- **Capabilities:**
  - Compliance consultation
  - Tax regulation queries
  - Document interpretation
  - Risk assessment advice
- **Interface:** Multi-turn conversation with markdown support

### API Usage
```typescript
import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
```

---

## 📝 Coding Conventions

### Naming Standards

**Files:**
- React Components: `PascalCase.tsx` (e.g., `Dashboard.tsx`)
- Utilities: `camelCase.ts` (e.g., `mockData.ts`)
- Types: `types.ts` (centralized)

**Variables & Functions:**
- React Components: `PascalCase` (e.g., `ComplianceLedger`)
- Hooks: `useCamelCase` (e.g., `useState`, `useMemo`)
- Functions: `camelCase` (e.g., `handleEventSelect`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `TRANSFER_IN`)

**Event IDs:**
- Prefix pattern: `evt_001`, `evt_inc_001`, `evt_xborder_edu`
- Sequential numbering for similar events

### React Patterns

**Component Structure:**
```typescript
// 1. Imports
import React, { useState, useMemo } from 'react';
import { UnifiedEvent } from './types';

// 2. Props Interface
interface ComponentProps {
  events: UnifiedEvent[];
  onSelectEvent?: (id: string) => void;
}

// 3. Component Definition
const Component: React.FC<ComponentProps> = ({ events, onSelectEvent }) => {
  // 4. State
  const [selected, setSelected] = useState<string | null>(null);

  // 5. Computed Values
  const filtered = useMemo(() => {
    return events.filter(e => e.compliance_status === 'COMPLIANT');
  }, [events]);

  // 6. Event Handlers
  const handleClick = (id: string) => {
    setSelected(id);
    onSelectEvent?.(id);
  };

  // 7. Render
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};

export default Component;
```

**Best Practices:**
- Functional components only (no class components)
- TypeScript for all components
- Props destructuring in function signature
- Optional chaining for callbacks (`onSelectEvent?.()`)
- Memoize expensive computations
- Keep components focused and small (<500 lines)

### TypeScript Usage

**Type Annotations:**
```typescript
// Always type function parameters
const calculate = (amount: number, rate: number): number => {
  return amount * rate;
};

// Type state variables
const [events, setEvents] = useState<UnifiedEvent[]>([]);

// Type props explicitly
interface Props {
  data: UnifiedEvent[];
}
```

**Enum Usage:**
```typescript
// Use enums for fixed sets of values
import { EventType } from './types';

if (event.event_type === EventType.TRANSFER_IN) {
  // Handle transfer in
}
```

---

## 🎯 Key Features & Flows

### 1. Compliance Ledger (全域合规账本)
**Location:** `components/ComplianceLedger.tsx`
**Purpose:** Master view of all financial events with compliance status
**Features:**
- Sortable, filterable event table
- Multi-dimensional filtering (asset class, jurisdiction, verification)
- Export to Excel/PDF
- Drill-down to fund flow tracing

### 2. Asset Architecture Dashboard (资产全景架构)
**Location:** `components/Dashboard.tsx`
**Purpose:** Visual overview of asset allocation and distribution
**Features:**
- Pie charts by asset class
- Bar charts by jurisdiction
- Risk score summary
- Total AUM (Assets Under Management)

### 3. Fund Flow Tracing (资金穿透溯源)
**Location:** `components/FlowGraph.tsx`
**Purpose:** Visualize transaction lineage and fund flow paths
**Features:**
- Network graph visualization
- Linked event highlighting
- Source-to-destination tracing
- Broken chain detection

### 4. Global Tax Assessment (全球税务测算)
**Location:** `components/TaxLogicCanvas.tsx`
**Purpose:** Multi-jurisdictional tax calculation engine
**Features:**
- Tax treaty analysis
- Residency status tracking
- Capital gains computation
- Withholding tax calculation

### 5. Risk Monitoring (风险敞口监控)
**Location:** `components/RiskControl.tsx`
**Purpose:** Real-time risk assessment dashboard
**Features:**
- Large transaction alerts (>500K CNY)
- Cross-border transfer monitoring
- Suspicious crypto activity detection
- Risk score calculation (weighted)

---

## 🔍 Common Tasks for AI Assistants

### Task 1: Adding a New Event Type
1. Add enum value to `EventType` in `types.ts`
2. Update `UnifiedEvent` interface if needed
3. Add mock event to `mockData.ts`
4. Update relevant components (Timeline, ComplianceLedger)
5. Test filtering and display

### Task 2: Creating a New Component
1. Create file in `frontend/components/`
2. Use naming convention: `PascalCase.tsx`
3. Import in `App.tsx`
4. Add to tab navigation if needed
5. Add to sidebar navigation (EXPERT mode)

### Task 3: Adding a New Compliance Filter
1. Identify filter dimension (e.g., `purpose_category`)
2. Add filter state in component
3. Update `useMemo` filter logic
4. Add UI controls (dropdown, checkboxes)
5. Test filter combinations

### Task 4: Modifying Risk Calculation
1. Locate `riskMetrics` calculation in `App.tsx:26-32`
2. Update scoring logic
3. Test with mock data
4. Verify display in `RiskControl.tsx`

### Task 5: Updating Styles
1. Check if Tailwind class exists
2. Use custom CSS variables if needed
3. Maintain design consistency (rounded corners, shadows)
4. Test in both EXPERT and CLIENT modes

---

## 📚 Important Context for AI Assistants

### Project Philosophy
- **Compliance First:** Every feature supports audit trail and regulatory compliance
- **Multi-Jurisdiction:** Design for global wealth management (CN, US, SG, BVI, etc.)
- **Transparency:** Fund flow tracing is core to platform value
- **AI-Assisted:** Gemini integration for compliance guidance

### User Personas
1. **Wealth Advisors** (Primary)
   - Need comprehensive audit tools
   - Use EXPERT mode
   - Focus on compliance and risk

2. **Family Office Clients** (Secondary)
   - Need simplified narrative view
   - Use CLIENT mode
   - Focus on understanding wealth status

3. **Compliance Officers** (Tertiary)
   - Need detailed reporting
   - Export capabilities
   - Document verification

### Business Domain Knowledge
- **Tax Residency:** Critical for multi-jurisdiction tax calculation
- **CRS/FATCA:** Global reporting standards for financial accounts
- **Source of Wealth:** Document verification and tracing
- **Legal Structures:** INDIVIDUAL < CORPORATE < TRUST (isolation hierarchy)
- **Jurisdiction Types:**
  - ONSHORE: Domestic (high tax, high regulation)
  - OFFSHORE: Low tax jurisdictions (BVI, Cayman)
  - LONG_ARM: US jurisdiction (FATCA, estate tax)

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. **No Backend:** All data is mock data in `mockData.ts`
2. **No Persistence:** State lost on page refresh
3. **No Authentication:** No user login system
4. **No Real API:** Gemini integration is frontend-only
5. **No Tests:** No automated testing yet
6. **No Database:** No data storage layer

### Future Enhancements
- Backend API (Node.js/Python)
- Database integration (PostgreSQL/MongoDB)
- User authentication (Auth0/Firebase)
- Real-time data sync
- Document upload and storage
- Multi-client support
- Automated testing suite

---

## 📞 Getting Help

### Resources
- **Frontend Docs:** React, TypeScript, Vite, Recharts
- **AI Integration:** Google Generative AI SDK docs
- **Styling:** Tailwind CSS documentation
- **Icons:** Lucide React icon library

### Debugging Tips
1. **Vite Dev Server Issues:**
   - Check port 3000 availability
   - Verify `GEMINI_API_KEY` in `.env.local`
   - Clear browser cache

2. **TypeScript Errors:**
   - Run `npm run build` to check compilation
   - Verify type imports from `types.ts`
   - Check for missing interface properties

3. **Component Not Rendering:**
   - Verify import path (use `@/` alias)
   - Check component is added to `App.tsx` switch statement
   - Verify props are passed correctly

---

## 🎓 Learning the Codebase

### Recommended Reading Order
1. **Start Here:** `types.ts` - Understand data models
2. **Then:** `mockData.ts` - See example events
3. **Next:** `App.tsx:1-100` - Understand app structure
4. **Finally:** Individual components in `components/`

### Key Files to Master
- `types.ts` - Type system (160 lines)
- `App.tsx` - Main logic (1,900 lines)
- `ComplianceLedger.tsx` - Primary feature (500 lines)
- `Dashboard.tsx` - Visualization patterns (340 lines)

### Code Reading Tips
- Focus on props interfaces first
- Understand state management patterns
- Study data transformation logic
- Learn Recharts patterns for charts

---

## 📜 Version History

### Current Version: 0.0.0
- Initial repository setup
- Core component structure
- Mock data implementation
- Basic compliance ledger
- Asset dashboard
- Gemini AI integration

### Future Roadmap
- v0.1.0: Backend API integration
- v0.2.0: User authentication
- v0.3.0: Document management
- v1.0.0: Production-ready release

---

## 🤝 Contributing Guidelines

### For AI Assistants
When making changes:
1. **Always read files first** before modifying
2. **Use Edit tool** for existing files, not Write
3. **Maintain code style** and naming conventions
4. **Test changes** manually in dev server
5. **Commit with clear messages** describing changes
6. **Never commit secrets** or API keys

### Code Review Checklist
- [ ] TypeScript types are correct
- [ ] Component props are typed
- [ ] No console.log left in code
- [ ] Tailwind classes are semantic
- [ ] No hardcoded API keys
- [ ] Comments explain "why" not "what"
- [ ] Component is <500 lines (refactor if needed)

---

## 🎯 Quick Reference

### Important Paths
```
Frontend Root:    /home/user/nubebe/frontend
Components:       /home/user/nubebe/frontend/components
Types:            /home/user/nubebe/frontend/types.ts
Mock Data:        /home/user/nubebe/frontend/mockData.ts
Vite Config:      /home/user/nubebe/frontend/vite.config.ts
```

### npm Scripts
```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables
```env
GEMINI_API_KEY   # Google AI API key (required)
```

### Key Dependencies
```json
"react": "^19.2.3",
"typescript": "~5.8.2",
"vite": "^6.2.0",
"recharts": "^3.6.0",
"@google/genai": "^1.34.0"
```

---

## 📝 Final Notes for AI Assistants

This is a **financial compliance application** handling sensitive wealth data. When working with this codebase:

- **Prioritize security** - Never expose API keys or sensitive data
- **Maintain accuracy** - Financial calculations must be precise
- **Document decisions** - Complex tax/compliance logic needs comments
- **Think globally** - Consider multi-jurisdiction implications
- **Test thoroughly** - Financial errors have serious consequences
- **Be conservative** - Don't make breaking changes without understanding impact

Remember: This platform helps families preserve and protect generational wealth. Code quality and reliability are paramount.

---

**Generated by:** Claude (Sonnet 4.5)
**For:** Nubebe (牛倍贝) Development Team
**Purpose:** AI Assistant Onboarding & Reference Guide
