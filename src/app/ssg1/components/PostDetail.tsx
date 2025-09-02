import Link from 'next/link';
import { Post } from '../data';

interface PostDetailProps {
  post: Post;
}

export default function PostDetail({ post }: PostDetailProps) {
  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/ssg1"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          ← 返回文章列表
        </Link>
        
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-4">
              <span>作者: {post.author}</span>
              <span>发布时间: {post.publishDate}</span>
            </div>
            <span className="text-blue-600 dark:text-blue-400">
              {post.readTime} 分钟阅读
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {post.content}
          </p>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              SSG 特性说明
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              这个页面是通过 Next.js 的静态站点生成 (SSG) 功能预渲染的。
              页面内容在构建时生成，提供极快的加载速度和良好的SEO效果。
            </p>
          </div>
        </div>
      </div>
    </article>
  );
} 