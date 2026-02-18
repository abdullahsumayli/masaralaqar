import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for blog posts
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  date: string
  reading_time: number
  image?: string
  published: boolean
  created_at?: string
  updated_at?: string
}

// Types for library resources
export interface LibraryResource {
  id: string
  title: string
  description: string
  type: 'book' | 'course' | 'template' | 'tool'
  category: string
  download_url?: string
  external_url?: string
  published: boolean
  created_at?: string
  updated_at?: string
}

// Blog functions
export async function getAllBlogPosts(publishedOnly = true) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (publishedOnly) {
    query = query.eq('published', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  return data || []
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return data
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating blog post:', error)
    return null
  }
  
  return data
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating blog post:', error)
    return null
  }
  
  return data
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
  
  return true
}

// Library functions
export async function getAllLibraryResources(publishedOnly = true) {
  let query = supabase
    .from('library_resources')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (publishedOnly) {
    query = query.eq('published', true)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching library resources:', error)
    return []
  }
  
  return data || []
}

export async function createLibraryResource(resource: Omit<LibraryResource, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('library_resources')
    .insert([resource])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating library resource:', error)
    return null
  }
  
  return data
}

export async function updateLibraryResource(id: string, updates: Partial<LibraryResource>) {
  const { data, error } = await supabase
    .from('library_resources')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating library resource:', error)
    return null
  }
  
  return data
}

export async function deleteLibraryResource(id: string) {
  const { error } = await supabase
    .from('library_resources')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting library resource:', error)
    return false
  }
  
  return true
}
