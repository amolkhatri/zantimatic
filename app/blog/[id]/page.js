import fs from "fs";
import path from "path";
import * as matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default async function Blog({ params }) {
    let id = (await params).id;
    id = parseInt(id);
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


export async function getStaticParams() {
    const blogs = await fetchBlogs();
    return blogs.map((blog) => ({
        id: blog.id,
    }));
}

async function fetchBlog(id) {
  const blogs = await fetchBlogs();
  return blogs.find((blog) => blog.id === id);
}

async function fetchBlogs() {
    const blogsDirectory = path.join(process.cwd(), "content");
    const files = fs.readdirSync(blogsDirectory);
    const blogs = files.map((file, id) => { 
      const content = fs.readFileSync(path.join(blogsDirectory, file), "utf8");
      let md = matter(content);
      md.id = id;
      return md;
    });
    return blogs;
  }
