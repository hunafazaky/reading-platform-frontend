import { Spinner } from "@/components/ui/spinner";

export function SiteLoader() {
  return (
    <div className="flex justify-center items-center w-full inset-0 fixed bg-secondary/20 z-20">
      <Spinner />
    </div>
  );
}
