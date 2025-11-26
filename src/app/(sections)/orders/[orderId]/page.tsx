import { notFound, redirect } from 'next/navigation'
import { Types } from 'mongoose'
import { getSession } from '@/lib/auth'
import { getOrder } from '@/lib/handlers'
import Link from 'next/link'

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params
  if (!Types.ObjectId.isValid(orderId)) {
    notFound()
  }

  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const order = await getOrder(session.userId, orderId)
  if (order === 'INVALID_IDS' || order === 'NOT_FOUND') {
    notFound()
  }

  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  const maskedCard = order.cardNumber.replace(/.(?=.{4})/g, '•')
  const formattedDate = new Date(order.date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className='space-y-6 rounded-xl bg-gray-800/60 p-6 text-gray-100 shadow-lg'>
      <header className='space-y-2 border-b border-gray-700 pb-4'>
        <h1 className='text-3xl font-bold text-white'>Pedido #{order._id.slice(-6)}</h1>
        <div className='grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4'>
          <div>
            <p className='text-xs uppercase tracking-wide text-gray-400'>ID completo</p>
            <p className='font-mono text-white'>{order._id}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-gray-400'>Fecha</p>
            <p className='text-white'>{formattedDate}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-gray-400'>Dirección de envío</p>
            <p className='text-white'>{order.address}</p>
          </div>
          <div>
            <p className='text-xs uppercase tracking-wide text-gray-400'>Pago</p>
            <p className='text-white'>{order.cardHolder}</p>
            <p className='font-mono text-sm text-gray-200'>{maskedCard}</p>
          </div>
        </div>
      </header>

      <section>
        <h2 className='mb-3 text-xl font-semibold text-white'>Artículos del pedido</h2>
        <div className='overflow-hidden rounded-lg border border-gray-700 bg-gray-900/40'>
          <div className='grid grid-cols-[2fr_repeat(3,1fr)] border-b border-gray-700 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400'>
            <span>Producto</span>
            <span className='text-center'>Cantidad</span>
            <span className='text-center'>Precio</span>
            <span className='text-right'>Total</span>
          </div>
          {order.items.map((item) => (
            <div key={item.product._id} className='grid grid-cols-[2fr_repeat(3,1fr)] items-center px-4 py-3 text-sm text-gray-100'>
              <Link href={`/products/${item.product._id}`} className='font-medium text-emerald-300 hover:text-emerald-200'>
                {item.product.name}
              </Link>
              <span className='text-center'>{item.qty}</span>
              <span className='text-center'>{item.price.toFixed(2)} €</span>
              <span className='text-right font-semibold'>{(item.price * item.qty).toFixed(2)} €</span>
            </div>
          ))}
        </div>
      </section>

      <div className='flex flex-col items-end gap-2 border-t border-gray-700 pt-4 text-lg text-white'>
        <p>
          Importe final: <span className='font-bold'>{total.toFixed(2)} €</span>
        </p>
      </div>
    </div>
  )
}
