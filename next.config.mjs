/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Authorizes our fallback string
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Authorizes local development image uploads
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Authorizes all Google profile picture subdomains (lh3, lh4, etc.)
      },
      {
        protocol: 'https',
        hostname: 'ibb.co/**', // Authorizes ImgBB direct image links
      },
      // 💡 Add any production storage host domains here later (e.g., s3, Cloudinary)
    ],
  },
};

export default nextConfig;
