export default function Header() {
	return (
		<header className='mx-auto w-full bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 px-6 pb-16 pt-28 text-center text-emerald-50 shadow lg:px-8 lg:pb-24 lg:pt-32'>
			<div className='mx-auto max-w-3xl space-y-6'>
				<span className='inline-flex items-center justify-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em]'>Highburytees WES</span>
				<h1 className='text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl'>Colección premium de camisetas de fútbol</h1>
				<p className='mx-auto max-w-2xl text-sm leading-7 text-emerald-50/90 sm:text-base'>Explora ediciones especiales y clásicos inolvidables con envío rápido y autenticidad garantizada.</p>
			</div>
		</header>
	)
}