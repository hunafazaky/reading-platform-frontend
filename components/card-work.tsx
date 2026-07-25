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
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { PenNibIcon, ArticleIcon } from "@phosphor-icons/react";
import { DialogDeleteWork } from "@/components/dialog-deletework";
import { Work } from "@/types";

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

  const getWorkUrl = (point: string, rawTitle?: string, id?: string) => {
    const safeTitle = typeof rawTitle === "string" ? rawTitle : "";
    const cleanedTitle = safeTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    return `/${cleanedTitle || "work"}-${id || ""}/${point}`;
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
        <CardAction>Save</CardAction>
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
