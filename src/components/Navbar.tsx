import {
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import NavbarButton from '@/components/NavbarButton'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import Image from 'next/image'

function LogoImage() {
  return (
    <Image
      src='/img/unnamed (1).jpg'
      alt='Logo HighBury Tees'
      width={80}
      height={80}
      className='h-10 w-10 rounded-full border-2 border-emerald-500 object-cover shadow-sm'
      priority
      unoptimized
    />
  )
}

export default async function Navbar() {
  const session = await getSession()

  return (
    <nav className='fixed top-0 z-50 w-full border-b border-emerald-100 bg-white/95 backdrop-blur-lg backdrop-filter shadow-sm'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='relative flex h-16 items-center justify-between text-emerald-900'>
          <div className='flex flex-1 items-stretch justify-start'>
            <Link
              className='flex flex-shrink-0 items-center space-x-3 text-emerald-900 transition hover:text-emerald-600'
              href='/'
            >
              <LogoImage />
              <div className='inline-block text-xl font-semibold'>Highbury Tees</div>
            </Link>
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center space-x-4'>
            {/* Always show Cart icon, even without session */}
            <NavbarButton href='/cart'>
              <span className='sr-only'>Cart</span>
              <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
            </NavbarButton>
            {session ? (
              <>
                <NavbarButton href='/profile'>
                  <span className='sr-only'>User profile</span>
                  <UserIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarButton href='/profile/signout'>
                  <span className='sr-only'>Sign out</span>
                  <ArrowRightOnRectangleIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
              </>
            ) : (
              <>
                <Link
                  href='/auth/signup'
                  className='rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500 hover:text-white'
                >
                  Sign up
                </Link>
                <Link
                  href='/auth/signin'
                  className='rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600'
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}