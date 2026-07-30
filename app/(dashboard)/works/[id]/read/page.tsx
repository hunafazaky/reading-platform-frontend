"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useWork } from "@/hooks/use-work";
import { Button } from "@/components/ui/button";
import { WorkRead } from "@/components/work-read";
import { WorkReadSkeleton } from "@/components/work-read-skeleton";
import { SiteHeader } from "@/components/site-header";
// Same idea as the works list page: just fetching + state handling, no
// styling. useWork() also exposes "setWork" and "refetch", which the
// upcoming bookmark/rating steps will use to update this page's data
// without necessarily reloading everything.
export default function WorkReadPage() {
  // useParams() reads the [id] segment from the URL. Using this hook
  // instead of a "params" prop keeps this a plain Client Component,
  // consistent with the rest of the app.
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const { work, isLoading, error, refetch } = useWork(params.id);
  // import { SiteHeader } from "@/components/site-header";

  const isOwner = !!user && !!work && work.writer.id === user.id;

  return (
    <div className="flex flex-col gap-8">
      <SiteHeader title="Read a Work" />
      {/* Loading state */}
      {isLoading && <WorkReadSkeleton />}
      {/* Error state (e.g. work not found, or a network problem) */}
      {error && (
        <section className="flex flex-col justify-center items-center gap-2">
          <h3 className="text-xl text-destructive font-bold">{error}</h3>
          <Button onClick={refetch}>Try again</Button>
        </section>
      )}
      {/* Data state */}
      {!isLoading && !error && work && (
        <WorkRead data={work} isOwner={isOwner} />
      )}
    </div>
  );
}
