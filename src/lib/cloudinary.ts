// Cloudinary configuration and upload functions

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''

export interface CloudinaryUploadResult {
  url: string
  publicId: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload image to Cloudinary using unsigned upload
 * This uses the upload preset configured in Cloudinary dashboard
 */
export async function uploadToCloudinary(file: File): Promise<{ data: CloudinaryUploadResult | null; error: string | null }> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return { 
      data: null, 
      error: 'Cloudinary غير مُعد. يرجى إضافة NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME و NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET' 
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'masaralaqar') // Organize uploads in a folder

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'فشل في رفع الصورة')
    }

    const data = await response.json()

    return {
      data: {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return { data: null, error: error.message || 'حدث خطأ أثناء رفع الصورة' }
  }
}

/**
 * Upload any file type to Cloudinary
 */
export async function uploadFileToCloudinary(file: File): Promise<{ data: CloudinaryUploadResult | null; error: string | null }> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return { 
      data: null, 
      error: 'Cloudinary غير مُعد' 
    }
  }

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'masaralaqar')
    formData.append('resource_type', 'auto') // Auto-detect file type

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'فشل في رفع الملف')
    }

    const data = await response.json()

    return {
      data: {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width || 0,
        height: data.height || 0,
        format: data.format || file.name.split('.').pop() || '',
        bytes: data.bytes,
      },
      error: null,
    }
  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return { data: null, error: error.message || 'حدث خطأ أثناء رفع الملف' }
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(url: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'auto' | 'webp' | 'jpg' | 'png'
} = {}): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const { width, height, quality = 80, format = 'auto' } = options
  
  // Build transformation string
  const transforms: string[] = []
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  transforms.push(`q_${quality}`)
  transforms.push(`f_${format}`)
  transforms.push('c_fill') // Crop mode

  const transformString = transforms.join(',')

  // Insert transformation into URL
  return url.replace('/upload/', `/upload/${transformString}/`)
}

/**
 * Delete image from Cloudinary (requires server-side implementation)
 * Note: For security, deletion should be done server-side with API secret
 */
export async function deleteFromCloudinary(publicId: string): Promise<{ success: boolean; error: string | null }> {
  // This would need to be implemented as an API route for security
  console.warn('Cloudinary deletion requires server-side implementation')
  return { success: false, error: 'يجب تنفيذ الحذف من خلال API Route' }
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)
}
