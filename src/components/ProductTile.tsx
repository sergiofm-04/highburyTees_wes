import type { ProductDTO } from '@/lib/handlers'
import Link from 'next/link'
import Image from 'next/image'

interface ProductTileProps {
  product: ProductDTO
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link
      href={`/products/${product._id}`}
      className='group block h-full rounded-2xl border border-gray-400 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-gray-600 hover:shadow-md'
    >
      <div className='relative aspect-h-4 aspect-w-3 w-full overflow-hidden rounded-xl bg-emerald-100/60'>
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          className='object-cover object-center transition duration-300 group-hover:scale-105'
          priority={false}
          unoptimized
        />
      </div>
      <h3 className='mt-4 text-base font-semibold text-emerald-900'>{product.name}</h3>
      <p className='mt-1 text-lg font-bold text-emerald-600'>{product.price + ' €'}</p>
    </Link>
  )
}