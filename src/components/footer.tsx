import Link from 'next/link'
import { Building2, Linkedin, Twitter, MessageCircle } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/blog', label: 'المدونة' },
  { href: '/library', label: 'المكتبة' },
  { href: '/academy', label: 'الأكاديمية' },
  { href: '/contact', label: 'تواصل معنا' },
]

const productLinks = [
  { href: '/products/saqr', label: 'نظام صقر' },
  { href: '/products/eghlaq', label: 'منصة إغلاق' },
]

const socialLinks = [
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://wa.me/966545374069', label: 'WhatsApp', icon: MessageCircle },
]

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="font-cairo font-bold text-xl text-text-primary">
                مسار العقار
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              تقنيات الذكاء الاصطناعي لتحويل مكتبك العقاري إلى نظام ذكي يعمل 24/7.
              أتمتة • ذكاء • نتائج
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cairo font-bold text-text-primary mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-cairo font-bold text-text-primary mb-4">
              المنتجات
            </h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cairo font-bold text-text-primary mb-4">
              تواصل معنا
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>
                <span className="block text-text-muted">البريد الإلكتروني:</span>
                <a href="mailto:info@masaralaqar.com" className="hover:text-primary transition-colors">
                  info@masaralaqar.com
                </a>
              </li>
              <li>
                <span className="block text-text-muted">الموقع:</span>
                المملكة العربية السعودية
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {new Date().getFullYear()} مسار العقار. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
