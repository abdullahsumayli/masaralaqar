'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Home,
  MapPin,
  DollarSign,
  Maximize2,
  ChevronRight,
  Image as ImageIcon,
  Loader,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  location: string
  area: number // in square meters
  type: 'apartment' | 'villa' | 'land' | 'commercial'
  bedrooms?: number
  bathrooms?: number
  image?: string
  featured?: boolean
}

interface PropertyCatalogProps {
  properties?: Property[]
  isLoading?: boolean
  onPropertyClick?: (property: Property) => void
}

const sampleProperties: Property[] = [
  {
    id: '1',
    title: 'فيلا فاخرة في حي الروضة',
    description: 'فيلا حديثة مع تصميم عصري وحديقة واسعة',
    price: 2500000,
    location: 'حي الروضة، الرياض',
    area: 450,
    type: 'villa',
    bedrooms: 5,
    bathrooms: 4,
    featured: true,
  },
  {
    id: '2',
    title: 'شقة سكنية بمنطقة الملز',
    description: 'شقة نوم واحد مع مطبخ مجهز وموقف سيارة',
    price: 450000,
    location: 'منطقة الملز، الرياض',
    area: 120,
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: '3',
    title: 'أرض تجارية بمخطط الأندلس',
    description: 'موقع استراتيجي ممتاز بجوار مراكز تجارية',
    price: 1800000,
    location: 'مخطط الأندلس، الرياض',
    area: 800,
    type: 'land',
  },
  {
    id: '4',
    title: 'مكتب تجاري مؤثث',
    description: 'مكتب جاهز للعمل مع جميع الخدمات',
    price: 300000,
    location: 'البرج التجاري، حي النرجس',
    area: 85,
    type: 'commercial',
  },
]

export function PropertyCatalog({
  properties = sampleProperties,
  isLoading = false,
  onPropertyClick,
}: PropertyCatalogProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: '🏢 شقة',
      villa: '🏘️ فيلا',
      land: '🌱 أرض',
      commercial: '🏬 تجاري',
    }
    return labels[type] || type
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <Card className="p-12 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">🏠 كاتلوج العقارات</h2>
        <p className="text-gray-400">اختر من عقاراتنا المميزة</p>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {properties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${
                property.featured ? 'border-primary/30 bg-primary/5' : ''
              }`}
              onClick={() => {
                setSelectedProperty(property)
                onPropertyClick?.(property)
              }}
            >
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center overflow-hidden group">
                <ImageIcon className="w-12 h-12 text-gray-600 group-hover:scale-110 transition-transform" />
                {property.featured && (
                  <div className="absolute top-3 right-3 bg-primary px-3 py-1 rounded-full text-xs font-semibold text-white">
                    ⭐ مميز
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title & Type */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{property.title}</h3>
                    <p className="text-xs text-gray-400">{getTypeLabel(property.type)}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 text-lg font-bold text-primary">
                  <DollarSign className="w-5 h-5" />
                  {formatPrice(property.price)}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-700">
                  {/* Area */}
                  <div className="flex flex-col items-center gap-1">
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">{property.area} م²</span>
                  </div>

                  {/* Bedrooms */}
                  {property.bedrooms && (
                    <div className="flex flex-col items-center gap-1">
                      <Home className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">{property.bedrooms} اسرة</span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex flex-col items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 truncate">موقع</span>
                  </div>
                </div>

                {/* Location & Description */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-400 line-clamp-2">
                    📍 {property.location}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {property.description}
                  </p>
                </div>

                {/* Action Button */}
                <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-white group flex items-center justify-center gap-2">
                  عرض التفاصيل
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {properties.length === 0 && (
        <Card className="p-12 text-center">
          <Home className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد عقارات متاحة حالياً</p>
        </Card>
      )}

      {/* Selected Property Details */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-primary/10 border-primary/30">
            <h3 className="text-lg font-bold text-white mb-4">📋 تفاصيل العقار</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">العنوان:</span>
                <span className="text-white ml-2">{selectedProperty.title}</span>
              </p>
              <p>
                <span className="text-gray-400">الموقع:</span>
                <span className="text-white ml-2">{selectedProperty.location}</span>
              </p>
              <p>
                <span className="text-gray-400">الوصف:</span>
                <span className="text-white ml-2">{selectedProperty.description}</span>
              </p>
              <div className="flex gap-4 pt-2 border-t border-gray-700/50">
                <Button
                  asChild
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <a
                    href={`https://wa.me/?text=مهتم%20بـ%20${encodeURIComponent(selectedProperty.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    💬 استفسر عبر الواتساب
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
