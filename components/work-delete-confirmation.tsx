"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { deleteWork } from "@/lib/work.api";
import { ApiError } from "@/types/api";

interface DeleteWorkConfirmationProps {
  workId: string;
  workTitle: string;
  // When provided (e.g. from a card inside a list), this is called instead
  // of navigating away, so the list can remove the item itself. When
  // omitted (e.g. from the work's own detail page), we navigate to /home
  // instead, since there's no list to update.
  onDeleted?: () => void;
}

import { Button } from "@/components/ui/button";

export function WorkDeleteConfirmation({
  workId,
  workTitle,
  onDeleted,
}: DeleteWorkConfirmationProps) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleConfirm() {
    if (!accessToken) {
      setErrorMessage("You must be signed in to delete this work.");
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await deleteWork(workId, accessToken);
      setOpen(false);

      // Note: router.refresh() only re-runs Server Component data — it does
      // NOT re-trigger the useEffect-based fetching our hooks use, so a
      // deleted item wouldn't actually disappear from a list that way. Each
      // list page passes its own removal logic in via onDeleted instead.
      if (onDeleted) {
        onDeleted();
      } else {
        router.push("/home");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Failed to delete this work. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant={"ghost"}
              className={"text-sm font-bold px-0 text-rose-800 cursor-pointer"}
            >
              Delete
            </Button>
          }
        ></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{workTitle}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the work, along with its bookmarks,
              ratings, and reading history. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </>
  );
}
