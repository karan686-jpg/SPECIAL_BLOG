import React from "react";
import { cn } from "../lib/utils";

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800/80",
        className
      )}
      {...props}
    />
  );
};

export const ArticleCardSkeleton = () => {
  return (
    <div className="py-6 border-b border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row gap-6 items-start justify-between">
      <div className="flex-1 space-y-3 w-full">
        {/* Author row skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-16 h-3.5" />
        </div>
        {/* Title skeleton */}
        <Skeleton className="w-3/4 h-6 rounded" />
        {/* Subtitle skeleton */}
        <Skeleton className="w-full h-4 rounded" />
        <Skeleton className="w-2/3 h-4 rounded" />
        {/* Meta row skeleton */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="w-16 h-5 rounded-full" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      {/* Thumbnail skeleton */}
      <Skeleton className="w-full sm:w-44 h-32 rounded-xl shrink-0" />
    </div>
  );
};

export const FeaturedStorySkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-gray-100 dark:border-gray-800/80">
      <div className="lg:col-span-7 space-y-4">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-full h-10 rounded-lg" />
        <Skeleton className="w-4/5 h-10 rounded-lg" />
        <Skeleton className="w-full h-5 rounded" />
        <Skeleton className="w-2/3 h-5 rounded" />
        <div className="flex items-center gap-3 pt-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-36 h-3" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-5">
        <Skeleton className="w-full h-72 rounded-2xl" />
      </div>
    </div>
  );
};

export default Skeleton;
