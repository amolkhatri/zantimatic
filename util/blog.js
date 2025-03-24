import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function fetchBlogs() {
    const blogsDirectory = path.join(process.cwd(), "content");
    const files = fs.readdirSync(blogsDirectory);
    const blogs = files.map((file) => { 
      const fileContent = fs.readFileSync(path.join(blogsDirectory, file), "utf8");
      let { data, content } = matter(fileContent);
      return { ...data, content };
    });
    return blogs;
  }

  export async function fetchBlog(id) {
    const blogs = await fetchBlogs();
    return blogs.find((blog) => blog.id === id);
  }