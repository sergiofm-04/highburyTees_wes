import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import React from 'react'
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='relative flex min-h-screen flex-col'>
			<div className='fixed inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'>
				<div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2316a34a" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-40'></div>
			</div>
			<Navbar />
			<Header />
			<main className='relative mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8'>{children}</main>
			<Footer />
		</div>
	)
}