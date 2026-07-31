import { Spinner } from "@/components/ui/spinner";

export function SiteLoader() {
  return (
    <div className="flex justify-center items-center w-full inset-0 fixed bg-secondary/20 z-20 gap-2">
      <Spinner />
      <span>Please wait, still connecting to the database...</span>
    </div>
  );
}
