import { getSession } from '@/lib/auth'
import { upsertCartItem } from '@/lib/handlers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import SubmitAddButton from '@/components/SubmitAddButton'

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
    <form action={addToCart} className='mt-8 flex flex-col gap-4'>
      <input type='hidden' name='productId' value={productId} />
      {showQuantity ? (
        <div className='flex items-center gap-4'>
          <label className='text-sm font-semibold uppercase tracking-wider text-emerald-700' htmlFor={`qty-${productId}`}>
            Cantidad
          </label>
          <input
            id={`qty-${productId}`}
            type='number'
            name='qty'
            min={1}
            defaultValue={1}
            className='w-28 rounded-2xl border-2 border-emerald-200 bg-white px-4 py-2.5 text-center text-base font-semibold text-emerald-900 shadow-sm transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20'
          />
        </div>
      ) : (
        <input type='hidden' name='qty' value='1' />
      )}
      <SubmitAddButton />
    </form>
  )
}
