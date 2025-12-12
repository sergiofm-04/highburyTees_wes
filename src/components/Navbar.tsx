import {
  ArrowRightOnRectangleIcon,
  ShoppingCartIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import NavbarButton from '@/components/NavbarButton'
import NavbarSignOutButton from '@/components/NavbarSignOutButton'
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
    <nav className='fixed top-0 z-50 w-full glass shadow-lg'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        <div className='relative flex h-20 items-center justify-between'>
          <div className='flex items-center'>
            <Link
              className='group flex items-center space-x-3 text-emerald-900 transition-all hover:scale-105'
              href='/'
            >
              <div className='relative'>
                <LogoImage />
                <div className='absolute -inset-1 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity'></div>
              </div>
              <div className='flex flex-col'>
                <span className='text-xl font-bold tracking-tight'>Highbury Tees</span>
                <span className='text-[10px] uppercase tracking-widest text-emerald-600'>Premium Football Kits</span>
              </div>
            </Link>
          </div>
          <div className='flex items-center space-x-2'>
            {session ? (
              <>
                <NavbarButton href='/cart'>
                  <span className='sr-only'>Carrito</span>
                  <div className='relative'>
                    <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                  </div>
                </NavbarButton>
                <NavbarButton href='/profile'>
                  <span className='sr-only'>Perfil</span>
                  <UserIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarButton>
                <NavbarSignOutButton>
                  <span className='sr-only'>Cerrar sesión</span>
                  <ArrowRightOnRectangleIcon className='h-6 w-6' aria-hidden='true' />
                </NavbarSignOutButton>
              </>
            ) : (
              <>
                <Link
                  href='/auth/signup'
                  className='hidden sm:inline-flex rounded-2xl border-2 border-emerald-500/30 px-5 py-2 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-500 hover:bg-emerald-50'
                >
                  Registrarse
                </Link>
                <Link
                  href='/auth/signin'
                  className='rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5'
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}