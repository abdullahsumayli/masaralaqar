import Link from 'next/link'
import { Zap, Mail, Phone, MapPin, Twitter, Linkedin, MessageCircle, ArrowLeft } from 'lucide-react'

const quickLinks = [
  { href: '/products/saqr', label: 'نظام صقر' },
  { href: '/products/saqr#pricing', label: 'الأسعار' },
  { href: '/blog', label: 'المدونة' },
  { href: '/library', label: 'المكتبة' },
]

const companyLinks = [
  { href: '/contact', label: 'تواصل معنا' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
  { href: '/terms', label: 'الشروط والأحكام' },
]

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter / X', icon: Twitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://wa.me/966545374069', label: 'WhatsApp', icon: MessageCircle },
]

export function Footer() {
  return (
    <footer className="relative bg-[#070B14] border-t border-white/[0.06] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4F8EF7]/30 to-transparent" />

      {/* Ambient orbs */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-[#4F8EF7]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-[#E5B84A]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-xl bg-[#4F8EF7]/15 blur-md group-hover:bg-[#4F8EF7]/25 transition-all" />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-[#4F8EF7] to-[#2B6DE8] flex items-center justify-center border border-[#4F8EF7]/30">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-cairo font-bold text-lg text-[#F0F4FF]">مسار العقار</span>
                <span className="text-[10px] text-[#4F8EF7]/70 font-medium">PropTech Saudi</span>
              </div>
            </Link>

            <p className="text-[#475569] text-sm leading-relaxed mb-6 max-w-[260px]">
              منصة الذكاء الاصطناعي الأولى للمكاتب العقارية في المملكة. أتمتة كاملة، نتائج حقيقية.
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
                  className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-[#475569] hover:text-[#4F8EF7] hover:border-[#4F8EF7]/30 hover:bg-[#4F8EF7]/[0.06] transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#F0F4FF] font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#4F8EF7] rounded-full inline-block" />
              المنتجات
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#475569] hover:text-[#94A3B8] text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#4F8EF7] transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[#F0F4FF] font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#E5B84A] rounded-full inline-block" />
              الشركة
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#475569] hover:text-[#94A3B8] text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-[#E5B84A] transition-all duration-300 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + CTA */}
          <div>
            <h3 className="text-[#F0F4FF] font-cairo font-semibold text-sm mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#4F8EF7] rounded-full inline-block" />
              تواصل معنا
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="tel:+966545374069" className="flex items-center gap-2.5 text-[#475569] hover:text-[#94A3B8] text-sm transition-colors group">
                  <Phone className="w-3.5 h-3.5 text-[#4F8EF7] flex-shrink-0" />
                  <span dir="ltr">+966 54 537 4069</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@masaralaqar.com" className="flex items-center gap-2.5 text-[#475569] hover:text-[#94A3B8] text-sm transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#4F8EF7] flex-shrink-0" />
                  info@masaralaqar.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[#475569] text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#4F8EF7] flex-shrink-0" />
                المملكة العربية السعودية
              </li>
            </ul>

            {/* Mini CTA */}
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8EF7]/10 to-[#4F8EF7]/5 border border-[#4F8EF7]/20 text-[#7AAEFF] text-sm font-semibold hover:border-[#4F8EF7]/40 hover:bg-[#4F8EF7]/15 transition-all group"
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
          <p className="text-[#2D3748] text-xs">
            © {new Date().getFullYear()} مسار العقار. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-1 text-[#2D3748] text-xs">
            <span>صُنع بـ</span>
            <span className="text-[#4F8EF7]">♥</span>
            <span>في المملكة العربية السعودية 🇸🇦</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
