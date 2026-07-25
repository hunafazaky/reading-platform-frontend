"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkGrid } from "@/components/work-grid";

export default function TimelinePage() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["works"],
    queryFn: async () => {
      const response = await api.get("/works");
      return response.data;
    },
  });

  return (
    <WorkGrid
      works={data?.works}
      page={data?.page}
      totalPages={data?.totalPages}
      isPending={isPending}
      isFetching={isFetching}
      error={error as Error | null}
      emptyMessage="No works found in timeline"
    />
  );
}
