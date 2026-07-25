import PageClient from "./page-client";
import axios from "axios";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getWorkData(id: string) {
  const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8080";
  try {
    const response = await axios.get(`${baseUrl}/api/works/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Failed to fetch work data in Read page:", error);
    return null;
  }
}

export default async function Read({ params }: PageProps) {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const workId = slugParts.pop() || "";

  if (!workId) {
    notFound();
  }

  const data = await getWorkData(workId);
  if (!data) {
    notFound();
  }

  return (
    <div>
      <PageClient data={data} />
    </div>
  );
}
