import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export function WorkCardSkeleton() {
  return (
    <Card className="bg-accent text-primary pb-0">
      <CardHeader>
        <CardHeader className="px-0">
          <Skeleton className="bg-stone-200 h-4 w-full" />
          <Skeleton className="bg-stone-200 h-4 w-2/3" />
        </CardHeader>
      </CardHeader>
      <CardContent className="grow">
        <Skeleton className="bg-stone-200 h-4 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-4 w-full mb-1" />
        <Skeleton className="bg-stone-200 h-4 w-full mb-1" />
      </CardContent>
      <CardFooter className="py-4">
        <Skeleton className="bg-stone-200 h-4 w-1/4" />
      </CardFooter>
    </Card>
  );
}
