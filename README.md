# 学习日志 (Study Journal)

一个使用 React + Vite 构建的学习日记应用，支持将数据保存到 Supabase 数据库。

## 功能特点

- 📝 创建、查看、删除学习记录
- 📚 科目分类和自定义科目
- 🔍 按日期和科目查询
- 📷 照片上传（保存到 Supabase Storage）
- 😊 心情记录
- 🗄️ 数据持久化（Supabase 数据库）
- 🌙 深色主题设计

## 技术栈

- **前端**: React 18 + Vite
- **数据库**: Supabase (PostgreSQL)
- **存储**: Supabase Storage
- **样式**: CSS-in-JS (内联样式)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

#### 2.1 获取 Supabase Anon Key

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制 **Project API keys** 中的 `anon` `public` key

#### 2.2 更新配置文件

编辑 `src/supabaseClient.js`，将 `YOUR_SUPABASE_ANON_KEY` 替换为你复制的 key：

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gptvcaqbedjlugetlglj.supabase.co'
const supabaseAnonKey = '你的anon key'  // 替换这里

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. 创建数据库表

在 Supabase Dashboard 的 **SQL Editor** 中执行 `database-setup.sql` 文件中的 SQL 语句：

1. 打开 `database-setup.sql` 文件
2. 复制所有内容
3. 在 Supabase Dashboard 中点击 **SQL Editor**
4. 粘贴并执行

### 4. 创建 Storage Bucket

1. 在 Supabase Dashboard 中点击 **Storage**
2. 点击 **Create a new bucket**
3. 输入名称: `study-photos`
4. 选择 **Public bucket**（公开访问）
5. 点击 **Create bucket**

### 5. 运行项目

```bash
npm run dev
```

项目将在 http://localhost:5173 运行

## 数据库表结构

### study_records（学习记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| date | DATE | 日期 |
| subject | TEXT | 科目 |
| mood | INTEGER | 心情 (0-3) |
| duration | DECIMAL(4,1) | 学习时长（小时） |
| title | TEXT | 标题 |
| content | TEXT | 内容 |
| goals | TEXT | 明日目标 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### custom_subjects（自定义科目表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| name | TEXT | 科目名称 |
| created_at | TIMESTAMP | 创建时间 |

### record_photos（照片表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL | 主键 |
| record_id | BIGINT | 关联记录ID |
| url | TEXT | 照片URL |
| name | TEXT | 照片名称 |
| created_at | TIMESTAMP | 创建时间 |

## 项目结构

```
study-journal/
├── src/
│   ├── App.jsx              # 主应用组件
│   ├── supabaseClient.js    # Supabase 客户端配置
│   ├── main.jsx             # 入口文件
│   └── index.css            # 全局样式
├── database-setup.sql       # 数据库初始化脚本
├── package.json
└── README.md
```

## 部署

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist/` 目录中。

### 部署到 Vercel

1. 安装 Vercel CLI: `npm i -g vercel`
2. 运行: `vercel`
3. 按提示操作

### 部署到 Netlify

1. 将代码推送到 GitHub
2. 在 Netlify 中导入项目
3. 设置构建命令: `npm run build`
4. 设置发布目录: `dist`

## 环境变量

建议将 Supabase 配置移到环境变量：

创建 `.env` 文件：

```env
VITE_SUPABASE_URL=https://gptvcaqbedjlugetlglj.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon key
```

然后在 `src/supabaseClient.js` 中使用：

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 许可证

MIT
