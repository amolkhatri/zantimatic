import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function fetchBlogs() {
    const blogsDirectory = path.join(process.cwd(), "content");
    const files = fs.readdirSync(blogsDirectory);
    const blogs = files.map((file) => { 
      const content = fs.readFileSync(path.join(blogsDirectory, file), "utf8");
      return matter(content);
    });
    return blogs;
  }

  export async function fetchBlog(id) {
    const blogs = await fetchBlogs();
    return blogs.find((blog) => blog.data.id === id);
  }