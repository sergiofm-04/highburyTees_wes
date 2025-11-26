export default function Header() {
  return (
    <header className='relative mx-auto w-full overflow-hidden px-6 pb-20 pt-32 text-center lg:px-8 lg:pb-28 lg:pt-40'>
      <div className='absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500'>
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
        <div className='absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-400/30 blur-3xl'></div>
        <div className='absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-teal-400/30 blur-3xl'></div>
      </div>
      <div className='relative mx-auto max-w-5xl space-y-8'>
        <div className='inline-flex items-center justify-center space-x-2 rounded-full border border-white/30 bg-white/10 px-6 py-2 backdrop-blur-sm'>
          <span className='h-2 w-2 animate-pulse rounded-full bg-white'></span>
          <span className='text-xs font-bold uppercase tracking-[0.3em] text-white'>Highburytees WES</span>
        </div>
        <h1 className='text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl'>
          Colección Premium
          <span className='block bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent'>de Camisetas de Fútbol</span>
        </h1>
        <p className='mx-auto max-w-2xl text-lg leading-relaxed text-emerald-50/90 drop-shadow-lg sm:text-xl'>
          Descubre ediciones exclusivas, camisetas retro legendarias y las últimas colecciones de los mejores clubes del mundo
        </p>
        <div className='flex flex-wrap items-center justify-center gap-4 pt-4'>
          <div className='flex items-center space-x-2 text-emerald-50'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span className='text-sm font-medium'>100% Originales</span>
          </div>
          <div className='flex items-center space-x-2 text-emerald-50'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span className='text-sm font-medium'>Mejor Precio</span>
          </div>
          <div className='flex items-center space-x-2 text-emerald-50'>
            <svg className='h-5 w-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
            </svg>
            <span className='text-sm font-medium'>Envío Rápido</span>
          </div>
        </div>
      </div>
    </header>
  )
}