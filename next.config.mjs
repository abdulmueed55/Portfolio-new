/** @type {import('next').NextConfig} */
const wordpressHostname = process.env.NEXT_PUBLIC_WORDPRESS_HOSTNAME || "af.net";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: wordpressHostname,
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
