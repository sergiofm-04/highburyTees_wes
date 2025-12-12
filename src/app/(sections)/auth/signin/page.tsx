import SignInForm from '@/components/SignInForm'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass w-full max-w-3xl rounded-3xl p-10 shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Inicia sesión</h1>
                <p className="text-sm text-emerald-700/80">Accede a tu cuenta y continúa tu compra.</p>
              </div>
            </div>

            <SignInForm />
            <p className="text-sm text-emerald-800">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/signup" className="font-semibold text-emerald-700 underline underline-offset-4">
                Regístrate aquí
              </Link>
            </p>
          </div>

      
        </div>
      </div>
    </div>
  )
}
