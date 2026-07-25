import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Platform - Authentication",
};

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-full flex flex-col">{children}</div>;
}
