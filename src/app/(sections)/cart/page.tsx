import { redirect } from 'next/navigation'
import { getCart, type GetCartResponse } from '@/lib/handlers'
import Link from 'next/link'
import { getSession } from '@/lib/auth'

export default async function Cart() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const cartRes = await getCart(session.userId)
  if (!cartRes) {
    redirect('/auth/signin')
  }
  const cartItemsData: GetCartResponse = cartRes

  return (
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
  {cartItemsData.items.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          {cartItemsData.items.map((cartItem) => (
            <div key={cartItem.product._id}>
              <Link href={`/products/${cartItem.product._id}`}>
                {cartItem.product.name}
              </Link>
              <br />
              {cartItem.qty}
              <br />
              {cartItem.product.price.toFixed(2) + ' €'}
            </div>
          ))}
        </>
      )}
    </div>
  )
}