import ProductTile from '@/components/ProductTile'
import { getProducts } from '@/lib/handlers'

export default async function Index() {
	const data = await getProducts()
	return (
		<div className='flex flex-col gap-12'>
			<div className='glass rounded-3xl p-8 shadow-xl'>
				<div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
					<div className='space-y-2'>
						<div className='inline-flex items-center space-x-2 rounded-full bg-emerald-500/10 px-4 py-1.5'>
							<span className='h-2 w-2 animate-pulse rounded-full bg-emerald-500'></span>
							<span className='text-xs font-bold uppercase tracking-wider text-emerald-700'>Nueva Colección</span>
						</div>
						<h2 className='text-3xl font-bold tracking-tight text-emerald-900 lg:text-4xl'>Camisetas Destacadas</h2>
						<p className='text-base text-emerald-700/80'>Encuentra tu equipo favorito o descubre ediciones especiales limitadas</p>
					</div>
					<div className='text-sm text-emerald-600'>
						<span className='font-semibold'>{data.products.length}</span> productos disponibles
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{data.products.map((product) => (
					<ProductTile key={product._id.toString()} product={product} />
				))}
			</div>
		</div>
	)
}