// pages/WishlistPage.jsx
import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { useDeleteWishlist, useWishlist } from '../hooks/useUser';
import { useAuth } from '../contexts/AuthContext';
import ErrorModal from '../components/ErrorModal';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const [offset , setOffset] = useState(0);
  const navigate = useNavigate();
  const {user} = useAuth();
  const {data : data , isLoading , isError} = useWishlist(offset , 12);
  const {mutate : deleteWishlist} = useDeleteWishlist();
  const [page, setPage] = useState(1);
  const products = data?.wishlist || [];
  const count = data?.count || 0;
  const totalPages = Math.ceil(count / 12);

  const handlePrev = () => {
    setOffset(offset - 12);
    setPage((p) => Math.max(p - 1, 1));
};
  const handleNext = () =>{ 
    setOffset(offset + 12);
    setPage((p) => p + 1);
};

  const handleDeleteWishlist = (product_id) => deleteWishlist({ product_id});


    if(!user) return <ErrorModal isOpen={true} message="Please login to view your wishlist" onClose={() =>navigate('/') }/>
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        My Wishlist
      </h1>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="text-center py-16 text-red-500 dark:text-red-400">Something went wrong</div>
      ) : products?.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          Your wishlist is empty.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={handlePrev}
              disabled={page === 1 || isLoading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages || isLoading}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}