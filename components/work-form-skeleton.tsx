import { FieldGroup, FieldSet } from "@/components/ui/field";
import { Skeleton } from "./ui/skeleton";

export function WorkFormSkeleton() {
  return (
    <div>
      <FieldSet>
        <FieldGroup>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
        </FieldGroup>
      </FieldSet>
      <div className="flex justify-end my-4">
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}
