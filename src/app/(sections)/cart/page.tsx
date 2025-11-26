import { getCart, type GetCartResponse, upsertCartItem, deleteCartItem, getUser } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'

async function updateCartItemAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') ?? '')
  const productId = String(formData.get('productId') ?? '')
  const qty = Number(formData.get('qty'))
  if (!userId || !productId || !Number.isFinite(qty)) return
  const session = await getSession()
  if (!session || session.userId.toString() !== userId || qty < 1) return
  const result = await upsertCartItem(userId, productId, qty)
  if (typeof result === 'string') return
  revalidatePath('/cart')
}

async function removeCartItemAction(formData: FormData) {
  'use server'
  const userId = String(formData.get('userId') ?? '')
  const productId = String(formData.get('productId') ?? '')
  if (!userId || !productId) return
  const session = await getSession()
  if (!session || session.userId.toString() !== userId) return
  const result = await deleteCartItem(userId, productId)
  if (typeof result === 'string') return
  revalidatePath('/cart')
}

export default async function Cart() {
  const session = await getSession()
  let cartItemsData: GetCartResponse | null = null
  let buyerName = 'Cliente'
  if (session) {
    cartItemsData = await getCart(session.userId)
    const user = await getUser(session.userId)
    if (user) {
      buyerName = `${user.name} ${user.surname}`.trim() || user.email
    }
  }

  return (
    <div className='flex flex-col gap-8'>
      <div className='glass rounded-3xl p-8 shadow-xl'>
        <div className='flex items-center space-x-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600'>
            <svg className='h-6 w-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
          </div>
          <div>
            <h3 className='text-3xl font-bold tracking-tight text-emerald-900'>Mi Carrito</h3>
            <p className='text-sm text-emerald-700/80'>Revisa tus productos antes de finalizar</p>
          </div>
        </div>
      </div>
      {!session ? (
        <div className='glass space-y-4 rounded-3xl p-8 shadow-xl'>
          <p className='text-sm text-emerald-800'>
            No hay sesión iniciada. Mientras preparamos la pantalla oficial, puedes autenticarte copiando este fragmento:
          </p>
          <ol className='space-y-2 text-sm text-emerald-700'>
            <li>1. Abre DevTools (F12) y ve a la pestaña Console.</li>
            <li>2. Pega la llamada de inicio de sesión y pulsa Enter.</li>
            <li>3. Refresca la página (F5) para cargar tu carrito.</li>
          </ol>
          <div>
            <div className='mb-1 text-xs uppercase tracking-wide text-emerald-700'>Sign in (John Doe)</div>
            <pre className='whitespace-pre-wrap rounded-xl bg-emerald-900/90 p-3 text-xs text-emerald-50 shadow-inner'>
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
        </div>
      ) : !cartItemsData || cartItemsData.items.length === 0 ? (
        <div className='glass rounded-3xl p-16 text-center shadow-xl'>
          <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10'>
            <svg className='h-12 w-12 text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
          </div>
          <h3 className='mb-2 text-xl font-semibold text-emerald-900'>Tu carrito está vacío</h3>
          <p className='text-sm text-emerald-700/80'>Comienza a agregar productos para continuar</p>
        </div>
      ) : (
        <div className='grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div className='space-y-6'>
            {cartItemsData.items.map((cartItem) => (
              <div key={cartItem.product._id} className='flex items-center gap-6 rounded-3xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.3)]'>
                <div className='relative h-24 w-24 overflow-hidden rounded-xl bg-gray-100/60'>
                  <Image
                    src={cartItem.product.img}
                    alt={cartItem.product.name}
                    fill
                    sizes='96px'
                    className='object-cover'
                    unoptimized
                  />
                </div>
                <div className='flex-1'>
                  <div className='font-semibold text-emerald-900'>
                    <Link href={`/products/${cartItem.product._id}`}>{cartItem.product.name}</Link>
                  </div>
                  <div className='text-emerald-700'>{cartItem.product.price.toFixed(2)} €</div>
                  <form action={updateCartItemAction} className='mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 text-sm text-emerald-900 shadow-[0_2px_8px_rgba(0,0,0,0.3)]'>
                    <input type='hidden' name='userId' value={session.userId.toString()} />
                    <input type='hidden' name='productId' value={cartItem.product._id} />
                    <div className='inline-flex items-center gap-2'>
                      <span className='text-xs font-semibold uppercase tracking-wide text-emerald-800'>Cantidad</span>
                      <button
                        type='submit'
                        name='qty'
                        value={String(Math.max(1, cartItem.qty - 1))}
                        className='h-8 w-8 rounded-full bg-black text-lg font-semibold text-white shadow-sm hover:bg-emerald-600'
                        aria-label='Reduce quantity'
                      >
                        −
                      </button>
                      <span className='min-w-[3rem] rounded-full bg-white px-3 py-1 text-center text-base font-semibold text-emerald-900 shadow-inner'>
                        {cartItem.qty}
                      </span>
                      <button
                        type='submit'
                        name='qty'
                        value={String(cartItem.qty + 1)}
                        className='h-8 w-8 rounded-full bg-black text-lg font-semibold text-white shadow-sm hover:bg-emerald-600'
                        aria-label='Increase quantity'
                      >
                        +
                      </button>
                    </div>
                    <button
                      type='submit'
                      formAction={removeCartItemAction}
                      className='rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-600'
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
          <aside className='space-y-5'>
            <div className='glass-dark rounded-3xl p-8 shadow-2xl'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold'>Total estimado</span>
                <span className='text-xl font-bold text-white'>
                  {cartItemsData.items
                    .reduce((acc, item) => acc + item.product.price * item.qty, 0)
                    .toFixed(2)}{' '}
                  €
                </span>
              </div>
              <p className='mt-2 text-sm text-emerald-200'>Finaliza la compra en la página de Checkout.</p>
              <Link
                href='/checkout'
                className='mt-6 block rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-center text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5'
              >
                Proceder al Checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}