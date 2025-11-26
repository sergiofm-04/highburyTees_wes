import { ReactNode } from 'react'
import Link from 'next/link'
export const navbarButtonClasses =
'group relative rounded-2xl p-3 text-emerald-700 transition-all hover:bg-emerald-50 hover:text-emerald-900'
interface NavbarButtonProps {
href: string
children: ReactNode
}
export default function NavbarButton({ href, children }: NavbarButtonProps) {
return (
<Link href={href} className={navbarButtonClasses}>
<div className='absolute inset-0 rounded-2xl bg-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100'></div>
<div className='relative'>{children}</div>
</Link>
)
}