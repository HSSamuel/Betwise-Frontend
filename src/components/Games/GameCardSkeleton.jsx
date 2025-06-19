import React from "react";
import Skeleton from "../ui/Skeleton";

const GameCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex items-center justify-around text-center my-4">
        <div className="flex-1 flex flex-col items-center space-y-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="text-2xl font-bold text-gray-400 mx-4">vs</div>
        <div className="flex-1 flex flex-col items-center space-y-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};

export default GameCardSkeleton;
