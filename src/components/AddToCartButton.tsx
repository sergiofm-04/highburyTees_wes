import { getSession } from '@/lib/auth'
import { upsertCartItem } from '@/lib/handlers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type Props = {
  productId: string
  showQuantity?: boolean
}

export default function AddToCartButton({ productId, showQuantity = false }: Props) {
  async function addToCart(formData: FormData) {
    'use server'
    const session = await getSession()
    if (!session) {
      redirect('/cart')
    }
    const qtyValue = Number(formData.get('qty') ?? 1)
    const qty = Number.isFinite(qtyValue) && qtyValue > 0 ? qtyValue : 1
    const result = await upsertCartItem(session.userId.toString(), productId, qty)
    if (typeof result !== 'string') {
      revalidatePath('/cart')
    }
  }

  return (
    <form action={addToCart} className='mt-4 flex items-center gap-3'>
      <input type='hidden' name='productId' value={productId} />
      {showQuantity ? (
        <>
          <label className='text-sm text-gray-700' htmlFor={`qty-${productId}`}>Qty</label>
          <input
            id={`qty-${productId}`}
            type='number'
            name='qty'
            min={1}
            defaultValue={1}
            className='w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-900'
          />
        </>
      ) : (
        <input type='hidden' name='qty' value='1' />
      )}
      <button
        type='submit'
        className='rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-black'
      >
        Add to cart
      </button>
    </form>
  )
}
