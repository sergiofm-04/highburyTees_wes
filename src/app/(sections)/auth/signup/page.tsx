import SignUpForm from '@/components/SignUpForm'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="glass w-full max-w-4xl rounded-3xl p-10 shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2m14-11a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-emerald-900">Crea tu cuenta</h1>
                <p className="text-sm text-emerald-700/80">Regístrate para guardar tu carrito y pedidos.</p>
              </div>
            </div>

            <SignUpForm />
            <p className="text-sm text-emerald-800">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/signin" className="font-semibold text-emerald-700 underline underline-offset-4">
                Inicia sesión
              </Link>
            </p>
          </div>

   
        </div>
      </div>
    </div>
  )
}
