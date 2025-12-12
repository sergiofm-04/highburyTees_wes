import SignOutCard from '@/components/SignOutCard'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignOutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4'>
      <SignOutCard />
    </div>
  )
}
