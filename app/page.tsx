"use client";

// import { SignupForm } from "@/components/signup-form"
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/auth/signin");
    } else {
      console.log(user)
      router.replace("/home");
    }
  }, [user, router, isLoading]);

  if (user || isLoading) {
    return null;
  }

  return;
}
