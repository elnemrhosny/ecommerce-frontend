import API from "../assets/axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import ErrorModal from "../components/ErrorModal";
import FilterBar from "../components/FilterBar";
import { useProducts } from "../hooks/useProducts";
import Spinner from "../components/Spinner";

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {data : {products = [] , count} = {} , isLoading : isProductsLoading , isError : isProductsError , error : productsError , reset : productsReset} = useProducts(searchParams); 
  const {data : categories = [] , isLoading : isCategoriesLoading , isError : isCategoriesError , error : categoriesError} = useCategories();
  // Extract all possible filters from the URL

  // Read current offset and limit from URL (with defaults)
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Calculate current page number (1-indexed)
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  
  const closeError = () => {
    setError(() => false);
  };

  // Pagination helper: update offset in URL
  const goToPage = (page) => {
    const newOffset = (page - 1) * limit;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("offset", newOffset.toString());
    setSearchParams(newParams);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(Math.max(currentPage - 1, 1));

  return (
  <>
    <div className="mx-auto max-w-7xl px-4 py-8">
      <FilterBar categories={categories} />
      {isProductsLoading ? (
        <Spinner />
      ) : isProductsError ? (
        <div className="text-center py-16 text-red-500 dark:text-red-400">{productsError}</div>
      ) : products?.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No products found. Try adjusting your filters.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      )}
      {/* Pagination at the bottom – only show if there are products */}
      {!isProductsLoading && products.length > 0 && totalPages > 0 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
    <ErrorModal isOpen={isProductsError} message="Failed fetching products please try again" onClose={productsReset} />
  </>
);
}
