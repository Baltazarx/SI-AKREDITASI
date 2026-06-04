/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for Cloudflare Pages static export
  output: 'export',
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Allow useSearchParams without Suspense boundary (all pages are 'use client')
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
