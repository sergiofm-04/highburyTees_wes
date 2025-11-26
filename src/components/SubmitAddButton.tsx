'use client'

import { useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'

interface SubmitAddButtonProps {
  idleLabel?: string
  successLabel?: string
  successDurationMs?: number
}

export default function SubmitAddButton({
  idleLabel = 'Añadir al carrito',
  successLabel = 'Añadido al carrito',
  successDurationMs = 2000,
}: SubmitAddButtonProps) {
  const { pending } = useFormStatus()
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    if (!justAdded) return
    const timer = setTimeout(() => setJustAdded(false), successDurationMs)
    return () => clearTimeout(timer)
  }, [justAdded, successDurationMs])

  const label = justAdded ? successLabel : pending ? 'Añadiendo…' : idleLabel

  return (
    <button
      type='submit'
      onClick={() => setJustAdded(true)}
      disabled={pending}
      className='group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0'
    >
      <div className='absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 transition-opacity group-hover:opacity-100'></div>
      <span className='relative flex items-center justify-center space-x-2'>
        {pending ? (
          <svg className='h-5 w-5 animate-spin' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
          </svg>
        ) : justAdded ? (
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        ) : (
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
          </svg>
        )}
        <span className='uppercase tracking-wide'>{label}</span>
      </span>
    </button>
  )
}
