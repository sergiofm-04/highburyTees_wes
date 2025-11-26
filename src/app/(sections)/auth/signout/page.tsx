import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const snippet = `await fetch('http://localhost:3000/api/auth/signout', { method: 'POST' });
location.reload();`

export default async function ManualSignOutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <section className='max-w-3xl rounded-2xl bg-gray-800/60 p-8 text-gray-100'>
      <header className='mb-6 space-y-1'>
        <p className='text-sm uppercase tracking-wide text-emerald-300'>Salir de la cuenta</p>
        <h1 className='text-3xl font-bold text-white'>Cierre de sesión manual</h1>
        <p className='text-sm text-gray-300'>
          Sigue los pasos para realizar la petición manual que cierra tu sesión. No se ejecutará ningún script
          automático: tendrás que lanzar la petición en la consola del navegador.
        </p>
      </header>

      <ol className='space-y-3 text-sm text-gray-200'>
        <li>
          <span className='font-semibold text-white'>1.</span> Abre las herramientas de desarrollador (F12) y ve a la pestaña <strong>Console</strong>.
        </li>
        <li>
          <span className='font-semibold text-white'>2.</span> Copia y pega el siguiente fragmento exactamente como aparece.
        </li>
        <li>
          <span className='font-semibold text-white'>3.</span> Pulsa Enter. La petición cerrará tu sesión y recargará la pestaña.
        </li>
      </ol>

      <pre className='mt-5 whitespace-pre-wrap rounded-xl bg-gray-900/80 p-4 text-xs text-emerald-100'>
{snippet}
      </pre>

      <p className='mt-6 text-sm text-gray-400'>Si la recarga no ocurre automáticamente, actualiza manualmente la página para confirmar que la sesión se cerró.</p>

      <div className='mt-8 flex flex-wrap gap-3'>
        <Link
          href='/profile'
          className='inline-flex items-center justify-center rounded-full border border-gray-500 px-5 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700'
        >
          Volver al perfil
        </Link>
        <Link
          href='/'
          className='inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400'
        >
          Ir al inicio
        </Link>
      </div>
    </section>
  )
}
