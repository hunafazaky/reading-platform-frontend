"use client";

import { Work } from "@/types";
import { CardWork } from "@/components/card-work";
import { CardWorkSkeleton } from "@/components/card-work-skeleton";
import { SpinnerFetch } from "@/components/spinner-fetch";
import { AppPagination } from "@/components/app-pagination";

interface WorkGridProps {
  works?: Work[];
  page?: number;
  totalPages?: number;
  isPending: boolean;
  isFetching?: boolean;
  error: Error | null;
  emptyMessage?: string;
}

export function WorkGrid({
  works = [],
  page,
  totalPages,
  isPending,
  isFetching = false,
  error,
  emptyMessage = "There are no works found",
}: WorkGridProps) {
  if (isPending) {
    return (
      <section>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <li key={index}>
              <CardWorkSkeleton />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-8 text-center text-red-500">
        An error has occurred: {error.message}
      </section>
    );
  }

  return (
    <section className="relative">
      {isFetching && <SpinnerFetch />}
      {works && works.length > 0 ? (
        <div>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
            {works.map((work, index) => {
              const key = work?.id || (work as any)?.work?.id || index;
              return (
                <li key={key}>
                  <CardWork work={work} />
                </li>
              );
            })}
          </ul>
          {page !== undefined && totalPages !== undefined && (
            <AppPagination page={page} totalPages={totalPages} />
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center p-40">
          <p className="text-xl opacity-70">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
}
