'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/blog', label: 'المدونة' },
  { href: '/products', label: 'المنتجات' },
  { href: '/library', label: 'المكتبة' },

]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.svg"
              alt="مسار العقار"
              width={44}
              height={44}
              className="rounded-lg transition-all duration-300 group-hover:scale-105"
            />
            <span className="font-cairo font-bold text-xl text-text-primary">
              مسار العقار
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://app.masaralaqar.com"
              className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium text-sm"
            >
              دخول النظام
            </a>
            <a
              href="https://app.masaralaqar.com/register"
              className="btn-primary inline-flex items-center"
            >
              جرب مجاناً
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-text-primary hover:text-primary transition-colors"
            aria-label={isOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-surface border-t border-border"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-text-secondary hover:text-primary hover:bg-background/50 transition-all rounded-lg"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="px-4 pt-2 space-y-2">
                  <a
                    href="https://app.masaralaqar.com/register"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary inline-flex items-center justify-center w-full"
                  >
                    جرب مجاناً
                  </a>
                  <a
                    href="https://app.masaralaqar.com"
                    onClick={() => setIsOpen(false)}
                    className="block text-center text-text-secondary hover:text-primary transition-colors py-2 text-sm font-medium"
                  >
                    دخول النظام
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
