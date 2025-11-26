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
    <div className='space-y-8 rounded-xl bg-gray-800/60 p-8 text-gray-100'>
      <section>
        <h1 className='text-3xl font-bold text-white mb-4'>Perfil de {user.name}</h1>
        <dl className='grid gap-4 sm:grid-cols-2 text-sm'>
          <div>
            <dt className='text-gray-400 uppercase text-xs tracking-wide'>Nombre completo</dt>
            <dd className='text-white text-lg'>{user.name} {user.surname}</dd>
          </div>
          <div>
            <dt className='text-gray-400 uppercase text-xs tracking-wide'>Email</dt>
            <dd className='text-white text-lg'>{user.email}</dd>
          </div>
          <div>
            <dt className='text-gray-400 uppercase text-xs tracking-wide'>Dirección</dt>
            <dd className='text-white text-lg'>{user.address}</dd>
          </div>
          <div>
            <dt className='text-gray-400 uppercase text-xs tracking-wide'>Fecha de nacimiento</dt>
            <dd className='text-white text-lg'>{new Date(user.birthdate).toLocaleDateString('es-ES')}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2 className='text-2xl font-semibold text-white mb-4'>Compras recientes</h2>
        {orders.orders.length === 0 ? (
          <p className='text-gray-300 text-sm'>Aún no has realizado compras.</p>
        ) : (
          <div className='space-y-4'>
            {orders.orders.map((order) => {
              const orderTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
              return (
                <article key={order._id} className='rounded-lg border border-gray-700 bg-gray-900/40 p-4'>
                  <div className='flex flex-wrap items-center justify-between gap-2 text-sm text-gray-300'>
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
