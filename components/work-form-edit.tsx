"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateWork } from "@/lib/work.api";
import { uploadFile } from "@/lib/upload.api";
import { ApiError } from "@/types/api";
import { Work } from "@/types/work";
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

interface WorkEditFormProps {
  work: Work;
}

// Edits an existing work. Same fields/shape as WorkFormWrite, just
// prefilled with the current values and calling PATCH instead of POST.
export function WorkFormEdit({ work }: WorkEditFormProps) {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState(work.title);
  const [body, setBody] = useState(work.body);

  // "coverFile"/"attachmentFile" hold a newly picked replacement, if any
  // — nothing is uploaded until submit. If the user doesn't pick a
  // replacement, we fall back to the work's existing URLs (below) so
  // editing other fields doesn't accidentally clear the cover/attachment.
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [existingCover] = useState(work.cover ?? "");
  const [existingAttachmentLink] = useState(work.attachment?.link ?? "");

  const [categories, setCategories] = useState<string[]>(work.categories);
  const [attachmentTitle, setAttachmentTitle] = useState(
    work.attachment?.title ?? "",
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    if (!accessToken) {
      setErrorMessage("You must be signed in to edit this work.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Only upload if the user actually picked a replacement file — the
      // only place an actual upload happens, so re-picking a file
      // multiple times before saving never uploads more than this final
      // choice. Otherwise, keep whatever was already there.
      const coverUrl = coverFile
        ? (await uploadFile(coverFile, "cover")).url
        : existingCover;
      const attachmentUrl = attachmentFile
        ? (await uploadFile(attachmentFile, "attachment")).url
        : existingAttachmentLink;

      const hasAttachment =
        attachmentTitle.trim() !== "" || attachmentUrl !== "";

      const { work: updated } = await updateWork(
        work.id,
        {
          title,
          body,
          // Sending "" (not omitting) lets the user intentionally clear
          // the cover — the backend accepts an empty string for it.
          cover: coverUrl,
          categories,
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

      // Same reasoning as WorkFormWrite: redirect to the detail page
      // rather than trying to reuse the response's "work" object, since
      // its "writer" field is just an id string here, not populated.
      router.push(`/works/${updated.id}/read`);
    } catch (err) {
      // uploadFile() throws the same ApiError type as updateWork(), so
      // this one catch block handles a failed upload and a failed save
      // the same way.
      if (err instanceof ApiError) {
        setErrorMessage(err.message);

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
              existingUrl={existingCover}
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
              existingUrl={existingAttachmentLink}
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
          className="my-4 bg-amber-800"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving changes..." : "Update"}
        </Button>
      </Field>
    </form>
  );
}
