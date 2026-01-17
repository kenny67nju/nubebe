# 🔍 前后端连接诊断报告

> Nubebe 前后端 API 连接问题分析和解决方案

---

## ⚠️ 问题诊断

### 当前状态
前端代码**已经实现了API集成功能**，但存在以下问题导致**实际未使用后端API**：

---

## 🐛 主要问题

### 问题 1: ComplianceLedger 组件硬编码使用 Mock 数据

**位置:** `frontend/components/ComplianceLedger.tsx:7-8, 48`

**问题代码:**
```typescript
// 第7行：直接导入 mockEvents
import { mockEvents } from '../mockData';

// 第48行：硬编码使用 mockEvents
{activeTab === 'STANDARD' ?
  <StandardView events={mockEvents} /> :
  <CustomViewBuilder events={mockEvents} />
}
```

**问题说明:**
- ComplianceLedger 组件不接受 `events` 作为 props
- 直接导入并使用 `mockEvents`
- 即使 AppContent 从 API 获取了数据，ComplianceLedger 也会忽略

---

### 问题 2: 默认使用 Mock 数据

**位置:** `frontend/components/AppContent.tsx:65-67`

**当前代码:**
```typescript
const [events, setEvents] = useState<UnifiedEvent[]>(mockEvents);
const [isLoadingEvents, setIsLoadingEvents] = useState(false);
const [useRealAPI, setUseRealAPI] = useState(false);  // ❌ 默认 false
```

**问题说明:**
- `useRealAPI` 默认为 `false`
- 只有手动切换开关才会调用 API
- 用户不知道有这个开关

---

### 问题 3: 缺少环境变量配置

**位置:** `frontend/` 目录

**问题:**
```bash
# 只有示例文件
frontend/.env.example  ✅ 存在

# 缺少实际配置文件
frontend/.env.local    ❌ 不存在
```

**影响:**
- API base URL 使用默认值（http://localhost:5000/api）
- 如果后端端口不是 5000，将无法连接

---

### 问题 4: 后端可能未启动

**需要检查:**
- 后端服务器是否运行
- 数据库是否配置
- 是否运行了迁移和种子数据

---

## 📊 API 调用流程分析

### 当前流程（未连接）

```
用户打开应用
    ↓
AppContent 组件加载
    ↓
useRealAPI = false  ← 默认不使用 API
    ↓
events = mockEvents ← 使用本地 Mock 数据
    ↓
渲染 ComplianceLedger
    ↓
ComplianceLedger 忽略传入的 events
    ↓
直接使用 mockEvents  ← 硬编码
    ↓
显示 Mock 数据 ❌
```

### 理想流程（应该连接）

```
用户打开应用
    ↓
AppContent 组件加载
    ↓
useRealAPI = true  ← 自动使用 API
    ↓
调用 eventService.getEvents()
    ↓
HTTP GET /api/events
    ↓
后端返回数据
    ↓
setEvents(response.data.events)
    ↓
传递给 ComplianceLedger
    ↓
ComplianceLedger 使用传入的 events ← 需要修复
    ↓
显示真实数据 ✅
```

---

## 🔧 解决方案

### 方案 1: 快速修复（推荐）- 修改 ComplianceLedger

**需要修改的文件:**
- `frontend/components/ComplianceLedger.tsx`

**修改步骤:**

#### 步骤 1: 添加 Props 接口

```typescript
// 在文件开头添加
interface ComplianceLedgerProps {
  events?: UnifiedEvent[];  // 可选，支持向后兼容
}

const ComplianceLedger: React.FC<ComplianceLedgerProps> = ({ events }) => {
  // 使用传入的 events，如果没有则使用 mockEvents
  const displayEvents = events || mockEvents;

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-fade-in pb-32">
      {/* ... */}
      {activeTab === 'STANDARD' ?
        <StandardView events={displayEvents} /> :   // ✅ 使用 displayEvents
        <CustomViewBuilder events={displayEvents} />  // ✅ 使用 displayEvents
      }
    </div>
  );
};
```

#### 步骤 2: 更新 AppContent 传递数据

**位置:** `frontend/components/AppContent.tsx:105-115`

**修改:**
```typescript
const renderExpertContent = () => {
  switch (activeTab) {
    case 'ledger':
      return <ComplianceLedger events={events} />;  // ✅ 传递 events
    case 'dashboard':
      return <Dashboard events={events} riskMetrics={riskMetrics} />;
    // ... 其他 case
  }
};
```

---

### 方案 2: 默认启用 API 调用

**位置:** `frontend/components/AppContent.tsx:67`

**修改:**
```typescript
// 修改前
const [useRealAPI, setUseRealAPI] = useState(false);

// 修改后
const [useRealAPI, setUseRealAPI] = useState(true);  // ✅ 默认启用 API
```

**优点:**
- 一行代码修改
- 自动使用后端 API

**缺点:**
- 如果后端未启动会报错
- 需要确保后端可用

---

### 方案 3: 创建环境变量文件

**位置:** `frontend/.env.local`

**创建文件:**
```bash
cd frontend
cp .env.example .env.local
```

**编辑内容:**
```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5000/api

# Gemini API Key (optional)
GEMINI_API_KEY=your_api_key_here
```

---

### 方案 4: 智能降级策略

**建议修改:** `frontend/components/AppContent.tsx`

```typescript
useEffect(() => {
  const loadEvents = async () => {
    setIsLoadingEvents(true);
    try {
      // 自动尝试从 API 加载
      const response = await eventService.getEvents({ limit: 100 });
      if (response.success && response.data) {
        setEvents(response.data.events);
        setUseRealAPI(true);  // 标记为使用 API
        console.log('✅ Successfully loaded events from API');
      } else {
        // API 失败，使用 Mock 数据
        console.warn('⚠️ API failed, using mock data');
        setEvents(mockEvents);
        setUseRealAPI(false);
      }
    } catch (error) {
      // 网络错误，使用 Mock 数据
      console.warn('⚠️ API error, using mock data:', error);
      setEvents(mockEvents);
      setUseRealAPI(false);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  loadEvents();  // 组件加载时自动调用
}, []);  // 只在组件挂载时执行一次
```

---

## 📋 完整修复步骤

### 步骤 1: 启动后端服务器

```bash
# 进入 backend 目录
cd backend

# 安装依赖（如果还没安装）
npm install

# 配置环境变量
cp .env.example .env

# 编辑 .env 文件
nano .env
# 或
vi .env

# 配置数据库连接
# DATABASE_URL="postgresql://username:password@localhost:5432/nubebe"
# JWT_SECRET="your_secret_key_here"

# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# 种子测试数据
npm run prisma:seed

# 启动后端
npm run dev
```

**验证后端启动成功:**
```bash
curl http://localhost:5000/api/health

# 期望输出:
# {
#   "success": true,
#   "message": "Nubebe API is running",
#   "timestamp": "2024-01-15T..."
# }
```

---

### 步骤 2: 配置前端环境变量

```bash
# 进入 frontend 目录
cd frontend

# 创建环境变量文件
cp .env.example .env.local

# 编辑文件
nano .env.local

# 内容:
# VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 步骤 3: 修复 ComplianceLedger 组件

**选项 A: 手动修改**

编辑 `frontend/components/ComplianceLedger.tsx`:

1. 在第9行后添加 Props 接口
2. 修改组件声明接受 events prop
3. 使用 `events || mockEvents`

**选项 B: 使用补丁文件（推荐）**

我将创建一个补丁文件自动应用修复。

---

### 步骤 4: 启用 API 调用

**选项 A: 默认启用（推荐）**

修改 `frontend/components/AppContent.tsx:67`:
```typescript
const [useRealAPI, setUseRealAPI] = useState(true);
```

**选项 B: 使用切换开关**

保持默认 false，通过界面切换：
- 在应用侧边栏底部找到"使用真实 API"开关
- 点击开关启用 API

---

### 步骤 5: 重启前端

```bash
cd frontend
npm run dev
```

---

### 步骤 6: 验证连接

**打开浏览器控制台:**
1. 按 F12 打开开发者工具
2. 查看 Console 标签
3. 查看 Network 标签

**验证 API 调用:**
- 应该看到 `GET http://localhost:5000/api/events` 请求
- 状态码应该是 200
- 响应包含事件数据

**验证数据显示:**
- 全域合规账本应该显示真实数据
- 如果后端有数据，应该看到事件列表
- 如果后端没数据，应该看到空列表（而不是 Mock 数据）

---

## 🧪 测试 API 连接

### 测试 1: 直接 API 测试

```bash
# 测试健康检查
curl http://localhost:5000/api/health

# 测试登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advisor@nubebe.com",
    "password": "password123"
  }'

# 保存返回的 token
TOKEN="your_token_here"

# 测试获取事件
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer $TOKEN"
```

---

### 测试 2: 前端控制台测试

**在浏览器控制台输入:**

```javascript
// 测试 API 配置
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// 测试健康检查
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);

// 测试登录
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'advisor@nubebe.com',
    password: 'password123'
  })
})
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 当前架构图

### 实际情况（未连接）

```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  AppContent                      │  │
│  │  - useRealAPI = false ❌         │  │
│  │  - events = mockEvents           │  │
│  └──────────────────────────────────┘  │
│            │                            │
│            │ events                     │
│            ↓                            │
│  ┌──────────────────────────────────┐  │
│  │  ComplianceLedger                │  │
│  │  - 忽略 props ❌                  │  │
│  │  - 直接用 mockEvents              │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ❌ NO API CALL                         │
└─────────────────────────────────────────┘


     ❌ 未连接


┌─────────────────────────────────────────┐
│         Backend (Express)               │
│                                         │
│  ✅ /api/auth/login                     │
│  ✅ /api/auth/register                  │
│  ✅ /api/events                         │
│  ✅ /api/clients                        │
│                                         │
│  🗄️  PostgreSQL Database                │
└─────────────────────────────────────────┘
```

---

### 修复后（已连接）

```
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  AppContent                      │  │
│  │  - useRealAPI = true ✅          │  │
│  │  - 调用 eventService.getEvents() │  │
│  └──────────────────────────────────┘  │
│            │                            │
│            │ HTTP GET /api/events       │
│            ↓                            │
└────────────┼────────────────────────────┘
             │
             │ ✅ API Call
             │
┌────────────┼────────────────────────────┐
│            ↓                            │
│         Backend (Express)               │
│                                         │
│  ✅ GET /api/events                     │
│     - 查询数据库                         │
│     - 返回事件列表                       │
│                                         │
│  🗄️  PostgreSQL Database                │
│     - unified_events 表                 │
└─────────────────────────────────────────┘
             │
             │ JSON Response
             ↓
┌─────────────────────────────────────────┐
│          Frontend (React)               │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  AppContent                      │  │
│  │  - setEvents(response.data) ✅   │  │
│  └──────────────────────────────────┘  │
│            │                            │
│            │ events (真实数据)          │
│            ↓                            │
│  ┌──────────────────────────────────┐  │
│  │  ComplianceLedger                │  │
│  │  - 接受 events prop ✅           │  │
│  │  - 显示真实数据                   │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🎯 推荐修复顺序

### 最小修改方案（5分钟）

1. ✅ 启动后端服务器
2. ✅ 创建 `frontend/.env.local` 文件
3. ✅ 修改 `AppContent.tsx:67` 设置 `useRealAPI = true`
4. ✅ 重启前端
5. ✅ 测试连接

**此方案问题:**
- ComplianceLedger 仍使用 Mock 数据
- 其他组件可能也有类似问题

---

### 完整修复方案（30分钟）

1. ✅ 启动后端并验证
2. ✅ 配置前端环境变量
3. ✅ 修复 ComplianceLedger 接受 props
4. ✅ 修复其他组件（如果需要）
5. ✅ 实现智能降级策略
6. ✅ 添加加载和错误状态
7. ✅ 全面测试

---

## 📝 需要修改的文件清单

| 文件 | 修改内容 | 优先级 |
|------|---------|--------|
| `frontend/.env.local` | 创建文件，配置 API URL | 🔴 必须 |
| `frontend/components/ComplianceLedger.tsx` | 接受 events prop | 🔴 必须 |
| `frontend/components/AppContent.tsx` | 默认启用 API 或智能降级 | 🟡 建议 |
| `backend/.env` | 配置数据库连接 | 🔴 必须 |

---

## 🚨 常见问题排查

### 问题 1: CORS 错误

**错误信息:**
```
Access to fetch at 'http://localhost:5000/api/events' from origin
'http://localhost:3000' has been blocked by CORS policy
```

**解决方案:**
检查 `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

---

### 问题 2: 连接超时

**错误信息:**
```
Failed to load events from API, using mock data: Request timeout
```

**解决方案:**
1. 检查后端是否启动: `curl http://localhost:5000/api/health`
2. 检查端口是否正确
3. 增加超时时间（`frontend/config.ts`）

---

### 问题 3: 401 Unauthorized

**错误信息:**
```
401 Unauthorized
```

**原因:**
- 某些端点需要认证
- 需要先登录获取 token

**解决方案:**
- 启用认证模式（`USE_AUTH = true`）
- 或修改后端路由为公开访问（不推荐）

---

### 问题 4: 数据库未连接

**错误信息:**
```
PrismaClient initialization error: Can't reach database server
```

**解决方案:**
1. 检查 PostgreSQL 是否运行
2. 检查 `DATABASE_URL` 配置
3. 运行 `npm run prisma:migrate`

---

## 📚 相关文档

- `frontend/API_INTEGRATION.md` - API 集成指南
- `backend/README.md` - 后端 API 文档
- `LOGIN_REGISTER_GUIDE.md` - 登录注册功能说明

---

**创建时间:** 2026-01-15
**状态:** 🔴 需要修复
