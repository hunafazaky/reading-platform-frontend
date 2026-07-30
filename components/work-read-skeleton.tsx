import { Skeleton } from "./ui/skeleton";

export function WorkReadSkeleton() {
  return (
    <article className="flex flex-col gap-4 lg:w-2/3  m-auto">
      <section>
        <Skeleton className="bg-stone-200 h-10 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-4 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-4 w-full mb-1" />
        <Skeleton className="bg-stone-200 aspect-video w-full" />
      </section>
      <section>
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-3/4 mb-4" />
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-6 w-3/4 mb-4" />
      </section>
    </article>
  );
}
