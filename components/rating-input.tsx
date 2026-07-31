"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { rateWork } from "@/lib/rating.api";
import { ApiError } from "@/types/api";
import { StarFourIcon } from "@phosphor-icons/react";

interface RatingInputProps {
  workId: string;
  // Called after a rating is successfully submitted, so the page can
  // refresh whatever depends on it (e.g. the average-rating summary).
  onRated?: () => void;
}

// A simple 1-5 star rating input.
//
// Note: there's no backend endpoint to fetch "my existing rating for this
// work" ahead of time, so this always starts blank, even if you've rated
// this work before. Submitting again isn't a problem though — the backend
// upserts by user+work (see app/models/rating.model.js), so it just
// updates your existing rating rather than creating a duplicate.
export function RatingInput({ workId, onRated }: RatingInputProps) {
  const { accessToken, user } = useAuth();

  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <p className="text-muted-foreground text-sm">
        Sign in to rate this work.
      </p>
    );
  }

  async function handleRate(score: number) {
    if (!accessToken || isSubmitting) return;

    setSelected(score);
    setIsSubmitting(true);
    setError(null);
    setSubmitted(false);

    try {
      await rateWork({ workId, score }, accessToken);
      setSubmitted(true);
      onRated?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to submit your rating. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => handleRate(score)}
            disabled={isSubmitting}
            aria-label={`Rate ${score} out of 5`}
            className="cursor-pointer disabled:opacity-50"
          >
            <StarFourIcon
              className={
                selected !== null && score <= selected
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted-foreground"
              }
            />
          </button>
        ))}
      </div>
      {submitted && !error && (
        <p className="text-sm text-muted-foreground">Thanks for rating!</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
