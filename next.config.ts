import type { NextConfig } from "next";

function getR2Hostname(): string | null {
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim();
  if (!publicUrl) return null;

  try {
    const normalized = /^https?:\/\//.test(publicUrl)
      ? publicUrl
      : `https://${publicUrl}`;
    return new URL(normalized).hostname;
  } catch {
    return null;
  }
}

const r2Hostname = getR2Hostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname }]
      : [],
  },
};

export default nextConfig;
