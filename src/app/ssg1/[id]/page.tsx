import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostDetail from '../components/PostDetail';
import { getAllPosts, getPostById } from '../data';

// 生成所有可能的静态路径
export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    id: post.id,
  }));
}

// 生成动态元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const post = getPostById(params.id);
  
  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title} | SSG 博客`,
    description: post.content.substring(0, 160) + '...',
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160) + '...',
      type: 'article',
      authors: [post.author],
      publishedTime: post.publishDate,
    },
  };
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = getPostById(params.id);

  // 如果文章不存在，返回404页面
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostDetail post={post} />
        
        {/* SSG 信息展示 */}
        <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
            🎯 这个页面是如何生成的？
          </h3>
          <div className="text-sm text-green-800 dark:text-green-200 space-y-2">
            <p>
              <strong>generateStaticParams:</strong> 在构建时生成所有可能的路径参数
            </p>
            <p>
              <strong>generateMetadata:</strong> 为每个页面生成独特的SEO元数据
            </p>
            <p>
              <strong>静态生成:</strong> 所有页面在构建时预渲染为静态HTML
            </p>
            <p>
              <strong>性能优势:</strong> 极快的加载速度，优秀的SEO表现
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 