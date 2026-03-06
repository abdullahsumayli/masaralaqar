'use client'

import { useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface WhatsAppQRProps {
  phoneNumber: string
  size?: number
}

export function WhatsAppQR({ phoneNumber, size = 250 }: WhatsAppQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate QR code using QR Server API
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(`https://wa.me/${phoneNumber}`)}`
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          canvasRef.current!.width = size
          canvasRef.current!.height = size
          ctx.drawImage(img, 0, 0)
        }
        img.src = qrApiUrl
      }
    }
  }, [phoneNumber, size])

  return (
    <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20">
          <MessageCircle className="w-6 h-6 text-green-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-white">اتصل عبر الواتساب</h3>
        <p className="text-sm text-gray-400">امسح الكود ضوئياً للتواصل معنا</p>
        
        <div className="mt-4 p-2 bg-white rounded-lg">
          <canvas
            ref={canvasRef}
            className="rounded"
            style={{ width: size, height: size }}
          />
        </div>
        
        <p className="text-xs text-gray-500 mt-2">{phoneNumber}</p>
        
        <a
          href={`https://wa.me/${phoneNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          فتح الواتساب
        </a>
      </div>
    </Card>
  )
}
