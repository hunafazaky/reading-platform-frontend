"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WorkPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Builds the list of page numbers/ellipses to display: always the first
// and last page, the current page and its immediate neighbors, and "…"
// for any gap in between. Without this, a work list with e.g. 50 pages
// would render 50 separate page buttons.
function getPageWindow(
  page: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const wanted = new Set<number>([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...wanted]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous && p - previous > 1) {
      result.push("ellipsis");
    }
    result.push(p);
    previous = p;
  }
  return result;
}

export function WorkPagination({
  page,
  totalPages,
  onPageChange,
}: WorkPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
            onClick={(e) => {
              // Used as a plain button here (page state lives in the URL,
              // updated via router.push in usePageParam), not an actual
              // link, so we stop the browser from following href="#".
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </PaginationItem>

        {getPageWindow(page, totalPages).map((entry, index) =>
          entry === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry}>
              <PaginationLink
                href="#"
                isActive={entry === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(entry);
                }}
              >
                {entry}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page >= totalPages}
            className={
              page >= totalPages ? "pointer-events-none opacity-50" : undefined
            }
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) onPageChange(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
