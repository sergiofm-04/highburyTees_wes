import { Types } from 'mongoose'
import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/handlers'
import Image from 'next/image'

export default async function Product({
  params,
}: {
  params: { productId: string }
}) {
  if (!Types.ObjectId.isValid(params.productId)) {
    notFound()
  }

  const product = await getProduct(params.productId)
  if (product === null) {
    notFound()
  }

  return (
    <div className="flex flex-col items-center w-full">
  <h3 className="pb-4 text-3xl font-bold text-white sm:pb-6 lg:pb-8 w-full text-center">
        {product.name}
      </h3>
      <div className="flex flex-col md:flex-row md:items-start w-full max-w-4xl gap-8 bg-white/80 rounded-xl p-6 shadow-lg">
        {/* Imagen del producto */}
        <div className="relative aspect-[6/7] w-full md:w-2/3 max-w-2xl overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center"
            priority={false}
            unoptimized
          />
        </div>
        {/* Detalles */}
        <div className="flex-1 flex flex-col justify-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Product details</h4>
          {product.description && (
            <p className="text-gray-700 mb-8 max-w-prose">{product.description}</p>
          )}
          <div className="text-4xl font-bold text-gray-900 mb-4">{product.price.toFixed(2)} €</div>
        </div>
      </div>
    </div>
  )
}