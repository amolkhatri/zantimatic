import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function fetchAllNews() {
    const newsDirectory = path.join(process.cwd(), process.env.NEWS_PATH);
    const files = fs.readdirSync(newsDirectory);
    let news = files.map((file) => { 
      const fileContent = fs.readFileSync(path.join(newsDirectory, file), "utf8");
      let { data, content } = matter(fileContent);
      return { ...data, content };
    });
    news = news.filter((news) => news.status === "Published");
    return news;
  }

  export async function fetchNews(id) {
    const news = await fetchAllNews();
    return news.find((news) => news.id === id);
  }