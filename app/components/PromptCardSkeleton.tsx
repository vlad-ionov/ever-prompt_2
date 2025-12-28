import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface PromptCardSkeletonProps {
  isDarkMode?: boolean;
  viewMode?: "grid" | "list";
}

export function PromptCardSkeleton({
  isDarkMode = false,
  viewMode = "grid",
}: PromptCardSkeletonProps) {
  if (viewMode === "list") {
    return (
      <Card
        className={`relative overflow-hidden ${
          isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#d4d4d4]"
        } p-4 md:p-5`}
      >
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`relative overflow-hidden ${
        isDarkMode ? "bg-[#0f0f11] border-[#27272a]" : "bg-white border-[#d4d4d4]"
      } flex flex-col`}
    >
      <Skeleton className="w-full aspect-video rounded-none border-b" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <div className="flex items-center justify-between mt-4 border-t pt-4 border-dashed border-border/50">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-5 w-8" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}
