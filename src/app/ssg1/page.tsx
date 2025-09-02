import { Metadata } from 'next';
import PostCard from './components/PostCard';
import { getAllPosts } from './data';
import Image from 'next/image'

// 生成静态元数据
export const metadata: Metadata = {
  title: 'SSG 博客文章列表 | Next.js Demo',
  description: '展示 Next.js 静态站点生成 (SSG) 功能的博客文章列表',
  keywords: ['Next.js', 'SSG', '静态站点生成', 'React', '博客'],
  openGraph: {
    title: 'SSG 博客文章列表',
    description: '展示 Next.js 静态站点生成功能的博客文章列表',
    type: 'website',
  },
};

// 这个函数在构建时执行，用于生成静态页面
export async function generateStaticParams() {
  // 在实际应用中，这里可能会从API或数据库获取数据
  // 这里我们返回空数组，因为这是列表页面
  return [];
}



export default function SSGPage() {
  // 在构建时获取所有文章数据
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">


        <Image
          src="https://s3.amazonaws.com/my-bucket/profile.png"
          alt="Picture of the author"
          width={500}
          height={500}
        />
        {/* 页面头部 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            SSG 博客文章列表
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            这个页面展示了 Next.js 静态站点生成 (SSG) 的强大功能。
            所有内容都在构建时预渲染，提供极快的加载速度。
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🚀 SSG 特性
            </h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 构建时预渲染，加载速度极快</li>
              <li>• 优秀的SEO表现</li>
              <li>• 支持动态路由的静态生成</li>
              <li>• 自动生成元数据</li>
            </ul>
          </div>
        </header>

        {/* 文章列表 */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* 页面底部信息 */}
        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>
            共 {posts.length} 篇文章 • 
            所有页面都通过 SSG 在构建时生成
          </p>
          <p className="mt-2 text-sm">
            点击任意文章标题查看详情页面
          </p>
        </footer>
      </div>
    </div>
  );
}
