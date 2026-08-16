// components/ProductCard.jsx
import { useAddCart } from "../hooks/useCart";
import { Link } from "react-router-dom";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import { useAddWishlist, useDeleteWishlist } from "../hooks/useUser";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const {
    mutate: handleCartAdd,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useAddCart();
  const { mutate: addWishlist } = useAddWishlist();
  const { mutate: deleteWishlist } = useDeleteWishlist();
  const [wishlistError, setWishlistError] = useState(false);
  const inStock = product.stock > 0;
  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!user) setWishlistError("You have to be logged in the use the wishlist");
    else if (product.is_wishlisted)
      deleteWishlist({ product_id: product.product_id });
    else addWishlist({ product_id: product.product_id });
  };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:shadow-gray-900/50">
        {/* Image Section */}
        <Link
          to={`product/${product.product_id}`}
          className="relative h-48 w-full overflow-hidden bg-gray-50 dark:bg-gray-700"
        >
          <img
            src={product.image_url || "/placeholder.png"}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
          {product.category_name && (
            <span className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-indigo-500">
              {product.category_name}
            </span>
          )}
        </Link>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug text-gray-800 dark:text-gray-100 line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              ${Number(product.price).toFixed(2)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                inStock
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {inStock ? "In Stock" : "Sold Out"}
            </span>
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleCartAdd({ product_id: product.product_id })}
              disabled={isPending || !inStock}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-500"
            >
              {isPending ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <span
                className={
                  product.is_wishlisted ? "text-red-500 dark:text-red-400" : ""
                }
              >
                {product.is_wishlisted ? "♥" : "♡"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <ErrorModal
        isOpen={isError}
        onClose={reset}
        message="You already have this item in your cart"
      />
      <ErrorModal
        isOpen={wishlistError}
        onClose={() => setWishlistError(false)}
        message={wishlistError}
        onConfirm={() => setWishlistError(false)}
      />
      <SuccessModal isOpen={isSuccess} onClose={reset} message="Item added" />
    </>
  );
}
