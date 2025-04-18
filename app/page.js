import { fetchAllNews } from "@/util/news";
import Header from "@/components/ui/header";
import BlogEntry from "@/components/ui/BlogEntry";
// Mock data - you'll want to replace this with real data from your backend/CMS

export default async function Home() {
  const news = await fetchAllNews();
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {news.map((post) => (
            <BlogEntry key={post.id} post={post} href={`/news/${post.slug || post.id}`} />
          ))}
        </div>
        
        {news.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No news found. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
