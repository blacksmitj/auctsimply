import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gtkagluqfkofjnulouay.storage.supabase.co",
        port: "",
        pathname: "/storage/v1/s3/**",
      },
      {
        protocol: "https",
        hostname: "gtkagluqfkofjnulouay.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
