import Image from "next/image";
import Link from "next/link";
import { fetchBlogs } from "@/util/blog";
// Mock data - you'll want to replace this with real data from your backend/CMS

export default async function Home() {
  const blogPosts = await fetchBlogs();
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Zantimatic</h1>
        <p className="text-gray-600 dark:text-gray-400">Welcome to my blog</p>
      </header>

      <main className="max-w-3xl mx-auto">
        <div className="grid gap-6">
          {blogPosts.map((post, index) => (
            <Link 
              href={`/blog/${post.id}`} 
              key={index}
              className="block p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <article>
                <h2 className="text-xl font-semibold mb-2">{post.data.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{post.data.excerpt}</p>
                <time className="text-sm text-gray-500">{post.data.date}</time>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
