import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { fetchBlog, fetchBlogs } from "@/util/blog";
import Header from "@/components/ui/header";
import Link from "next/link";
export default async function Blog({ params }) {
    let id = (await params).id;
    const blog = await fetchBlog(id);

    return (
        <div>   
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-sm breadcrumbs mb-6">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href={"/blog/" + blog.id}>Blog</Link></li>
                        <li>{blog.title}</li>
                    </ul>
                </div>
                <h1 className="text-5xl font-bold">{blog.title}</h1>
                <article>
                    <div className="markdown">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={darcula}
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
        </div>
    );
}


export async function generateStaticParams() {
    const blogs = await fetchBlogs();
    return blogs.map((blog) => ({
        id: blog.id
    }));
}

