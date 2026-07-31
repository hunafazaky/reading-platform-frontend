"use client";

import { Work } from "@/types/work";
import Image from "next/image";
import { WorkDeleteConfirmation } from "./work-delete-confirmation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageBrokenIcon, StarFourIcon } from "@phosphor-icons/react";
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
  const { averageRating, refetch: refetchRatingSummary } = useWorkRatingSummary(
    data.id,
  );

  return (
    <article className="flex flex-col gap-4 lg:w-2/3 m-auto min-h-dvh">
      <section>
        <h1 className="text-4xl text-center font-bold pb-8 my-4 border-b-2 border-foreground">
          {data.title}
        </h1>
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="text-sm font-bold uppercase mr-1">Writer:</span>
            {data.writer.pen_name}
          </div>
          <div className="flex gap-4">
            <div className="flex items-center">
              <span className="text-sm font-bold uppercase mr-1">Readers:</span>
              <span>{data.reader_count}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-bold uppercase mr-1">
                Avg. Ratings:
              </span>
              <span className="flex justify-center items-center">
                {averageRating}
                <StarFourIcon weight="fill" className="text-amber-500" />
              </span>
              {/* <span className="flex justify-center items-center">
                {averageRating !== null && averageRating > 0
                  ? Array.from({ length: averageRating }).map((_, index) => (
                      <StarFourIcon key={index} />
                    ))
                  : Array.from({ length: 5 }).map((_, index) => (
                      <StarFourIcon key={index} />
                    ))}
              </span> */}
            </div>
          </div>
        </div>
        {data.cover ? (
          <div className="w-full bg-secondary flex justify-center items-center aspect-video relative border-8 my-2 border-foreground rounded">
            <Image
              placeholder="empty"
              loading="eager"
              fill
              src={data.cover}
              alt={data.title}
              className=" object-cover"
            />
          </div>
        ) : (
          <div className="w-full bg-secondary flex justify-center items-center aspect-video relative border-8 my-2 border-foreground rounded">
            <ImageBrokenIcon size={50} />
          </div>
        )}
        <div className="flex items-center">
          <span className="text-sm font-bold uppercase mr-1">Categories:</span>
          <span>
            {data.categories.length > 0
              ? data.categories.map((category, index) => (
                  <Button variant="link" className="m-0 p-0" key={index}>
                    #{category}
                  </Button>
                ))
              : "-"}
          </span>
        </div>
      </section>
      <section>
        <p className="text-2xl pb-8 border-b-2 border-foreground">
          {data.body}
        </p>
      </section>
      <section className="flex justify-between mb-80">
        {data.attachment?.link && (
          <div className="flex items-center">
            <span className="text-sm font-bold uppercase mr-1">
              Attachment:
            </span>
            <Link href={data.attachment.link} target="_blank" rel="noreferrer">
              <Button variant="link" className="m-0 p-0 cursor-pointer">
                #{data.attachment.title || data.attachment.link}
              </Button>
            </Link>
          </div>
        )}

        {isOwner ? (
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
        ) : (
          <section>
            <RatingInput workId={data.id} onRated={refetchRatingSummary} />
          </section>
        )}
      </section>
    </article>
  );
}
