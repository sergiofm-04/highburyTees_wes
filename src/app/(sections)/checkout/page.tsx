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
      <div className='flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 font-semibold text-emerald-900'>
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
    <section className='space-y-10'>
      <header className='flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white/80 p-6 shadow-sm backdrop-blur'>
        <div>
          <p className='text-sm text-emerald-700'>Revisa tu carrito y finaliza la compra</p>
          <h1 className='text-3xl font-bold text-emerald-900'>Checkout</h1>
        </div>
        <Link
          href='/cart'
          className='rounded-full border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-500 hover:text-white'
        >
          Volver al carrito
        </Link>
      </header>

      {cartEmpty ? (
        <div className='rounded-3xl border border-dashed border-emerald-200 bg-white/80 p-12 text-center text-emerald-800 shadow-inner'>
          <p className='text-lg font-semibold text-emerald-900'>Tu carrito está vacío</p>
          <p className='mt-2 text-sm'>Añade productos para poder completar la compra.</p>
          <Link
            href='/products'
            className='mt-6 inline-flex rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600'
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className='grid gap-10 lg:grid-cols-[1.4fr_1fr]'>
          <div>
            <h2 className='mb-4 text-xl font-semibold text-emerald-900'>Resumen del carrito</h2>
            <CartSummary items={items} />
          </div>
          <form
            action={finalizeOrderAction}
            className='space-y-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-sm backdrop-blur'
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
              className='w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-emerald-600'
            >
              Finalizar compra
            </button>
            <p className='text-xs text-emerald-700'>No se realizará ningún cargo real. Pulsar el botón registrará la compra en tu cuenta.</p>
          </form>
        </div>
      )}
    </section>
  )
}
