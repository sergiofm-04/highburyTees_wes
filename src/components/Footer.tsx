export default function Footer() {
	return (
		<footer className='mt-auto w-full bg-emerald-900/95 text-emerald-50'>
			<div className='mx-auto flex max-w-screen-xl flex-col items-center gap-4 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left'>
				<div>
					<p className='text-sm font-semibold tracking-wide'>Highbury Tees</p>
					<p className='text-xs text-emerald-100/80'>Apasionados por el fútbol y el diseño desde 2025.</p>
				</div>
				<span className='text-xs text-emerald-100/70'>Web Engineering and Services · &copy; {new Date().getFullYear()} Highburytees WES</span>
			</div>
		</footer>
	)
}