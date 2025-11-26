export default function Footer() {
	return (
		<footer className='relative mt-auto w-full overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-emerald-50'>
			<div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-50'></div>
			<div className='relative mx-auto max-w-7xl px-6 py-12'>
				<div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
					<div className='space-y-3'>
						<h3 className='text-lg font-bold tracking-wide'>Highbury Tees</h3>
						<p className='text-sm leading-relaxed text-emerald-100/80'>
							Tu destino para camisetas de fútbol auténticas. Apasionados por el deporte y el diseño desde 2025.
						</p>
					</div>
					<div className='space-y-3'>
						<h4 className='text-sm font-semibold uppercase tracking-wider text-emerald-200'>Enlaces rápidos</h4>
						<ul className='space-y-2 text-sm text-emerald-100/70'>
						
							<li>
								<a
									href="https://www.youtube.com/shorts/PzDDMW0IuME"
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline hover:text-white transition-colors"
								>
									Sobre nosotros
								</a>
							</li>
						
						</ul>
					</div>
					<div className='space-y-3'>
						<h4 className='text-sm font-semibold uppercase tracking-wider text-emerald-200'>Contacto</h4>
						<p className='text-sm text-emerald-100/70'>info@highburytees.com</p>
					</div>
				</div>
				<div className='mt-12 border-t border-emerald-700/30 pt-8 text-center'>
					<p className='text-xs text-emerald-100/60'>
						Web Engineering and Services · &copy; {new Date().getFullYear()} Highburytees WES. Todos los derechos reservados.
					</p>
				</div>
			</div>
		</footer>
	)
}