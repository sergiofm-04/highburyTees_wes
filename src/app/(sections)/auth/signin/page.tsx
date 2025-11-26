export default function SignInPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="max-w-md w-full space-y-4 rounded-lg bg-gray-800/60 p-8 text-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Iniciar sesión</h1>
          <p className="text-sm text-gray-300">
             Sigue los pasos para iniciar sesión manualmente.
          </p>
        </div>
        <ol className="space-y-2 text-sm text-gray-200">
          <li>
            <span className="font-semibold text-white">1.</span> Abre DevTools (F12) y ve a la pestaña <strong>Console</strong>.
          </li>
          <li>
            <span className="font-semibold text-white">2.</span> Copia y pega el siguiente fragmento tal cual.
          </li>
          <li>
            <span className="font-semibold text-white">3.</span> Pulsa Enter y recarga la página si no lo hace automáticamente.
          </li>
        </ol>
        <pre className="whitespace-pre-wrap rounded-lg bg-gray-900 p-4 text-xs text-gray-200">
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
