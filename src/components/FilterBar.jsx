// components/FilterBar.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function FilterBar({ categories = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false); // collapse state

  // Local state for controlled inputs (initialised from current URL)
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [inStock, setInStock] = useState(
    searchParams.get("in_stock") === "true",
  );
  const [isActive, setIsActive] = useState(searchParams.get("is_active") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "created_at",
  );
  const [order, setOrder] = useState(searchParams.get("order") || "DESC");
  const [limit, setLimit] = useState(searchParams.get("limit") || "12");
  const [offset, setOffset] = useState(
    parseInt(searchParams.get("offset") || "0"),
  );

  // Sync local state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategoryId(searchParams.get("category_id") || "");
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
    setInStock(searchParams.get("in_stock") === "true");
    setIsActive(searchParams.get("is_active") || "");
    setSortBy(searchParams.get("sort_by") || "created_at");
    setOrder(searchParams.get("order") || "DESC");
    setLimit(searchParams.get("limit") || "12");
    setOffset(parseInt(searchParams.get("offset") || "0"));
  }, [searchParams]);

  // Helper to update a single query param
  const updateParam = (key, value, resetOffset = true) => {
    const newParams = new URLSearchParams(searchParams);
    if (
      value === "" ||
      value === false ||
      value === undefined ||
      value === null
    ) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (resetOffset && key !== "offset" && key !== "limit") {
      newParams.delete("offset");
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam("search", search);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategoryId(val);
    updateParam("category_id", val);
  };

  const handleStockChange = (e) => {
    const checked = e.target.checked;
    setInStock(checked);
    updateParam("in_stock", checked ? "true" : "");
  };

  const handleActiveChange = (e) => {
    const val = e.target.value;
    setIsActive(val);
    updateParam("is_active", val);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    updateParam("sort_by", val);
  };

  const handleOrderToggle = () => {
    const newOrder = order === "ASC" ? "DESC" : "ASC";
    setOrder(newOrder);
    updateParam("order", newOrder);
  };

  const handleLimitChange = (e) => {
    const val = e.target.value;
    setLimit(val);
    updateParam("limit", val);
  };

  const handlePrevPage = () => {
    const newOffset = Math.max(offset - parseInt(limit), 0);
    setOffset(newOffset);
    updateParam("offset", newOffset.toString(), false);
  };

  const handleNextPage = () => {
    const newOffset = offset + parseInt(limit);
    setOffset(newOffset);
    updateParam("offset", newOffset.toString(), false);
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/50 space-y-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Animated filter panel */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Inner content keeps spacing */}
        <div className="space-y-4 pt-4">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
            />
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option
                    key={cat.id || cat.category_id}
                    value={cat.id || cat.category_id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Price
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateParam("min_price", e.target.value);
                }}
                placeholder="$0"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Price
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateParam("max_price", e.target.value);
                }}
                placeholder="$9999"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              />
            </div>

            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={inStock}
                onChange={handleStockChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:bg-gray-600 dark:checked:bg-indigo-500 dark:focus:ring-indigo-700"
              />
              <label
                htmlFor="inStock"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                In Stock Only
              </label>
            </div>

            {/* Active Status (if admin) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={isActive}
                onChange={handleActiveChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              >
                <option value="">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          {/* Sorting & Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">Order</span>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              >
                <option value="created_at">Newest</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="stock">Stock</option>
              </select>
              <button
                onClick={handleOrderToggle}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {order === 'ASC' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              <select
                value={limit}
                onChange={handleLimitChange}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
              >
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
                <option value="48">48 per page</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="text-right">
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-red-600 hover:underline dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}