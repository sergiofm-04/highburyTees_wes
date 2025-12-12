"use client"

import { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SignUpState {
  name: string
  surname: string
  email: string
  password: string
  address: string
  birthdate: string
}

export default function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState<SignUpState>({
    name: '',
    surname: '',
    email: '',
    password: '',
    address: '',
    birthdate: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const handleChange = (field: keyof SignUpState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const validate = (): string | null => {
    if (!form.name || !form.surname || !form.email || !form.password || !form.address || !form.birthdate) {
      return 'Completa todos los campos obligatorios.'
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return 'Introduce un correo electrónico válido.'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    if (form.address.length < 5) return 'La dirección parece demasiado corta.'
    if (Number.isNaN(Date.parse(form.birthdate))) return 'Selecciona una fecha de nacimiento válida.'
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setPending(true)
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.message || 'No se pudo completar el registro.')
      }

      router.push('/auth/signin')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado.'
      setError(message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5'>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <label htmlFor='name' className='block text-sm font-semibold text-emerald-900'>Nombre</label>
          <input
            id='name'
            name='name'
            type='text'
            required
            value={form.name}
            onChange={handleChange('name')}
            className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
            placeholder='John'
          />
        </div>
        <div className='space-y-2'>
          <label htmlFor='surname' className='block text-sm font-semibold text-emerald-900'>Apellidos</label>
          <input
            id='surname'
            name='surname'
            type='text'
            required
            value={form.surname}
            onChange={handleChange('surname')}
            className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
            placeholder='Doe'
          />
        </div>
      </div>

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
          autoComplete='new-password'
          value={form.password}
          onChange={handleChange('password')}
          className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
          placeholder='Al menos 6 caracteres'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='address' className='block text-sm font-semibold text-emerald-900'>Dirección</label>
        <input
          id='address'
          name='address'
          type='text'
          required
          value={form.address}
          onChange={handleChange('address')}
          className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
          placeholder='Calle, número, ciudad'
        />
      </div>

      <div className='space-y-2'>
        <label htmlFor='birthdate' className='block text-sm font-semibold text-emerald-900'>Fecha de nacimiento</label>
        <input
          id='birthdate'
          name='birthdate'
          type='date'
          required
          value={form.birthdate}
          onChange={handleChange('birthdate')}
          className='w-full rounded-xl border border-emerald-100 bg-white/70 px-4 py-3 text-emerald-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
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
        {pending ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}
