/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.footballkitarchive.com',
				port: '',
				pathname: '/**',
			},
		],
		// Avoid server-side fetch of remote images during development to prevent DNS/network failures
		unoptimized: isDev,
	},
};

export default nextConfig;
