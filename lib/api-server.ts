import axios from "axios";
import { cookies } from "next/headers";

export async function getServerApi() {
  const baseUrl = process.env.BACKEND_API_URL || "http://localhost:8080";
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const instance = axios.create({
    baseURL: `${baseUrl}/api`,
    headers: {
      Cookie: cookieHeader,
    },
    withCredentials: true,
  });

  return instance;
}
