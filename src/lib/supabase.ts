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

// Upload image to Supabase Storage
export async function uploadImage(file: File, bucket: string = 'blog-images'): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { 
        cacheControl: '3600',
        upsert: false 
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return { url: null, error: error.message }
  }
}

// Types for bot subscriptions
export interface BotSubscription {
  id: string
  user_id: string
  phone: string
  plan_type: 'free' | 'basic' | 'pro'
  status: 'active' | 'inactive' | 'suspended'
  usage_count: number
  monthly_limit: number
  activated_at: string
  expires_at?: string
  created_at: string
  updated_at: string
}

// Bot subscription functions
export async function getBotSubscription(userId: string) {
  const { data, error } = await supabase
    .from('bot_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found, which is acceptable
    console.error('Error fetching bot subscription:', error)
  }

  return { data, error }
}

export async function getBotSubscriptionByPhone(phone: string) {
  const { data, error } = await supabase
    .from('bot_subscriptions')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching bot subscription by phone:', error)
  }

  return { data, error }
}

export async function createBotSubscription(
  userId: string,
  phone: string,
  planType: 'free' | 'basic' | 'pro'
) {
  const monthlyLimits: Record<'free' | 'basic' | 'pro', number> = {
    free: 10,
    basic: 100,
    pro: -1, // Unlimited
  }

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  const { data, error } = await supabase
    .from('bot_subscriptions')
    .insert([
      {
        user_id: userId,
        phone,
        plan_type: planType,
        status: 'active',
        monthly_limit: monthlyLimits[planType],
        expires_at: expiresAt.toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating bot subscription:', error)
  }

  return { data, error }
}

export async function updateBotSubscriptionUsage(
  subscriptionId: string,
  newUsageCount: number
) {
  const { data, error } = await supabase
    .from('bot_subscriptions')
    .update({
      usage_count: newUsageCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating bot subscription usage:', error)
  }

  return { data, error }
}

export async function updateBotSubscriptionStatus(
  subscriptionId: string,
  status: 'active' | 'inactive' | 'suspended'
) {
  const { data, error } = await supabase
    .from('bot_subscriptions')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) {
    console.error('Error updating bot subscription status:', error)
  }

  return { data, error }
}

export async function upgradeBotSubscription(
  subscriptionId: string,
  newPlanType: 'free' | 'basic' | 'pro'
) {
  const monthlyLimits: Record<'free' | 'basic' | 'pro', number> = {
    free: 10,
    basic: 100,
    pro: -1,
  }

  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1)

  const { data, error } = await supabase
    .from('bot_subscriptions')
    .update({
      plan_type: newPlanType,
      monthly_limit: monthlyLimits[newPlanType],
      usage_count: 0, // Reset usage on upgrade
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select()
    .single()

  if (error) {
    console.error('Error upgrading bot subscription:', error)
  }

  return { data, error }
}

// Types for properties
export interface Property {
  id: string
  user_id: string
  title: string
  description?: string
  price: number
  location?: string
  area?: number
  type: 'apartment' | 'villa' | 'land' | 'commercial'
  bedrooms?: number
  bathrooms?: number
  image_url?: string
  featured?: boolean
  status: 'available' | 'sold' | 'rented' | 'archived'
  views_count: number
  created_at: string
  updated_at: string
}

// Property functions
export async function getUserProperties(userId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user properties:', error)
  }

  return { data: data || [], error }
}

export async function getFeaturedProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching featured properties:', error)
  }

  return { data: data || [], error }
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching property:', error)
  }

  return { data, error }
}

export async function createProperty(
  userId: string,
  property: Omit<Property, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'views_count'>
) {
  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        user_id: userId,
        ...property,
        status: property.status || 'available',
        views_count: 0,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating property:', error)
  }

  return { data, error }
}

export async function updateProperty(
  propertyId: string,
  updates: Partial<Property>
) {
  const { data, error } = await supabase
    .from('properties')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .select()
    .single()

  if (error) {
    console.error('Error updating property:', error)
  }

  return { data, error }
}

export async function deleteProperty(propertyId: string) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId)

  if (error) {
    console.error('Error deleting property:', error)
    return false
  }

  return true
}

export async function incrementPropertyViews(propertyId: string) {
  const { data: property } = await getPropertyById(propertyId)
  
  if (!property) return { data: null, error: null }

  const { data, error } = await supabase
    .from('properties')
    .update({
      views_count: (property.views_count || 0) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', propertyId)
    .select()
    .single()

  if (error) {
    console.error('Error incrementing property views:', error)
  }

  return { data, error }
}
