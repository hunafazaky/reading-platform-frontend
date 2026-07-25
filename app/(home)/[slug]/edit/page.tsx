import EditWorkClient from "./page-client";
import axios from "axios";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWorkData(id: string) {
  const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8080";
  try {
    const res = await axios.get(`${baseUrl}/api/works/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch work data in Edit page:", error);
    return null;
  }
}

export default async function EditPage({ params }: PageProps) {
  const { slug } = await params;
  const slugParts = slug.split("-");
  const workId = slugParts.pop() || "";

  if (!workId) {
    notFound();
  }

  const currentWork = await getWorkData(workId);
  if (!currentWork) {
    notFound();
  }

  return <EditWorkClient initialData={currentWork} />;
}
