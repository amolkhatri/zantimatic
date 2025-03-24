export default function BlogEntry({ post }) {
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
        {/* Date and Tags in a single row */}
        <div className="flex flex-wrap items-center justify-between text-sm">
          {post.date && (
            <time className="text-gray-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          )}
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Title */}
        <h2 className="text-xl font-bold">{post.title}</h2>
        
        {/* Description/Excerpt */}
        {post.description && (
          <p className="text-gray-700">{post.description}</p>
        )}
        
        {/* Read More Link */}
        <div className="pt-2">
          <a 
            href={`/blog/${post.slug || post.id}`} 
            className="text-primary font-medium hover:underline"
            aria-label={`Read more about ${post.title}`}
          >
            Read more →
          </a>
        </div>
      </div>
    </article>
  );
}