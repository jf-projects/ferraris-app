/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['res.cloudinary.com'], // Add Cloudinary domain here
    },
}

module.exports = nextConfig
