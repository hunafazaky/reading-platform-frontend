"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { updateWork } from "@/lib/work.api";
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
  const [cover, setCover] = useState(work.cover ?? "");
  const [categoriesInput, setCategoriesInput] = useState(
    work.categories.join(", "),
  );
  const [attachmentTitle, setAttachmentTitle] = useState(
    work.attachment?.title ?? "",
  );
  const [attachmentLink, setAttachmentLink] = useState(
    work.attachment?.link ?? "",
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
      const categories = categoriesInput
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);

      const hasAttachment =
        attachmentTitle.trim() !== "" || attachmentLink.trim() !== "";

      const { work: updated } = await updateWork(
        work.id,
        {
          title,
          body,
          // Sending "" (not omitting) lets the user intentionally clear
          // the cover — the backend accepts an empty string for it.
          cover: cover.trim(),
          categories,
          ...(hasAttachment
            ? {
                attachment: {
                  title: attachmentTitle.trim() || undefined,
                  link: attachmentLink.trim() || undefined,
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
            <FieldLabel htmlFor="cover">Cover image URL (optional)</FieldLabel>
            <Input
              id="cover"
              type="text"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
            />
            {fieldErrors.cover && (
              <FieldDescription style={{ color: "red" }}>
                {fieldErrors.cover}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="categories">
              Categories (optional, comma-separated)
            </FieldLabel>
            <Input
              id="categories"
              type="text"
              placeholder="fiction, adventure"
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
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
              Attachment link (optional)
            </FieldLabel>
            <Input
              id="attachmentLink"
              type="text"
              value={attachmentLink}
              onChange={(e) => setAttachmentLink(e.target.value)}
            />
          </Field>
        </FieldGroup>
        {errorMessage && (
          <FieldDescription style={{ color: "red" }}>
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
