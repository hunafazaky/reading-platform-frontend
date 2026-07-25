import EditWorkClient from "./page-client";
import axios from "axios";
import { notFound } from "next/navigation";
import { extractWorkId } from "@/lib/utils";
import { getServerApi } from "@/lib/api-server";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWorkData(id: string) {
  try {
    const api = await getServerApi();
    const res = await api.get(`/works/${id}`);
    const data = res.data;
    // Handle response if wrapped in { work: ... } or { data: ... }
    return data?.work || data?.data || data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `[Edit Page] Failed to fetch work (id: "${id}", status: ${error.response?.status}):`,
        error.response?.data || error.message,
      );
      if (error.response?.status === 404) {
        return null;
      }
    } else {
      console.error("[Edit Page] Unexpected error fetching work data:", error);
    }
    return null;
  }
}

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params;
  const workId = extractWorkId(slug);

  if (!workId) {
    notFound();
  }

  const currentWork = await getWorkData(workId);
  if (!currentWork) {
    notFound();
  }

  return <EditWorkClient initialData={currentWork} />;
}
