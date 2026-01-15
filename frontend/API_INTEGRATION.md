# Frontend-Backend Integration Guide

> 前后端连接指南

本指南说明如何将 Nubebe 前端与后端 API 连接。

---

## 📋 目录

- [快速开始](#快速开始)
- [API 配置](#api-配置)
- [认证系统](#认证系统)
- [API 服务](#api-服务)
- [组件集成](#组件集成)
- [测试连接](#测试连接)

---

## 🚀 快速开始

### 1. 启动后端服务器

```bash
# 进入 backend 目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接

# 运行数据库迁移
npm run prisma:migrate

# 启动后端服务器
npm run dev
```

后端将运行在 `http://localhost:5000`

### 2. 配置前端

```bash
# 进入 frontend 目录
cd frontend

# 创建环境变量文件
cp .env.example .env.local

# 编辑 .env.local
# VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. 启动前端

```bash
npm run dev
```

前端将运行在 `http://localhost:3000`

---

## ⚙️ API 配置

### 环境变量

在 `frontend/.env.local` 中配置：

```env
# 后端 API 地址
VITE_API_BASE_URL=http://localhost:5000/api

# Gemini API Key（可选）
GEMINI_API_KEY=your_api_key_here
```

### API 配置文件

配置位于 `frontend/config.ts`：

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000,
};
```

---

## 🔐 认证系统

### 启用认证

在 `frontend/index.tsx` 中修改：

```typescript
// 将 USE_AUTH 改为 true
const USE_AUTH = true; // 启用认证
```

### 使用认证

#### 1. 登录

```typescript
import { useAuth } from './contexts/AuthContext';

const { login } = useAuth();

await login({
  email: 'advisor@nubebe.com',
  password: 'password123'
});
```

#### 2. 获取当前用户

```typescript
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log('Current user:', user);
}
```

#### 3. 登出

```typescript
const { logout } = useAuth();
logout();
```

### 测试账号

后端种子数据提供以下测试账号：

- **管理员:** admin@nubebe.com / password123
- **顾问:** advisor@nubebe.com / password123

---

## 📡 API 服务

### 1. 认证服务 (authService)

位置：`frontend/services/authService.ts`

```typescript
import authService from './services/authService';

// 注册
const result = await authService.register({
  email: 'new@example.com',
  password: 'password123',
  name: 'New User',
  role: 'ADVISOR'
});

// 登录
const result = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// 获取个人信息
const response = await authService.getProfile();

// 登出
authService.logout();
```

### 2. 事件服务 (eventService)

位置：`frontend/services/eventService.ts`

```typescript
import eventService from './services/eventService';

// 获取所有事件
const response = await eventService.getEvents({
  page: 1,
  limit: 50,
  assetClass: 'CRYPTO',
  complianceStatus: 'COMPLIANT'
});

// 获取单个事件
const event = await eventService.getEventById('evt_001');

// 创建事件
const newEvent = await eventService.createEvent({
  eventId: 'evt_new_001',
  clientId: 'client_id',
  eventType: 'TRANSFER_IN',
  assetClass: 'CASH',
  // ... 其他字段
});

// 更新事件
await eventService.updateEvent('evt_001', {
  complianceStatus: 'COMPLIANT'
});

// 删除事件
await eventService.deleteEvent('evt_001');

// 获取风险指标
const riskMetrics = await eventService.getRiskMetrics();

// 获取资金流向路径
const flowPath = await eventService.getFlowPath('evt_001');
```

### 3. 客户服务 (clientService)

位置：`frontend/services/clientService.ts`

```typescript
import clientService from './services/clientService';

// 获取所有客户
const clients = await clientService.getClients();

// 获取单个客户
const client = await clientService.getClientById('client_id');

// 创建客户
const newClient = await clientService.createClient({
  clientCode: 'CLIENT_003',
  fullName: '张三',
  email: 'zhang@example.com',
  nationality: ['CN'],
  taxResidency: ['CN'],
  advisorId: 'advisor_id'
});

// 更新客户
await clientService.updateClient('client_id', {
  phone: '+86 138 0000 0000'
});

// 获取客户统计
const stats = await clientService.getClientStats('client_id');
```

---

## 🔧 组件集成

### 在组件中使用 API

#### 示例：加载事件列表

```typescript
import React, { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import { UnifiedEvent } from '../types';

const MyComponent: React.FC = () => {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents({ limit: 100 });

        if (response.success && response.data) {
          setEvents(response.data.events);
        } else {
          setError(response.error || 'Failed to load events');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.event_id}>{event.asset_name}</div>
      ))}
    </div>
  );
};
```

### 切换 Mock 数据和真实 API

在 `AppContent.tsx` 中有一个切换按钮：

```typescript
const [useRealAPI, setUseRealAPI] = useState(false);

// 在侧边栏底部显示切换按钮
<button onClick={() => setUseRealAPI(!useRealAPI)}>
  使用真实 API
</button>
```

---

## 🧪 测试连接

### 1. 测试后端健康状态

```bash
curl http://localhost:5000/api/health
```

期望响应：
```json
{
  "success": true,
  "message": "Nubebe API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. 测试登录

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "advisor@nubebe.com",
    "password": "password123"
  }'
```

### 3. 测试获取事件

```bash
# 替换 YOUR_TOKEN 为登录后获得的 token
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 API 响应格式

所有 API 响应遵循统一格式：

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

---

## 🔍 调试技巧

### 1. 检查网络请求

在浏览器开发者工具中：
1. 打开 Network（网络）标签
2. 筛选 XHR/Fetch 请求
3. 查看请求和响应详情

### 2. 查看控制台日志

```typescript
// 在 httpClient.ts 中添加调试日志
console.log('API Request:', endpoint, body);
console.log('API Response:', response);
```

### 3. 测试 API 端点

使用 Postman 或 curl 测试后端 API 是否正常工作。

---

## ⚠️ 常见问题

### CORS 错误

如果遇到 CORS 错误，检查后端 `.env` 文件：

```env
CORS_ORIGIN=http://localhost:3000
```

### 认证失败

1. 确认后端服务器正在运行
2. 检查 JWT_SECRET 是否配置
3. 确认测试账号存在（运行 `npm run prisma:seed`）

### 连接超时

检查 `frontend/config.ts` 中的超时设置：

```typescript
TIMEOUT: 30000, // 30 秒
```

---

## 🚀 生产环境配置

### 前端

```env
VITE_API_BASE_URL=https://api.nubebe.com/api
```

### 后端

确保配置：
- 正确的 DATABASE_URL
- 强密码的 JWT_SECRET
- 生产环境的 CORS_ORIGIN
- 启用 HTTPS

---

## 📚 更多资源

- [后端 API 文档](../backend/README.md)
- [Prisma 文档](https://www.prisma.io/docs)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)

---

**更新日期:** 2026-01-15
