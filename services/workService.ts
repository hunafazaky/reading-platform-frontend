import { api } from "@/lib/api";
import { CreateWorkPayload, Work } from "@/types";

export const getWorks = async (): Promise<Work[]> => {
  const response = await api.get("/works");
  return response.data;
};

export const postWork = async (payload: CreateWorkPayload) => {
  const response = await api.post("/works", payload);
  return response.data;
};
