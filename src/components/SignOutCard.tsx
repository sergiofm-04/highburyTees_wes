"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutCard() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignOut = async () => {
    setError(null)
    setPending(true)
    try {
      const response = await fetch('/api/auth/signout', { method: 'POST' })
      if (!response.ok) throw new Error('No se pudo cerrar la sesión.')
      router.push('/auth/signin')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado.'
      setError(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className='space-y-6 rounded-3xl bg-gray-800/70 p-8 text-gray-50 shadow-2xl'>
      <div className='flex items-center gap-3'>
        <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600'>
          <svg className='h-7 w-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
          </svg>
        </div>
        <div>
          <p className='text-sm uppercase tracking-wide text-emerald-300'>Cerrar sesión</p>
          <h1 className='text-2xl font-bold text-white'>¿Listo para salir?</h1>
          <p className='text-sm text-gray-300'>Confirma y cerraremos tu sesión de forma segura.</p>
        </div>
      </div>

      {error ? (
        <div className='rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-inner'>
          {error}
        </div>
      ) : null}

      <div className='flex flex-wrap gap-3'>
        <button
          type='button'
          onClick={handleSignOut}
          disabled={pending}
          className='inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70'
        >
          {pending ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
        <button
          type='button'
          onClick={() => router.back()}
          className='inline-flex items-center justify-center rounded-2xl border border-gray-600 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-gray-700'
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
