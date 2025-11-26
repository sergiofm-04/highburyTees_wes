import ProductTile from '@/components/ProductTile'
import { getProducts } from '@/lib/handlers'

export default async function Index() {
	const data = await getProducts()
	return (
		<div className='flex flex-col gap-8'>
			<div className='flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
				<div>
					<h2 className='text-2xl font-semibold text-emerald-900'>Camisetas destacadas</h2>
					<p className='text-sm text-emerald-700/80'>Encuentra tu equipo favorito o descubre nuevas ediciones especiales.</p>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-10'>
				{data.products.map((product) => (
					<ProductTile key={product._id.toString()} product={product} />
				))}
			</div>
		</div>
	)
}