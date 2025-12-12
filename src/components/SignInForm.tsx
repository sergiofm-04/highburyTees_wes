"use client"

import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SignInState {
  email: string
  password: string
}

export default function SignInForm() {
  const router = useRouter()
  const [form, setForm] = useState<SignInState>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleChange = (field: keyof SignInState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!form.email || !form.password) {
      setError('Completa el correo y la contraseña.')
      return
    }

    setPending(true)
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'No se pudo iniciar sesión.')
      }

      router.push('/profile')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado.'
      setError(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='space-y-2'>
        <label htmlFor='email' className='block text-sm font-semibold text-emerald-900'>Correo electrónico</label>
        <input
          id='email'
          name='email'
          type='email'
          required
          autoComplete='email'
          value={form.email}
          onChange={handleChange('email')}
          className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
          placeholder='usuario@correo.com'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='password' className='block text-sm font-semibold text-emerald-900'>Contraseña</label>
        <input
          id='password'
          name='password'
          type='password'
          required
          minLength={6}
          autoComplete='current-password'
          value={form.password}
          onChange={handleChange('password')}
          className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
          placeholder='Aqui va tu contraseña'
        />
      </div>

      {error ? (
        <div className='rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-inner'>
          {error}
        </div>
      ) : null}

      <button
        type='submit'
        disabled={pending}
        className='w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-70'
      >
        {pending ? 'Iniciando sesión…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
