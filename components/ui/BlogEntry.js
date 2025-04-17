import Link from 'next/link';

export default function BlogEntry({ post, href}) {
  return (
    <article className="mb-8 border-b pb-6">
      {post.coverImage && (
        <figure className="mb-4 overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-48 object-cover"
          />
        </figure>
      )}
      
      <div className="space-y-3">
        {/* Title - Now Clickable */}
        <h2 className="text-xl font-bold">
          <Link 
            href={href}
            className="hover:text-primary transition-colors"
            aria-label={`Read article: ${post.title}`}
          >
            {post.title}
          </Link>
        </h2>
        
        {/* Description/Excerpt */}
        {post.description && (
          <p className="text-gray-700">{post.description}</p>
        )}
        
        {/* Date and Tags in the same row */}
        <div className="flex justify-between items-center pt-2">
          {/* Date */}
          <div className="text-sm">
            {post["published date"] && (
              <time className="text-gray-500" dateTime={post["published date"]}>
                {new Date(post["published date"]).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
          
          {/* Tags - now on the right */}
          <div className="flex flex-wrap gap-2 justify-end">
            {post.tags && post.tags.length > 0 && 
              post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
                >
                  #{tag}
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </article>
  );
}