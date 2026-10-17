
// app/[locale]/(shop)/product/[slug]/loading.tsx
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 bg-gray-200 rounded-2xl h-[600px] animate-pulse" />
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="flex items-center justify-between">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>

            {/* Rating */}
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />

            {/* Price */}
            <div className="h-12 bg-gray-200 rounded w-48 animate-pulse" />

            {/* Color selector */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="flex-1 h-14 bg-gray-200 rounded-xl animate-pulse" />
              <div className="w-14 h-14 bg-gray-200 rounded-xl animate-pulse" />
            </div>

            {/* Delivery info */}
            <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}