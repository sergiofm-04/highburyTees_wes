import { getCart, type GetCartResponse, upsertCartItem, deleteCartItem } from '@/lib/handlers'
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
  if (session) {
    cartItemsData = await getCart(session.userId)
  }

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      {!session ? (
        <div className='space-y-4 rounded-lg bg-gray-800/60 p-6 text-gray-100'>
          <p className='text-sm text-gray-200'>
            No session detected. Mientras no tengamos página de inicio de sesión, sigue estos pasos manuales:
          </p>
          <ol className='space-y-2 text-sm text-gray-200'>
            <li>1. Abre DevTools (F12) y ve a la pestaña Console.</li>
            <li>2. Pega la llamada de inicio de sesión y pulsa Enter.</li>
            <li>3. Refresca la página (F5) para cargar tu carrito.</li>
          </ol>
          <div>
            <div className='mb-1 text-xs uppercase tracking-wide text-gray-300'>Sign in (John Doe)</div>
            <pre className='whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-xs text-gray-100'>
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
            <div className='mb-1 text-xs uppercase tracking-wide text-gray-300'>Sign out (console)</div>
            <pre className='whitespace-pre-wrap rounded-md bg-gray-900 p-3 text-xs text-gray-100'>
{`await fetch('http://localhost:3000/api/auth/signout', { method: 'POST' });
location.reload();`}
            </pre>
          </div>
        </div>
      ) : !cartItemsData || cartItemsData.items.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          <div className='space-y-6'>
            {cartItemsData.items.map((cartItem) => (
              <div key={cartItem.product._id} className='flex items-center gap-4 rounded-lg bg-gray-800/50 p-4'>
                <div className='relative h-24 w-24 overflow-hidden rounded-md bg-gray-700'>
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
                  <div className='font-semibold text-white'>
                    <Link href={`/products/${cartItem.product._id}`}>{cartItem.product.name}</Link>
                  </div>
                  <div className='text-gray-300'>{cartItem.product.price.toFixed(2)} €</div>
                  <form action={updateCartItemAction} className='mt-3 flex flex-wrap items-center gap-3 rounded-md bg-gray-900/40 p-3 text-sm text-gray-100'>
                    <input type='hidden' name='userId' value={session.userId.toString()} />
                    <input type='hidden' name='productId' value={cartItem.product._id} />
                    <div className='inline-flex items-center gap-2'>
                      <span className='text-xs uppercase tracking-wide text-gray-300'>Cantidad</span>
                      <button
                        type='submit'
                        name='qty'
                        value={String(Math.max(1, cartItem.qty - 1))}
                        className='h-8 w-8 rounded-full bg-gray-700 text-lg font-semibold text-white hover:bg-gray-600'
                        aria-label='Reduce quantity'
                      >
                        −
                      </button>
                      <span className='min-w-[3rem] text-center text-base font-semibold text-white'>
                        {cartItem.qty}
                      </span>
                      <button
                        type='submit'
                        name='qty'
                        value={String(cartItem.qty + 1)}
                        className='h-8 w-8 rounded-full bg-gray-700 text-lg font-semibold text-white hover:bg-gray-600'
                        aria-label='Increase quantity'
                      >
                        +
                      </button>
                    </div>
                    <button
                      type='submit'
                      formAction={removeCartItemAction}
                      className='rounded-md bg-red-600 px-3 py-1 font-semibold text-white hover:bg-red-500'
                    >
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4 flex items-center justify-end gap-4'>
            <div className='text-xl font-bold text-white'>Total: {cartItemsData.items.reduce((acc, it) => acc + it.product.price * it.qty, 0).toFixed(2)} €</div>
          </div>
        </>
      )}
    </div>
  )
}