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
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-emerald-900 sm:pb-6 lg:pb-8'>
        Mi carrito
      </h3>
      {!session ? (
        <div className='space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 text-emerald-900 shadow-sm'>
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
          <div>
            <div className='mb-1 text-xs uppercase tracking-wide text-emerald-700'>Sign out (console)</div>
            <pre className='whitespace-pre-wrap rounded-xl bg-emerald-900/90 p-3 text-xs text-emerald-50 shadow-inner'>
{`await fetch('http://localhost:3000/api/auth/signout', { method: 'POST' });
location.reload();`}
            </pre>
          </div>
        </div>
      ) : !cartItemsData || cartItemsData.items.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-emerald-700'>Tu carrito está vacío</span>
        </div>
      ) : (
        <div className='grid gap-8 lg:grid-cols-[2fr_1fr]'>
          <div className='space-y-6'>
            {cartItemsData.items.map((cartItem) => (
              <div key={cartItem.product._id} className='flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm'>
                <div className='relative h-24 w-24 overflow-hidden rounded-xl bg-emerald-100/60'>
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
                  <form action={updateCartItemAction} className='mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-emerald-50/70 p-3 text-sm text-emerald-900'>
                    <input type='hidden' name='userId' value={session.userId.toString()} />
                    <input type='hidden' name='productId' value={cartItem.product._id} />
                    <div className='inline-flex items-center gap-2'>
                      <span className='text-xs font-semibold uppercase tracking-wide text-emerald-800'>Cantidad</span>
                      <button
                        type='submit'
                        name='qty'
                        value={String(Math.max(1, cartItem.qty - 1))}
                        className='h-8 w-8 rounded-full bg-emerald-500 text-lg font-semibold text-white shadow-sm hover:bg-emerald-600'
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
                        className='h-8 w-8 rounded-full bg-emerald-500 text-lg font-semibold text-white shadow-sm hover:bg-emerald-600'
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
            <div className='rounded-2xl border border-emerald-100 bg-white p-6 text-emerald-900 shadow-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-semibold'>Total estimado</span>
                <span className='text-xl font-bold text-emerald-600'>
                  {cartItemsData.items
                    .reduce((acc, item) => acc + item.product.price * item.qty, 0)
                    .toFixed(2)}{' '}
                  €
                </span>
              </div>
              <p className='mt-2 text-sm text-emerald-700'>Finaliza la compra en la página de Checkout.</p>
              <Link
                href='/checkout'
                className='mt-4 block rounded-full bg-emerald-500 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600'
              >
                Ir al checkout
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}