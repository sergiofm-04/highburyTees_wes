export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass max-w-md w-full space-y-6 rounded-3xl p-10 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-emerald-900 mb-3">Iniciar Sesión</h1>
          <p className="text-emerald-700/80">
             Sigue los pasos para iniciar sesión manualmente
          </p>
        </div>
        <ol className="space-y-3 text-sm text-emerald-900">
          <li className="flex items-start space-x-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">1</span>
            <span>Abre DevTools (F12) y ve a la pestaña <strong>Console</strong></span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">2</span>
            <span>Copia y pega el siguiente fragmento tal cual</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">3</span>
            <span>Pulsa Enter y recarga la página si no lo hace automáticamente</span>
          </li>
        </ol>
        <pre className="whitespace-pre-wrap rounded-2xl border border-emerald-200 bg-emerald-900 p-5 text-xs text-emerald-50 shadow-inner">
{`await fetch('http://localhost:3000/api/auth/signin', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ email: 'johndoe@example.com', password: '123456' })
});
location.reload();`}
        </pre>
      </div>
    </div>
  )
}
