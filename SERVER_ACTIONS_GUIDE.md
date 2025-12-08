# Server Actions 使用指南

## 🎯 快速开始

访问 Server Actions Demo：
```
http://localhost:3000/server-action-demo
```

## 📦 已创建的文件

```
src/app/server-action-demo/
├── page.tsx           # 主页面（4 个完整示例）
├── user-form.tsx      # 使用 useFormStatus 的表单
├── todo-form.tsx      # 使用 useFormState 的表单
├── actions.ts         # 独立的 Server Actions 文件
└── README.md          # 详细文档
```

## ✨ 4 个核心 Demo

### 1. 基础 Server Action
```tsx
// 在页面中内联定义
async function addTodo(formData: FormData) {
  'use server';
  
  const text = formData.get('todo') as string;
  // 处理数据...
  
  revalidatePath('/server-action-demo');
  return { success: true };
}

// 在 JSX 中使用
<form action={addTodo}>
  <input name="todo" />
  <button type="submit">添加</button>
</form>
```

### 2. 带加载状态
```tsx
'use client';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button disabled={pending}>
      {pending ? '提交中...' : '提交'}
    </button>
  );
}
```

### 3. 提交后重定向
```tsx
async function submitAndRedirect(formData: FormData) {
  'use server';
  
  // 处理数据...
  
  redirect('/success');  // 自动跳转
}
```

### 4. 使用 useFormState
```tsx
'use client';
import { useFormState } from 'react-dom';

function MyForm() {
  const [state, formAction] = useFormState(serverAction, null);
  
  return (
    <form action={formAction}>
      {state?.error && <p>{state.error}</p>}
      <button type="submit">提交</button>
    </form>
  );
}
```

## 🔑 关键概念

### Server Action 的两种定义方式

#### 方式 1: 内联定义（组件内部）
```tsx
export default function Page() {
  async function myAction(formData: FormData) {
    'use server';  // ← 必须有这个指令
    // 服务端代码
  }
  
  return <form action={myAction}>...</form>;
}
```

#### 方式 2: 独立文件
```tsx
// actions.ts
'use server';  // ← 文件顶部

export async function myAction(formData: FormData) {
  // 服务端代码
}
```

### 服务端 vs 客户端

| 特性 | 服务端组件 | 客户端组件 |
|------|-----------|-----------|
| 标记 | 无（默认） | `'use client'` |
| 可用 API | cookies, headers, DB | useState, useEffect |
| Server Actions | ✅ 可定义和调用 | ✅ 只能调用 |
| 执行位置 | 服务端 | 浏览器 |

## 🛠️ 常用 API

### revalidatePath
刷新指定路径的缓存
```tsx
import { revalidatePath } from 'next/cache';

async function updateData() {
  'use server';
  
  // 更新数据...
  
  revalidatePath('/posts');        // 刷新 /posts
  revalidatePath('/posts', 'page'); // 只刷新页面
  revalidatePath('/posts', 'layout'); // 刷新布局
}
```

### revalidateTag
根据标签刷新缓存
```tsx
import { revalidateTag } from 'next/cache';

async function updateData() {
  'use server';
  
  // 更新数据...
  
  revalidateTag('posts');  // 刷新带有 'posts' 标签的所有缓存
}
```

### redirect
服务端重定向
```tsx
import { redirect } from 'next/navigation';

async function submitForm() {
  'use server';
  
  // 处理表单...
  
  redirect('/success');  // 307 临时重定向
}
```

### cookies
访问和设置 cookies
```tsx
import { cookies } from 'next/headers';

async function login(formData: FormData) {
  'use server';
  
  const cookieStore = await cookies();
  
  // 读取
  const token = cookieStore.get('token');
  
  // 设置
  cookieStore.set('token', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 7 天
  });
  
  // 删除
  cookieStore.delete('token');
}
```

### headers
访问请求头
```tsx
import { headers } from 'next/headers';

async function myAction() {
  'use server';
  
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');
  const referer = headersList.get('referer');
}
```

## 💡 最佳实践

### ✅ 推荐做法

1. **始终进行服务端验证**
```tsx
async function createUser(formData: FormData) {
  'use server';
  
  const email = formData.get('email') as string;
  
  // ✅ 服务端验证
  if (!email || !isValidEmail(email)) {
    return { error: '无效的邮箱地址' };
  }
  
  // 处理逻辑...
}
```

2. **返回结构化的响应**
```tsx
// ✅ 好的做法
return {
  success: true,
  message: '操作成功',
  data: { id: 123 }
};

// ❌ 不好的做法
return 'success';  // 难以处理
```

3. **使用 try-catch 处理错误**
```tsx
async function riskyAction() {
  'use server';
  
  try {
    await database.update(...);
    return { success: true };
  } catch (error) {
    console.error('操作失败:', error);
    return { error: '操作失败，请重试' };
  }
}
```

4. **刷新缓存**
```tsx
async function updatePost() {
  'use server';
  
  await db.update(...);
  
  // ✅ 刷新相关页面缓存
  revalidatePath('/posts');
  revalidatePath('/posts/[id]', 'page');
}
```

### ❌ 避免的做法

1. **不要在 Server Action 中使用客户端 API**
```tsx
async function myAction() {
  'use server';
  
  // ❌ 这些都不能用
  window.location.href = '/home';
  localStorage.setItem('key', 'value');
  document.getElementById('id');
}
```

2. **不要忘记 'use server' 指令**
```tsx
// ❌ 缺少指令
export async function myAction(formData: FormData) {
  // 这不是 Server Action，只是普通函数
}

// ✅ 正确
export async function myAction(formData: FormData) {
  'use server';
  // 这是 Server Action
}
```

3. **不要在循环中多次调用**
```tsx
// ❌ 性能差
for (const id of ids) {
  await deleteItem(id);  // N 次网络请求
}

// ✅ 使用批量操作
await batchDelete(ids);  // 1 次网络请求
```

## 🎓 学习路径

1. **基础**：理解服务端组件 vs 客户端组件
2. **入门**：创建第一个 Server Action（表单提交）
3. **进阶**：使用 useFormStatus 和 useFormState
4. **高级**：文件上传、批量操作、乐观更新

## 🔗 相关资源

- [Next.js Server Actions 官方文档](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Server Components](https://react.dev/reference/rsc/server-components)
- [Demo 详细文档](./src/app/server-action-demo/README.md)

## 🚀 运行 Demo

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
open http://localhost:3000/server-action-demo
```

## 📝 注意事项

1. Server Actions 在 Next.js 13.4+ 可用
2. 默认在 Next.js 14+ 中启用
3. 可以在服务端组件和客户端组件中使用
4. 自动处理 CSRF 保护
5. 支持渐进增强（无 JS 也能工作）

---

**Happy coding! 🎉**
