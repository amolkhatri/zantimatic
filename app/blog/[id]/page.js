import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { fetchBlog, fetchBlogs } from "@/util/blog";
export default async function Blog({ params }) {
    let id = (await params).id;
    const blog = await fetchBlog(id);
    
    return (
        <div className="blog-container">
            <article className="blog-content">
                <header className="blog-header">
                    <h1>{blog.data.title}</h1>
                    {blog.data.date && (
                        <time dateTime={blog.data.date}>
                            {new Date(blog.data.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </time>
                    )}
                    {blog.data.author && <span className="blog-author">By {blog.data.author}</span>}
                </header>
                
                <div className="markdown">
                    <ReactMarkdown
                        components={{
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                    >
                        {blog.content}
                    </ReactMarkdown>
                </div>
            </article>
        </div>
    );
}


export async function generateStaticParams() {
    const blogs = await fetchBlogs();
    return blogs.map((blog) => ({
        id: blog.data.id,
    }));
}

