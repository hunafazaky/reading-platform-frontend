"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createWork } from "@/lib/work.api";
import { uploadFile } from "@/lib/upload.api";
import { ApiError } from "@/types/api";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "@/components/file-upload-field";
import { CategorySelect } from "@/components/category-select";

// Creates a new work. No styling — just the fields, submit state, and
// error handling needed to confirm the create flow works end to end.
export function WorkFormWrite() {
  const { accessToken } = useAuth();
  const router = useRouter();

  // Required fields.
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Optional fields. "coverFile"/"attachmentFile" hold the picked-but-
  // not-yet-uploaded File objects — FileUploadField only validates and
  // previews them locally. The actual upload to R2 happens once, inside
  // handleSubmit below, right before publishing.
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    // This form is only reachable while signed in (see
    // app/(dashboard)/works/write/page.tsx), but accessToken could
    // theoretically still be missing (e.g. session expired mid-visit), so
    // we guard here too rather than send a broken request.
    if (!accessToken) {
      setErrorMessage("You must be signed in to publish a work.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload whatever files were picked, right now — this is the only
      // place an actual upload happens, so re-picking a file multiple
      // times before clicking Publish never uploads more than this final
      // choice.
      const coverUrl = coverFile ? (await uploadFile(coverFile, "cover")).url : "";
      const attachmentUrl = attachmentFile
        ? (await uploadFile(attachmentFile, "attachment")).url
        : "";

      const hasAttachment = attachmentTitle.trim() !== "" || attachmentUrl !== "";

      const { work } = await createWork(
        {
          title,
          body,
          ...(coverUrl ? { cover: coverUrl } : {}),
          ...(categories.length > 0 ? { categories } : {}),
          ...(hasAttachment
            ? {
                attachment: {
                  title: attachmentTitle.trim() || undefined,
                  link: attachmentUrl || undefined,
                },
              }
            : {}),
        },
        accessToken,
      );

      // Go straight to the new work's detail page. That page fetches the
      // properly populated version via GET /works/:id — see types/work.ts
      // for why we don't reuse the "work" object this response returned.
      router.push(`/works/${work.id}/read`);
    } catch (err) {
      // uploadFile() throws the same ApiError type as createWork(), so
      // this one catch block handles a failed upload and a failed
      // publish the same way.
      if (err instanceof ApiError) {
        setErrorMessage(err.message);

        // Field-level validation messages (e.g. missing title/body) from
        // the backend, shown next to the matching input below.
        if (err.details) {
          const errors: Record<string, string> = {};
          for (const detail of err.details) {
            errors[detail.field] = detail.message;
          }
          setFieldErrors(errors);
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {fieldErrors.title && (
              <FieldDescription className="text-destructive">
                {fieldErrors.title}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="body">Body</FieldLabel>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              required
            />
            {fieldErrors.body && (
              <FieldDescription className="text-destructive">
                {fieldErrors.body}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="cover">Cover image (optional)</FieldLabel>
            <FileUploadField
              id="cover"
              kind="cover"
              file={coverFile}
              onFileChange={setCoverFile}
            />
            {fieldErrors.cover && (
              <FieldDescription className="text-destructive">
                {fieldErrors.cover}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="categories">
              Categories (optional)
            </FieldLabel>
            <CategorySelect
              id="categories"
              value={categories}
              onChange={setCategories}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="attachmentTitle">
              Attachment title (optional)
            </FieldLabel>
            <Input
              id="attachmentTitle"
              type="text"
              value={attachmentTitle}
              onChange={(e) => setAttachmentTitle(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="attachmentLink">
              Attachment PDF (optional)
            </FieldLabel>
            <FileUploadField
              id="attachmentLink"
              kind="attachment"
              file={attachmentFile}
              onFileChange={setAttachmentFile}
            />
          </Field>
        </FieldGroup>
        {errorMessage && (
          <FieldDescription className="text-destructive">
            {errorMessage}
          </FieldDescription>
        )}
      </FieldSet>
      <Field orientation="horizontal" className="flex justify-end">
        <Button
          type="submit"
          className="my-4 bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </Field>
    </form>
  );
}
