import { notFound } from 'next/navigation'
import { Types } from 'mongoose'

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound()
  }
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-2xl w-full rounded-lg bg-gray-800/60 p-8">
        <h1 className="text-2xl font-bold text-white mb-4">Order {params.orderId}</h1>
        <p className="text-gray-300">Show order details here.</p>
      </div>
    </div>
  )
}
