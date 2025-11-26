import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import {
  createOrder,
  getCart,
  getUser,
  type CartItemDTO,
} from '@/lib/handlers'

async function finalizeOrderAction(formData: FormData) {
  'use server'
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const address = String(formData.get('address') ?? '').trim()
  const cardHolder = String(formData.get('cardHolder') ?? '').trim()
  const cardNumber = String(formData.get('cardNumber') ?? '')
    .replace(/\s+/g, '')
    .trim()

  if (!address || !cardHolder || cardNumber.length < 8) {
    redirect('/checkout?error=incomplete-data')
  }

  const result = await createOrder(session.userId.toString(), {
    address,
    cardHolder,
    cardNumber,
  })

  if (result === 'INVALID_ID' || result === 'NOT_FOUND_USER') {
    redirect('/auth/signin')
  }

  if (result === 'EMPTY_CART') {
    redirect('/cart')
  }

  revalidatePath('/cart')
  revalidatePath('/profile')
  revalidatePath('/orders')
  revalidatePath('/checkout')

  redirect(`/orders/${result._id}`)
}

function CartSummary({ items }: { items: CartItemDTO[] }) {
  const currency = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  })

  const total = items.reduce((acc, item) => acc + item.product.price * item.qty, 0)

  return (
    <div className='space-y-4'>
      {items.map((item) => (
        <article
          key={item.product._id}
          className='flex gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm'
        >
          <div className='relative h-20 w-20 overflow-hidden rounded-xl bg-emerald-100/60'>
            <Image
              src={item.product.img}
              alt={item.product.name}
              fill
              sizes='80px'
              className='object-cover'
              unoptimized
            />
          </div>
          <div className='flex flex-1 flex-col justify-between'>
            <div>
              <Link
                href={`/products/${item.product._id}`}
                className='font-semibold text-emerald-900 hover:text-emerald-600'
              >
                {item.product.name}
              </Link>
              <p className='text-sm text-emerald-700/80'>Cantidad: {item.qty}</p>
            </div>
            <span className='text-base font-semibold text-emerald-700'>
              {currency.format(item.product.price * item.qty)}
            </span>
          </div>
        </article>
      ))}
      <div className='flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-4 font-semibold text-emerald-900'>
        <span>Total</span>
        <span>{currency.format(total)}</span>
      </div>
    </div>
  )
}

export default async function CheckoutPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const [cartResponse, user] = await Promise.all([
    getCart(session.userId.toString()),
    getUser(session.userId),
  ])

  const items = cartResponse?.items ?? []
  const cartEmpty = items.length === 0
  const defaultAddress = user?.address ?? ''
  const defaultCardHolder = `${user?.name ?? ''} ${user?.surname ?? ''}`.trim()

  return (
    <section className='space-y-12'>
      <div className='glass rounded-3xl p-8 shadow-xl'>
        <div className='flex flex-wrap items-center justify-between gap-6'>
          <div className='flex items-center space-x-4'>
            <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600'>
              <svg className='h-7 w-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <div>
              <p className='text-sm font-medium text-emerald-600'>Paso final</p>
              <h1 className='text-3xl font-bold tracking-tight text-emerald-900'>Finalizar Compra</h1>
            </div>
          </div>
          <Link
            href='/cart'
            className='rounded-2xl border-2 border-emerald-500/30 px-6 py-2.5 text-sm font-semibold text-emerald-700 transition-all hover:border-emerald-500 hover:bg-emerald-50'
          >
            ← Volver al carrito
          </Link>
        </div>
      </div>

      {cartEmpty ? (
        <div className='glass rounded-3xl p-16 text-center shadow-xl'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10'>
            <svg className='h-12 w-12 text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
          </div>
          <h3 className='mb-3 text-2xl font-bold text-emerald-900'>Tu carrito está vacío</h3>
          <p className='mb-8 text-emerald-700/80'>Añade productos para poder completar la compra</p>
          <Link
            href='/'
            className='inline-flex rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5'
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className='grid gap-10 lg:grid-cols-[1.4fr_1fr]'>
          <div>
            <div className='mb-6 flex items-center space-x-3'>
              <div className='h-8 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-600'></div>
              <h2 className='text-2xl font-bold text-emerald-900'>Resumen del Pedido</h2>
            </div>
            <CartSummary items={items} />
          </div>
          <form
            action={finalizeOrderAction}
            className='glass space-y-8 rounded-3xl p-8 shadow-xl'
          >
            <div>
              <h3 className='text-lg font-semibold text-emerald-900'>Dirección de envío</h3>
              <label className='mt-3 block text-sm font-semibold text-emerald-800' htmlFor='address'>
                Dirección completa
              </label>
              <textarea
                id='address'
                name='address'
                defaultValue={defaultAddress}
                required
                rows={3}
                className='mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-3 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none'
                placeholder='Calle, número, ciudad'
              />
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-emerald-900'>Pago</h3>
              <div>
                <label className='block text-sm font-semibold text-emerald-800' htmlFor='cardHolder'>
                  Titular de la tarjeta
                </label>
                <input
                  id='cardHolder'
                  name='cardHolder'
                  type='text'
                  defaultValue={defaultCardHolder}
                  required
                  autoComplete='cc-name'
                  className='mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none'
                />
              </div>
              <div>
                <label className='block text-sm font-semibold text-emerald-800' htmlFor='cardNumber'>
                  Número de tarjeta
                </label>
                <input
                  id='cardNumber'
                  name='cardNumber'
                  type='text'
                  inputMode='numeric'
                  required
                  autoComplete='cc-number'
                  className='mt-2 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-sm text-emerald-900 shadow-sm focus:border-emerald-500 focus:outline-none'
                  placeholder='0000 0000 0000 0000'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5'
            >
              🔒 Confirmar y Finalizar Compra
            </button>
            <p className='text-center text-xs text-emerald-600'>No se realiza ningún cargo real</p>
          </form>
        </div>
      )}
    </section>
  )
}
