import type { ProductDTO } from '@/lib/handlers'
import Link from 'next/link'
import Image from 'next/image'

interface ProductTileProps {
  product: ProductDTO
}

export default function ProductTile({ product }: ProductTileProps) {
  return (
    <Link href={`/products/${product._id}`} className='group'>
      <div className='aspect-h-1 aspect-w-2 w-full overflow-hidden rounded-lg bg-gray-200'>
        <div className='relative h-full w-full'>
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
            className='object-cover object-center group-hover:opacity-75'
            priority={false}
          />
        </div>
      </div>
      <h3 className='mt-4 text-sm text-gray-900'>{product.name}</h3>
      <p className='mt-1 text-lg font-medium text-gray-900'>
        {product.price + ' €'}
      </p>
    </Link>
  )
}