# SSG Demo 说明

这个目录展示了 Next.js 15 中静态站点生成 (SSG) 的完整功能。

## 功能特性

### 1. 静态页面生成
- 所有页面在构建时预渲染为静态HTML
- 极快的加载速度和优秀的SEO表现
- 支持动态路由的静态生成

### 2. 动态路由
- `/ssg1` - 文章列表页面
- `/ssg1/[id]` - 单篇文章详情页面
- 使用 `generateStaticParams` 生成所有可能的静态路径

### 3. 元数据生成
- 使用 `generateMetadata` 为每个页面生成独特的SEO元数据
- 支持Open Graph标签
- 动态生成页面标题和描述

### 4. 组件结构
- `data.ts` - 模拟数据源
- `components/PostCard.tsx` - 文章卡片组件
- `components/PostDetail.tsx` - 文章详情组件
- `page.tsx` - 文章列表页面
- `[id]/page.tsx` - 文章详情页面

## 使用方法

1. 访问 `/ssg1` 查看文章列表
2. 点击任意文章标题查看详情页面
3. 观察页面加载速度（所有内容都是预渲染的）

## 技术要点

- **generateStaticParams**: 在构建时生成所有可能的路径参数
- **generateMetadata**: 为每个页面生成独特的元数据
- **notFound()**: 处理不存在的页面
- **TypeScript**: 完整的类型支持
- **Tailwind CSS**: 响应式设计和暗色模式支持

## 构建和部署

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

构建时，Next.js 会自动：
1. 调用 `generateStaticParams` 生成所有路径
2. 为每个路径生成静态HTML文件
3. 生成对应的元数据
4. 优化资源加载

这就是 SSG 的强大之处！ 