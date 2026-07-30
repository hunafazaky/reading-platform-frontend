"use client";

import { Work } from "@/types/work";
import Image from "next/image";
import { WorkDeleteConfirmation } from "./work-delete-confirmation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageOff } from "lucide-react";
import { useWorkRatingSummary } from "@/hooks/use-work-rating-summary";
import { RatingInput } from "@/components/rating-input";

export function WorkRead({
  data,
  isOwner,
  onDeleted,
}: {
  data: Work;
  isOwner: boolean;
  onDeleted?: () => void;
}) {
  const { averageRating, refetch: refetchRatingSummary } =
    useWorkRatingSummary(data.id);

  return (
    <article className="flex flex-col gap-4 lg:w-2/3  m-auto">
      <section>
        <h1 className="text-4xl font-bold m-auto">{data.title}</h1>
        <span className="m-auto">By {data.writer.pen_name}</span>
        <div className="flex justify-between">
          <div>
            Categories:{" "}
            {data.categories.length > 0 ? data.categories.join(", ") : "None"}
          </div>
          <div>
            {data.reader_count} readers · {data.rating_count} ratings
            {averageRating !== null && ` · ${averageRating.toFixed(1)} avg`}
          </div>
        </div>
        {data.cover ? (
          <Image width={100} height={100} src={data.cover} alt={data.title} />
        ) : (
          <div className="w-full bg-secondary flex justify-center items-center aspect-video">
            <ImageOff size={50} />
          </div>
        )}
      </section>
      <section>
        <p className="text-xl">{data.body}</p>
        {data.attachment?.link && (
          <p>
            Attachment:{" "}
            <a href={data.attachment.link} target="_blank" rel="noreferrer">
              {data.attachment.title || data.attachment.link}
            </a>
          </p>
        )}
      </section>
      <section>
        <RatingInput workId={data.id} onRated={refetchRatingSummary} />
      </section>
      <section className="flex justify-end">
        {isOwner && (
          <div>
            <Link href={`/works/${data.id}/edit`}>
              <Button
                variant={"ghost"}
                className={"text-sm font-bold text-amber-800 cursor-pointer"}
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
      </section>
    </article>
  );
}
