# ⚡ 快速修复指南 - 前后端连接

> 5分钟内让前端连接到后端

---

## 🎯 问题总结

**当前状态:** 前端和后端**未连接**，前端仍在使用 Mock 数据

**主要原因:**
1. ❌ ComplianceLedger 组件硬编码使用 `mockEvents`
2. ❌ AppContent 默认 `useRealAPI = false`
3. ❌ EventManager 组件硬编码使用 `mockEvents`
4. ⚠️ 缺少 `.env.local` 环境配置文件

---

## 🚀 快速修复（3个简单步骤）

### 步骤 1: 启动后端（2分钟）

```bash
# 进入后端目录
cd /home/user/nubebe/backend

# 检查是否有 .env 文件
ls -la .env

# 如果没有，创建一个
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nubebe?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=nubebe_super_secret_key_change_in_production_12345
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOF

# 如果还没安装依赖，运行：
npm install

# 生成 Prisma Client
npm run prisma:generate

# 运行迁移（创建数据库表）
npm run prisma:migrate

# 添加测试数据
npm run prisma:seed

# 启动后端
npm run dev
```

**验证后端启动成功:**
```bash
# 在另一个终端运行
curl http://localhost:5000/api/health

# 应该看到:
# {"success":true,"message":"Nubebe API is running","timestamp":"..."}
```

---

### 步骤 2: 创建前端环境配置（30秒）

```bash
# 进入前端目录
cd /home/user/nubebe/frontend

# 创建环境变量文件
cat > .env.local << 'EOF'
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Gemini API Key (可选)
GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

---

### 步骤 3: 启用 API 调用（1分钟）

**方法 A: 修改配置文件（推荐）**

```bash
cd /home/user/nubebe/frontend

# 使用 sed 命令修改 AppContent.tsx
sed -i 's/const \[useRealAPI, setUseRealAPI\] = useState(false);/const [useRealAPI, setUseRealAPI] = useState(true);/' components/AppContent.tsx

# 验证修改
grep "useRealAPI" components/AppContent.tsx
# 应该看到: const [useRealAPI, setUseRealAPI] = useState(true);
```

**方法 B: 手动修改（如果上面命令不工作）**

编辑文件：`frontend/components/AppContent.tsx`

找到第 67 行：
```typescript
const [useRealAPI, setUseRealAPI] = useState(false);
```

改为：
```typescript
const [useRealAPI, setUseRealAPI] = useState(true);
```

---

### 步骤 4: 重启前端（30秒）

```bash
cd /home/user/nubebe/frontend

# 如果前端正在运行，先停止（Ctrl+C）
# 然后重新启动
npm run dev
```

---

## ✅ 验证连接成功

### 1. 检查浏览器控制台

打开浏览器（http://localhost:3000），按 F12 打开开发者工具：

**Console 标签应该显示:**
```
✅ Successfully loaded events from API
```

**如果看到错误:**
```
⚠️ API error, using mock data: ...
```
说明后端未启动或连接失败。

---

### 2. 检查 Network 标签

在浏览器开发者工具的 Network 标签：

**应该看到:**
- ✅ 请求: `GET http://localhost:5000/api/events`
- ✅ 状态: 200 OK
- ✅ 响应: JSON 数据

**如果没有看到请求:**
- 检查 `useRealAPI` 是否为 true
- 刷新页面

---

### 3. 测试 API 端点

在终端运行：

```bash
# 测试健康检查
curl http://localhost:5000/api/health

# 测试登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"advisor@nubebe.com","password":"password123"}'

# 应该返回 token 和用户信息
```

---

## 🔧 已知问题和临时解决方案

### 问题: ComplianceLedger 仍显示 Mock 数据

**原因:**
ComplianceLedger 组件硬编码使用 `mockEvents`，需要修改代码。

**临时解决方案:**
切换到其他标签页（如"资产全景架构"、"财务交易流水"），这些页面会显示真实 API 数据。

**完整解决方案:**
需要修改 `ComplianceLedger.tsx` 组件代码（见下方）。

---

## 🛠️ 完整修复 ComplianceLedger（可选）

如果您需要让 ComplianceLedger 也显示真实数据：

### 方法 1: 使用补丁脚本

```bash
cd /home/user/nubebe/frontend/components

# 备份原文件
cp ComplianceLedger.tsx ComplianceLedger.tsx.backup

# 创建补丁
cat > compliance_ledger.patch << 'PATCH'
--- ComplianceLedger.tsx.old
+++ ComplianceLedger.tsx.new
@@ -8,7 +8,12 @@

 const COLORS = ['#10B981', '#3B82F6', '#6366F1', '#D4AF37', '#F43F5E', '#94A3B8', '#0F172A'];

-const ComplianceLedger: React.FC = () => {
+interface ComplianceLedgerProps {
+  events?: UnifiedEvent[];
+}
+
+const ComplianceLedger: React.FC<ComplianceLedgerProps> = ({ events }) => {
+  const displayEvents = events || mockEvents;
   const [activeTab, setActiveTab] = useState<'STANDARD' | 'CUSTOM'>('STANDARD');

   return (
@@ -45,7 +50,7 @@
         </div>
       </header>

-      {activeTab === 'STANDARD' ? <StandardView events={mockEvents} /> : <CustomViewBuilder events={mockEvents} />}
+      {activeTab === 'STANDARD' ? <StandardView events={displayEvents} /> : <CustomViewBuilder events={displayEvents} />}
     </div>
   );
 };
PATCH

# 应用补丁
# 注意：这个补丁可能需要手动调整行号
```

### 方法 2: 手动修改（推荐）

编辑 `frontend/components/ComplianceLedger.tsx`:

**1. 在第 10 行后添加（在 COLORS 定义后）:**
```typescript
interface ComplianceLedgerProps {
  events?: UnifiedEvent[];
}
```

**2. 修改第 12 行的组件定义:**

**修改前:**
```typescript
const ComplianceLedger: React.FC = () => {
```

**修改后:**
```typescript
const ComplianceLedger: React.FC<ComplianceLedgerProps> = ({ events }) => {
  const displayEvents = events || mockEvents;
```

**3. 修改第 48 行:**

**修改前:**
```typescript
{activeTab === 'STANDARD' ?
  <StandardView events={mockEvents} /> :
  <CustomViewBuilder events={mockEvents} />
}
```

**修改后:**
```typescript
{activeTab === 'STANDARD' ?
  <StandardView events={displayEvents} /> :
  <CustomViewBuilder events={displayEvents} />
}
```

**4. 保存并刷新浏览器**

---

## 📊 修复前后对比

### 修复前

```
用户打开应用
    ↓
前端加载
    ↓
useRealAPI = false  ❌
    ↓
使用 mockEvents
    ↓
显示假数据  ❌
```

### 修复后

```
用户打开应用
    ↓
前端加载
    ↓
useRealAPI = true  ✅
    ↓
调用 GET /api/events
    ↓
后端返回真实数据
    ↓
显示真实数据  ✅
```

---

## 🧪 完整测试流程

### 1. 测试后端 API

```bash
# 健康检查
curl http://localhost:5000/api/health

# 登录获取 token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"advisor@nubebe.com","password":"password123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# 获取事件列表
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/events
```

---

### 2. 测试前端界面

1. 打开 http://localhost:3000
2. 按 F12 打开开发者工具
3. 查看 Console 标签
4. 应该看到：`✅ Successfully loaded events from API`
5. 查看 Network 标签
6. 应该看到 API 请求

---

### 3. 测试不同页面

切换到不同标签测试：

- ✅ **资产全景架构** - 应该显示真实统计数据
- ✅ **财务交易流水** - 应该显示真实交易记录
- ✅ **风险敞口监控** - 应该显示真实风险指标
- ⚠️ **全域合规账本** - 可能仍显示 Mock 数据（需要完整修复）

---

## 🎯 成功标志

### ✅ 连接成功的迹象

1. **浏览器控制台:**
   - 看到 "Successfully loaded events from API"
   - 没有红色错误

2. **Network 标签:**
   - 看到 GET /api/events 请求
   - 状态码 200
   - 响应有数据

3. **界面显示:**
   - 侧边栏显示 "使用真实 API" 开关为开启状态
   - 数据与后端数据库一致
   - 如果后端没数据，显示空列表（不是 Mock 数据）

---

## ⚠️ 常见问题

### 问题 1: 后端启动失败

**错误:** `Error: DATABASE_URL is required`

**解决:**
```bash
cd backend
# 确保 .env 文件存在且配置了 DATABASE_URL
cat .env
```

---

### 问题 2: 数据库连接失败

**错误:** `Can't reach database server`

**解决:**
```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql
# 或
docker ps | grep postgres

# 启动 PostgreSQL
sudo systemctl start postgresql
# 或
docker start postgres
```

---

### 问题 3: CORS 错误

**错误:** `Access to fetch blocked by CORS policy`

**解决:**
检查 `backend/.env`:
```env
CORS_ORIGIN=http://localhost:3000
```

重启后端。

---

### 问题 4: 前端仍显示 Mock 数据

**检查:**
1. `useRealAPI` 是否为 true
2. 浏览器控制台是否有错误
3. Network 标签是否有 API 请求

**强制刷新:**
- Windows/Linux: Ctrl + Shift + R
- Mac: Cmd + Shift + R

---

## 📋 快速命令清单

```bash
# === 后端 ===
cd /home/user/nubebe/backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev

# === 前端 ===
cd /home/user/nubebe/frontend
# 创建 .env.local (见上文)
# 修改 AppContent.tsx useRealAPI = true
npm run dev

# === 测试 ===
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"advisor@nubebe.com","password":"password123"}'
```

---

## 🎉 下一步

修复完成后，您应该：

1. ✅ 看到前端从后端加载数据
2. ✅ 可以创建新事件
3. ✅ 可以登录系统（如果启用认证）
4. ✅ 可以查看客户列表

**享受您的全栈应用！** 🚀

---

**创建时间:** 2026-01-15
**预计修复时间:** 5分钟
