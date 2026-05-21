import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  content: string;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function getAllPosts(): PostData[] {
  console.log("postsDirectory:", postsDirectory);

  if (!fs.existsSync(postsDirectory)) {
    console.log("content/posts não existe");
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  console.log("files:", fileNames);

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx") || fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$|\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);

      const post = {
        slug,
        title: normalizeString(data.title),
        date: normalizeString(data.date),
        description: normalizeString(data.description),
        image: normalizeString(data.image),
        content: content.trim(),
      };

      console.log("post lido:", post);

      return post;
    })
    .filter((post) => post.title && post.date);

  console.log("posts finais:", allPostsData);

  return allPostsData.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
}

export function getPostBySlug(slug: string): PostData | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}