"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWork } from "@/hooks/use-work";
import { WorkFormEdit } from "@/components/work-form-edit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkFormSkeleton } from "@/components/work-form-skeleton";
import { SiteHeader } from "@/components/site-header";

export default function WorkEditPage() {
  const params = useParams<{ id: string }>();
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Note: this also increments the work's reader_count, same as the read
  // page — GET /works/:id does that on every call, regardless of why it
  // was fetched. That's existing backend behavior, not specific to editing.
  const { work, isLoading, error, refetch } = useWork(params.id);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/auth/signin");
    }
  }, [isAuthLoading, user, router]);

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <SiteHeader title="Edit a Work" />
      {/* Loading state */}
      {isLoading && (
        <Card className="flex flex-col gap-4 lg:w-2/3 m-auto">
          <CardHeader>
            <Skeleton className="h-8 w-full" />
          </CardHeader>
          <CardContent>
            <WorkFormSkeleton />
          </CardContent>
        </Card>
      )}
      {/* Error state */}
      {error && (
        <section className="flex flex-col justify-center items-center gap-2">
          <h3 className="text-xl text-destructive font-bold">{error}</h3>
          <Button onClick={refetch}>Try again</Button>
        </section>
      )}
      {/* Ownership check: the backend would reject the PATCH anyway
          (403), but checking here avoids showing an editable form for a
          work that isn't the signed-in user's in the first place. */}
      {!isLoading && !error && work && work.writer.id !== user.id && (
        <section className="flex justify-center">
          <h2 className="text-2xl text-muted-foreground font-bold">
            You can only edit your own works.
          </h2>
        </section>
      )}
      {!isLoading && !error && work && work.writer.id === user.id && (
        <Card className="flex flex-col gap-4 lg:w-2/3 m-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit work</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkFormEdit work={work} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
