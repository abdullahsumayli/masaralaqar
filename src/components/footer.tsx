import Link from 'next/link'
import { Mail, Phone, MapPin, Twitter, Linkedin, MessageCircle, ArrowLeft } from 'lucide-react'
import { MqLogo } from '@/components/mq/MqLogo'

const quickLinks = [
  { href: '/products', label: 'المنتجات' },
  { href: '/products/saqr', label: 'MQ' },
  { href: '/pricing', label: 'الأسعار' },
  { href: '/knowledge/blog', label: 'المدونة' },
  { href: '/knowledge/library', label: 'المكتبة' },
  { href: '/affiliate', label: 'برنامج الإحالة' },
]

const companyLinks = [
  { href: '/about', label: 'عن المنصة' },
  { href: '/faq', label: 'الأسئلة الشائعة' },
  { href: '/partners', label: 'الشركاء' },
  { href: '/contact', label: 'تواصل معنا' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/terms', label: 'الشروط والأحكام' },
]

const socialLinks = [
  { href: 'https://twitter.com/masaralaqar', label: 'Twitter / X', icon: Twitter },
  { href: 'https://linkedin.com/company/masaralaqar', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://wa.me/966545374069', label: 'WhatsApp', icon: MessageCircle },
]

export function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Ambient orbs */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-accent/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit" aria-label="MQ - الصفحة الرئيسية">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-xl bg-primary/15 blur-md group-hover:bg-primary/25 transition-all" />
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <MqLogo className="h-[76%] w-[76%]" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-cairo font-bold text-lg text-text-primary">MQ</span>
                <span className="text-[10px] text-primary/80 font-medium">MQ · AI tools for real estate</span>
              </div>
            </Link>

            <p className="text-text-muted text-sm leading-relaxed mb-6 max-w-[260px]">
              AI tools for modern real estate teams. منصة الذكاء الاصطناعي الأولى للمكاتب العقارية في المملكة.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg border border-border bg-background flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/30 hover:bg-primary/[0.06] transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-text-primary font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
              المنتجات
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-text-secondary text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-text-primary font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-accent rounded-full inline-block" />
              الشركة
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-text-secondary text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-accent transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-text-primary font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
              تواصل معنا
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="tel:+966545374069" className="flex items-center gap-2.5 text-text-muted hover:text-text-secondary text-sm transition-colors group">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span dir="ltr">+966 54 537 4069</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@masaralaqar.com" className="flex items-center gap-2.5 text-text-muted hover:text-text-secondary text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  info@masaralaqar.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-text-muted text-sm">
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                المملكة العربية السعودية
              </li>
            </ul>

            {/* Mini CTA */}
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary text-sm font-semibold hover:border-primary/40 hover:bg-primary/15 transition-all group"
            >
              ابدأ مجاناً
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} MQ. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1 text-text-muted text-xs">
            <span>صُنع بـ</span>
            <span className="text-primary">♥</span>
            <span>في المملكة العربية السعودية 🇸🇦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
