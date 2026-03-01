import { redirect } from 'next/navigation'

// تم نقل التسجيل إلى نظام صقر على masaralaqar.com/register/app
export default function SignUpPage() {
  redirect('https://masaralaqar.com/register/app')
}
