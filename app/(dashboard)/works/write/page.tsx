"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { WorkFormWrite } from "@/components/work-form-write";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkFormSkeleton } from "@/components/work-form-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";

// Same route-guard pattern as app/signin/page.tsx, just in the opposite
// direction: this page requires being signed IN, so anyone who isn't gets
// redirected to sign in first instead of seeing the form.
export default function WorkWritePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/signin");
    }
  }, [isLoading, user, router]);

  return (
    <div className="flex flex-col gap-8">
      <SiteHeader title="Write a Work" />
      {/* Loading */}
      {isLoading || !user ? (
        <Card className="flex flex-col gap-4 lg:w-2/3 m-auto">
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent>
            <WorkFormSkeleton />
          </CardContent>
        </Card>
      ) : (
        <Card className="flex flex-col gap-4 lg:w-2/3 m-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Publish a new work
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkFormWrite />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
