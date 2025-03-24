import { fetchBlogs } from "@/util/blog";
import Header from "@/components/ui/header";
import BlogEntry from "@/components/ui/BlogEntry";
// Mock data - you'll want to replace this with real data from your backend/CMS

export default async function Home() {
  const blogPosts = await fetchBlogs();
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <BlogEntry key={post.id} post={post} />
          ))}
        </div>
        
        {blogPosts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No blog posts found. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
