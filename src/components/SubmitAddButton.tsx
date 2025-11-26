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
      className='rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70'
    >
      {label}
    </button>
  )
}
