import type { ProductDTO } from '@/lib/handlers'
import Link from 'next/link'
import Image from 'next/image'

interface ProductTileProps {
  product: ProductDTO
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link href={`/products/${product._id}`} className='group block rounded-xl bg-white/5 p-3 shadow hover:bg-white/10'>
      <div className='relative aspect-h-4 aspect-w-3 w-full overflow-hidden rounded-lg bg-gray-200'>
        <Image
          src={product.img}
          alt={product.name}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
          className='object-cover object-center transition group-hover:scale-105'
          priority={false}
          unoptimized
        />
      </div>
      <h3 className='mt-4 text-sm text-white'>{product.name}</h3>
      <p className='mt-1 text-lg font-medium text-white'>
        {product.price + ' €'}
      </p>
    </Link>
  )
}