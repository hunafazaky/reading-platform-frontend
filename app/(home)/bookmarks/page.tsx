"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkGrid } from "@/components/work-grid";

export default function BookmarksPage() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: async () => {
      const response = await api.get("/bookmarks");
      return response.data;
    },
  });

  return (
    <WorkGrid
      works={data?.bookmarks}
      page={data?.page}
      totalPages={data?.totalPages}
      isPending={isPending}
      isFetching={isFetching}
      error={error as Error | null}
      emptyMessage="There are no works saved yet"
    />
  );
}
