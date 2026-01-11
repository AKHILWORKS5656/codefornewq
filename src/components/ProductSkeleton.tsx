import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="pt-[100%] skeleton w-full"></div>
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div className="h-3 w-1/3 skeleton rounded"></div>
        <div className="h-4 w-full skeleton rounded"></div>
        <div className="h-4 w-2/3 skeleton rounded"></div>
        <div className="flex items-center space-x-2">
          <div className="h-4 w-10 skeleton rounded"></div>
          <div className="h-3 w-16 skeleton rounded"></div>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <div className="h-6 w-20 skeleton rounded"></div>
          <div className="h-8 w-8 skeleton rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;