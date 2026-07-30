"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createWork } from "@/lib/work.api";
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
// Creates a new work. No styling — just the fields, submit state, and
// error handling needed to confirm the create flow works end to end.
export function WorkFormWrite() {
  const { accessToken } = useAuth();
  const router = useRouter();

  // Required fields.
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Optional fields. "categories" is typed as a single comma-separated
  // string here since that's simpler for a plain <Input>, and split into
  // an array right before submitting.
  const [cover, setCover] = useState("");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [attachmentTitle, setAttachmentTitle] = useState("");
  const [attachmentLink, setAttachmentLink] = useState("");

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
      const categories = categoriesInput
        .split(",")
        .map((category) => category.trim())
        .filter(Boolean);

      const hasAttachment =
        attachmentTitle.trim() !== "" || attachmentLink.trim() !== "";

      const { work } = await createWork(
        {
          title,
          body,
          ...(cover.trim() ? { cover: cover.trim() } : {}),
          ...(categories.length > 0 ? { categories } : {}),
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

      // Go straight to the new work's detail page. That page fetches the
      // properly populated version via GET /works/:id — see types/work.ts
      // for why we don't reuse the "work" object this response returned.
      router.push(`/works/${work.id}/read`);
    } catch (err) {
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
          className="my-4 bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </Field>
    </form>
  );
}
