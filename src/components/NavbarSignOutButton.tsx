"use client"

import { ReactNode, useState } from 'react'
import { useRouter } from 'next/navigation'
import { navbarButtonClasses } from './NavbarButton'

interface NavbarSignOutButtonProps {
  children: ReactNode
}

export default function NavbarSignOutButton({ children }: NavbarSignOutButtonProps) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    setPending(true)
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (!response.ok) throw new Error('No se pudo cerrar la sesión.')
      router.push('/auth/signin')
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={pending}
      className={`${navbarButtonClasses} disabled:cursor-not-allowed disabled:opacity-60`}
      aria-label='Cerrar sesión'
    >
      <div className='absolute inset-0 rounded-2xl bg-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100'></div>
      <div className='relative'>{children}</div>
    </button>
  )
}
