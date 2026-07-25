"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import {
  PenNibIcon,
  ArticleIcon,
  BookmarkSimpleIcon,
} from "@phosphor-icons/react";
import { DialogDeleteWork } from "@/components/dialog-deletework";
import { Work } from "@/types";
import { getWorkUrl, cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function CardWork({ work: rawWork }: { work: any }) {
  const user = useAuthStore((state) => state.user);

  // Jika item berbentuk { id: "hist-id", work: { id: "work-id", title: "...", ... } }
  const work: Work =
    rawWork && typeof rawWork === "object" && "work" in rawWork && rawWork.work
      ? rawWork.work
      : rawWork || {};

  const title = work?.title || "Untitled";
  const body = work?.body || "";
  const categories = work?.categories || [];
  const workId = work?.id || "";

  const initialBookmarked = Boolean(
    work?.bookmarked ?? rawWork?.bookmarked ?? false,
  );
  const [isBookmarked, setIsBookmarked] = useState<boolean>(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    setIsBookmarked(Boolean(work?.bookmarked ?? rawWork?.bookmarked ?? false));
  }, [work?.bookmarked, rawWork?.bookmarked]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!workId || isToggling) return;

    const previousState = isBookmarked;
    const nextState = !previousState;

    setIsBookmarked(nextState);
    setIsToggling(true);

    try {
      const response = await api.post("/bookmarks/toggle", { workId });
      if (response.data && typeof response.data.bookmarked === "boolean") {
        setIsBookmarked(response.data.bookmarked);
      }
    } catch (error) {
      setIsBookmarked(previousState);
      toast.error("Failed to update bookmark status.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <div className="flex gap-2 flex-wrap">
          {categories.length > 0 ? (
            categories.map((category: string, index: number) => (
              <CardDescription key={index}>
                <Button variant="link" className="p-0">
                  #{category}
                </Button>
              </CardDescription>
            ))
          ) : (
            <CardDescription>
              <Button variant="link" className="p-0">
                #uncategorized
              </Button>
            </CardDescription>
          )}
        </div>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full"
            onClick={handleToggleBookmark}
            disabled={isToggling}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            <BookmarkSimpleIcon
              weight={isBookmarked ? "fill" : "regular"}
              className={cn(
                "size-5 transition-colors",
                isBookmarked ? "text-amber-500" : "text-muted-foreground",
              )}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grow">
        <p className="line-clamp-3">{body}</p>
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" variant="ghost" className="text-lime-600">
          <Link href={getWorkUrl("read", title, workId)}>
            <ArticleIcon />
            Read
          </Link>
        </Button>
        {user?.id && work?.writer?.id && user.id === work.writer.id && (
          <ButtonGroup aria-label="Button group" className="ml-auto">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-amber-400"
            >
              <Link href={getWorkUrl("edit", title, workId)}>
                <PenNibIcon />
                Edit
              </Link>
            </Button>
            <ButtonGroupSeparator />
            <DialogDeleteWork id={workId} />
          </ButtonGroup>
        )}
      </CardFooter>
    </Card>
  );
}
