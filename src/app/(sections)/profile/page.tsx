import { getSession } from '@/lib/auth'
import { getUser, getOrders } from '@/lib/handlers'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    return (
      <div className='max-w-3xl rounded-xl bg-gray-800/60 p-8 text-gray-100'>
        <h1 className='text-3xl font-bold text-white mb-4'>Perfil</h1>
        <p className='text-sm text-gray-300 mb-4'>Debes iniciar sesión de forma manual para ver tu información.</p>
        <pre className='rounded-lg bg-gray-900 p-4 text-xs text-gray-200 whitespace-pre-wrap'>
{`await fetch('http://localhost:3000/api/auth/signin', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: 'johndoe@example.com', password: '123456' })
});
location.reload();`}
        </pre>
      </div>
    )
  }

  const [user, orders] = await Promise.all([
    getUser(session.userId),
    getOrders(session.userId),
  ])

  if (!user || orders === 'INVALID_ID') {
    return (
      <div className='max-w-3xl rounded-xl bg-gray-800/60 p-8 text-gray-100'>
        <h1 className='text-3xl font-bold text-white mb-4'>Perfil</h1>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    )
  }

  return (
    <div className='space-y-10'>
      <div className='glass rounded-3xl p-8 shadow-xl'>
        <div className='flex items-center space-x-4'>
          <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-2xl font-bold text-white'>
            {user.name.charAt(0)}{user.surname.charAt(0)}
          </div>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-emerald-900'>¡Hola, {user.name}!</h1>
            <p className='text-sm text-emerald-700/80'>Bienvenido a tu perfil</p>
          </div>
        </div>
      </div>
      <section className='glass rounded-3xl p-8 shadow-xl'>
        <h2 className='mb-6 text-xl font-bold text-emerald-900'>Información Personal</h2>
        <dl className='grid gap-6 sm:grid-cols-2'>
          <div className='space-y-2'>
            <dt className='text-xs font-semibold uppercase tracking-wider text-emerald-600'>Nombre completo</dt>
            <dd className='text-lg font-medium text-emerald-900'>{user.name} {user.surname}</dd>
          </div>
          <div className='space-y-2'>
            <dt className='text-xs font-semibold uppercase tracking-wider text-emerald-600'>Email</dt>
            <dd className='text-lg font-medium text-emerald-900'>{user.email}</dd>
          </div>
          <div className='space-y-2'>
            <dt className='text-xs font-semibold uppercase tracking-wider text-emerald-600'>Dirección</dt>
            <dd className='text-lg font-medium text-emerald-900'>{user.address}</dd>
          </div>
          <div className='space-y-2'>
            <dt className='text-xs font-semibold uppercase tracking-wider text-emerald-600'>Fecha de nacimiento</dt>
            <dd className='text-lg font-medium text-emerald-900'>{new Date(user.birthdate).toLocaleDateString('es-ES')}</dd>
          </div>
        </dl>
      </section>

      <section className='glass rounded-3xl p-8 shadow-xl'>
        <div className='mb-6 flex items-center space-x-3'>
          <div className='h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600'></div>
          <h2 className='text-2xl font-bold text-emerald-900'>Historial de Compras</h2>
        </div>
        {orders.orders.length === 0 ? (
          <div className='rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-12 text-center'>
            <p className='text-white'>Aún no has realizado compras</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.orders.map((order) => {
              const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
              return (
                <article key={order._id} className='rounded-lg border border-gray-700 bg-gray-900/40 p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-white-300'>
                    <span>Pedido #{order._id.slice(-6)}</span>
                    <span>{new Date(order.date).toLocaleDateString('es-ES')}</span>
                    <span className='font-semibold text-emerald-400'>Total {orderTotal.toFixed(2)} €</span>
                  </div>
                  <ul className='mt-3 space-y-2 text-sm text-gray-200'>
                    {order.items.map((item, idx) => (
                      <li key={idx} className='flex justify-between'>
                        <span>Producto #{item.product}</span>
                        <span>x{item.qty} · {(item.price * item.qty).toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                  <div className='mt-4 text-right'>
                    <Link
                      href={`/orders/${order._id}`}
                      className='inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400'
                    >
                      Ver pedido completo
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
