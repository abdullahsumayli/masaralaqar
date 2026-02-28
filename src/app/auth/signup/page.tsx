import { redirect } from 'next/navigation'

// تم نقل التسجيل إلى نظام صقر على app.masaralaqar.com
export default function SignUpPage() {
  redirect('https://app.masaralaqar.com/register')
}
