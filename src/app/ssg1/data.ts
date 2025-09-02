export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  readTime: number;
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Next.js 15 新特性详解',
    content: 'Next.js 15带来了许多激动人心的新特性，包括改进的App Router、更好的性能优化、以及全新的开发体验。本文将深入探讨这些新功能，帮助你更好地利用Next.js 15的强大能力。',
    author: '张三',
    publishDate: '2024-01-15',
    tags: ['Next.js', 'React', '前端'],
    readTime: 5
  },
  {
    id: '2',
    title: 'TypeScript 5.0 最佳实践',
    content: 'TypeScript 5.0引入了许多新特性，如装饰器、const类型参数等。本文将分享在实际项目中使用TypeScript 5.0的最佳实践和常见陷阱。',
    author: '李四',
    publishDate: '2024-01-10',
    tags: ['TypeScript', 'JavaScript', '开发工具'],
    readTime: 8
  },
  {
    id: '3',
    title: 'Tailwind CSS 4.0 完全指南',
    content: 'Tailwind CSS 4.0带来了全新的架构和更好的性能。本文将详细介绍新版本的特性、迁移指南以及最佳实践。',
    author: '王五',
    publishDate: '2024-01-05',
    tags: ['CSS', 'Tailwind', '样式'],
    readTime: 6
  },
  {
    id: '4',
    title: 'React Server Components 深度解析',
    content: 'React Server Components是React生态系统的重大创新。本文将深入解析其工作原理、使用场景以及与传统组件的区别。',
    author: '赵六',
    publishDate: '2024-01-01',
    tags: ['React', 'Server Components', '前端架构'],
    readTime: 10
  }
];

export function getPostById(id: string): Post | undefined {
  return posts.find(post => post.id === id);
}

export function getAllPosts(): Post[] {
  return posts;
} 