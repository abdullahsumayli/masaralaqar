'use client'

import { Suspense } from 'react'
import SubscribeContent from './subscribe-content'
import { Loader } from 'lucide-react'

function SubscribeLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader className="w-8 h-8 animate-spin text-primary" />
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeLoading />}>
      <SubscribeContent />
    </Suspense>
  )
}
