"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

// Interface untuk data yang akan diedit
interface WorkData {
  id: string;
  title: string;
  body: string;
  categories: string[];
}

interface EditWorkClientProps {
  initialData: WorkData; // Menerima data awal dari Server Component
}

export default function EditWorkClient({ initialData }: EditWorkClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 1. Mengisi nilai default form menggunakan data awal yang sudah ada
  const [workData, setWorkData] = useState({
    title: initialData.title || "",
    body: initialData.body || "",
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData.categories || [],
  );

  // 2. Menggunakan useMutation dari TanStack Query untuk proses update data
  const mutation = useMutation({
    mutationFn: async (updatedWork: {
      title: string;
      body: string;
      categories: string[];
    }) => {
      // Menggunakan PUT atau PATCH tergantung konvensi API backend kamu
      const response = await api.patch(`/works/${initialData.id}`, updatedWork);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Work updated successfully!");

      // 3. FITUR UTAMA TANSTACK: Invalidate Cache!
      // Ini memberi tahu aplikasi bahwa data daftar karya & detail karya ini sudah lama
      // sehingga Next.js / TanStack akan langsung mengambil data terbaru secara otomatis
      queryClient.invalidateQueries({ queryKey: ["works"] });
      queryClient.invalidateQueries({ queryKey: ["work", initialData.id] });

      // Kembali ke halaman utama atau ke halaman detail
      router.push("/");
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("Failed to update work. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setWorkData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();

    // Memicu mutation untuk mengirim data ke server
    mutation.mutate({
      title: workData.title,
      body: workData.body,
      categories: selectedCategories,
    });
  };

  return (
    <div className="min-h-3/4 relative">
      {/* Menggunakan mutation.isPending sebagai pengganti state loading manual */}
      {mutation.isPending && (
        <div className="absolute bg-mist-900/60 w-full h-full flex justify-center items-center z-10">
          <Spinner className="size-8" />
        </div>
      )}
      <Toaster position="top-center" richColors />
      <form
        onSubmit={handleUpdate}
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
              disabled={mutation.isPending}
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
              disabled={mutation.isPending}
            />
          </Field>
          <Field className="flex flex-col gap-1">
            <FieldLabel className="font-semibold text-sm">
              Categories
            </FieldLabel>
            <SelectCategories
              value={selectedCategories}
              onChange={setSelectedCategories}
            />
          </Field>
          <Field orientation="horizontal">
            {/* Tombol otomatis disable & ganti teks saat proses pengiriman */}
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Work"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
