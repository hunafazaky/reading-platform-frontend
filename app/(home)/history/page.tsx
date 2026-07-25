"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { WorkGrid } from "@/components/work-grid";

export default function HistoryPage() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await api.get("/history");
      console.log(response.data)
      return response.data;
    },
  });

  return (
    <WorkGrid
      works={data?.histories || data?.history}
      page={data?.page}
      totalPages={data?.totalPages}
      isPending={isPending}
      isFetching={isFetching}
      error={error as Error | null}
      emptyMessage="There are no read history yet"
    />
  );
}
