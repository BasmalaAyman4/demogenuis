
// app/[locale]/(shop)/product/[slug]/not-found.tsx
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <Link
          href="/"
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium hover:border-gray-400 transition-colors"
          >
            Go home
          </Link>
        </div>

       
      </div>
  
  );
}