"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Masukkan TanStack Query
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import SelectCategories from "@/components/select-categories";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { api } from "@/lib/api";
import { AxiosError } from "axios";

interface WorkDataProps {
  title: string;
  body: string;
}

// PERBAIKAN 1: Mengubah nama fungsi dari 'Authentication' menjadi 'WritePage'
export default function WritePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [workData, setWorkData] = useState<WorkDataProps>({
    title: "",
    body: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // PERBAIKAN 2: Menggunakan useMutation untuk menggantikan try/catch & loading manual
  const mutation = useMutation({
    mutationFn: async (newWork: { title: string; body: string; categories: string[] }) => {
      const response = await api.post("/works", newWork);
      return response.data;
    },
    onSuccess: () => {
      toast.success("New Work Created successfully!");

      // PERBAIKAN 3: Invalidate cache 'works' agar karya baru langsung muncul di Home tanpa refresh
      queryClient.invalidateQueries({ queryKey: ["works"] });

      // Tendang user kembali ke halaman utama
      router.push("/");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Failed to create work. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWorkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Memicu mutasi data ke server
    mutation.mutate({
      title: workData.title,
      body: workData.body,
      categories: selectedCategories,
    });
  };

  return (
    <div className="min-h-3/4 relative">
      {/* Menggunakan mutation.isPending bawaan TanStack */}
      {mutation.isPending && (
        <div className="absolute bg-mist-900/60 w-full h-full flex justify-center items-center z-10">
          <Spinner className="size-8" />
        </div>
      )}
      <Toaster position="top-center" richColors />
      <form
        onSubmit={handlePost}
        className="flex flex-col justify-center items-center min-h-4/5"
      >
        <FieldGroup className="lg:w-3/4 xl:w-2/3 mx-8">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              type="text"
              name="title"
              value={workData.title}
              onChange={handleChange}
              placeholder="Make sure the title is unique."
              required
              disabled={mutation.isPending} // Proteksi input saat loading
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="body">Body</FieldLabel>
            <Textarea
              id="body"
              name="body"
              value={workData.body}
              onChange={handleChange}
              placeholder="Type your writings here."
              className="h-50"
              disabled={mutation.isPending} // Proteksi textarea saat loading
            />
          </Field>
          <Field className="flex flex-col gap-1">
            <FieldLabel className="font-semibold text-sm">
              Categories
            </FieldLabel>
            <SelectCategories
              value={selectedCategories}
              onChange={setSelectedCategories}
              // Jika SelectCategories mendukung prop disabled, tambahkan: disabled={mutation.isPending}
            />
          </Field>
          
          <Field orientation="horizontal">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Posting..." : "Post Work"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}