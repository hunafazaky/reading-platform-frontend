"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Work } from "@/types/work";
import Link from "next/link";
import { Button } from "./ui/button";
import { BookmarkIcon, BookmarkSimpleIcon } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useBookmarkToggle } from "@/hooks/use-bookmark-toggle";

import { WorkDeleteConfirmation } from "@/components/work-delete-confirmation";

export function WorkCard({
  data,
  isOwner,
  onDeleted,
  // Only relevant on the Bookmarked page: called after a work is
  // successfully un-bookmarked, so that page can remove the card from its
  // own list. Elsewhere, un-bookmarking should just flip the icon in
  // place, so this is left undefined.
  onUnbookmarked,
}: {
  data: Work;
  isOwner: boolean;
  onDeleted?: () => void;
  onUnbookmarked?: () => void;
}) {
  const { user } = useAuth();

  const { bookmarked, isToggling, toggle } = useBookmarkToggle(
    data.id,
    !!data.bookmarked,
    (nowBookmarked) => {
      if (!nowBookmarked) onUnbookmarked?.();
    },
  );

  return (
    <Card className="bg-accent pb-0">
      <CardHeader>
        <CardTitle className="text-base font-bold truncate">
          <Link href={`/works/${data.id}/read`} className="truncate">
            {data.title}
          </Link>
        </CardTitle>
        <CardDescription>{data.writer.pen_name}</CardDescription>
        {/* Bookmarking requires being signed in — hide the control
            entirely for signed-out visitors rather than offer an action
            that's guaranteed to fail. */}
        {user && (
          <CardAction>
            <button
              type="button"
              onClick={toggle}
              disabled={isToggling}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              aria-pressed={bookmarked}
              className="cursor-pointer disabled:opacity-50"
            >
              {bookmarked ? (
                <BookmarkSimpleIcon className="text-sky-800" size={24} weight="fill"/>
              ) : (
                <BookmarkIcon size={24}/>
              )}
            </button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="grow overflow-hidden text-ellipsis text-wrap line-clamp-3">
        {data.body}
      </CardContent>
      <CardFooter className="py-4 flex justify-between">
        <Link href={`/works/${data.id}/read`}>
          <Button
            variant={"ghost"}
            className={"text-sm font-bold px-0 text-green-800 cursor-pointer"}
          >
            Read
          </Button>
        </Link>
        {isOwner && (
          <div className="flex gap-4">
            <Link href={`/works/${data.id}/edit`}>
              <Button
                variant={"ghost"}
                className={"text-sm font-bold px-0 text-amber-800 cursor-pointer"}
              >
                Edit
              </Button>
            </Link>
            <WorkDeleteConfirmation
              workId={data.id}
              workTitle={data.title}
              onDeleted={onDeleted}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
