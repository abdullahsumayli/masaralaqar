import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
  slug: string
  title: string
  description: string
  excerpt: string
  content: string
  category: string
  date: string
  readingTime: number
  author: string
  image?: string
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

export function getAllPosts(): BlogPost[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        description: data.description || '',
        excerpt: data.description || '',
        content,
        category: data.category || '',
        date: data.date ? formatDate(data.date) : '',
        readingTime: data.readingTime || 5,
        author: data.author || 'مسار العقار',
        image: data.image,
      }
    })

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    excerpt: data.description || '',
    content,
    category: data.category || '',
    date: data.date ? formatDate(data.date) : '',
    readingTime: data.readingTime || 5,
    author: data.author || 'مسار العقار',
    image: data.image,
  }
}

export function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts
    .filter(post => post.slug !== currentSlug && post.category === category)
    .slice(0, limit)
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
