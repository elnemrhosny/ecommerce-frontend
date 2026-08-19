// pages/admin/AdminOrders.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OrderCard from "../../components/OrderCard"; // assuming path
import Spinner from "../../components/Spinner";
import ErrorModal from "../../components/ErrorModal";
import SuccessModal from "../../components/SuccessModal";
import { useAdminOrders , useUpdateOrderStatus , useUpdatePaymentStatus } from "../../hooks/useOrders"; // assuming path


export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: { orders = [], count = 0 } = {}, isLoading, isError, error } = useAdminOrders(searchParams);
  const {mutate: updateOrderStatus , isError : isOrderStatusError , error : orderStatusError , isSuccess : isOrderStatusSuccess , reset: resetOrderStatus} = useUpdateOrderStatus();
  const {mutate: updatePaymentStatus , isError : isPaymentStatusError , error : paymentStatusError , isSuccess : isPaymentStatusSuccess , reset: resetPaymentStatus} = useUpdatePaymentStatus();
  // Extract current values from URL (with defaults)
  const sort_by = searchParams.get("sort_by") || "created_at";
  const sort_order = searchParams.get("sort_order") || "DESC";
  const order_status = searchParams.get("order_status") || "";
  const payment_status = searchParams.get("payment_status") || "";
  const limit = parseInt(searchParams.get("limit") || "12", 12);
  const offset = parseInt(searchParams.get("offset") || "0", 12);

  // Pagination helpers
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);
  const updateParam = (key, value, resetOffset = true) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === "" || value === undefined || value === null) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    if (resetOffset && key !== "offset" && key !== "limit") {
      newParams.delete("offset");
    }
    setSearchParams(newParams);
  };

  const handleSortByChange = (e) => {
    updateParam("sort_by", e.target.value);
  };

  const handleSortOrderChange = (e) => {
    updateParam("sort_order", e.target.value);
  };

  const handleOrderStatusChange = (e) => {
    updateParam("order_status", e.target.value);
  };

  const handlePaymentStatusChange = (e) => {
    updateParam("payment_status", e.target.value);
  };


  const handleUserEmailChange = (e) => {
  updateParam("user_email", e.target.value);
};

  const goToPage = (page) => {
    const newOffset = (page - 1) * limit;
    const newParams = new URLSearchParams(searchParams);
    newParams.set("offset", newOffset.toString());
    setSearchParams(newParams);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(Math.max(currentPage - 1, 1));

  const hanldePaymentStatus = (order_id , status) =>  updatePaymentStatus({order_id , status});
  const handleStatusChange = (order_id , status) => updateOrderStatus({order_id , status});
   
  

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
          {/* User Email Search */}
<div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <svg
      className="h-5 w-5 text-gray-400 dark:text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
  <input
    type="text"
    value={searchParams.get("user_email") || ""}
    onChange={handleUserEmailChange}
    placeholder="Search by user email..."
    className="w-full sm:w-80 rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 pl-10 pr-4 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 transition"
  />
</div>
          
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sort By
            </label>
            <select
              value={sort_by}
              onChange={handleSortByChange}
              className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            >
              <option value="created_at">Date Created</option>
              <option value="total_amount">Total Amount</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order
            </label>
            <select
              value={sort_order}
              onChange={handleSortOrderChange}
              className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>

          {/* Order Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Order Status
            </label>
            <select
              value={order_status}
              onChange={handleOrderStatusChange}
              className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Payment Status
            </label>
            <select
              value={payment_status}
              onChange={handlePaymentStatusChange}
              className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Limit */}
          
        </div>

        {/* Clear filters */}
        <div className="mt-3 text-right">
          <button
            onClick={() => setSearchParams({})}
            className="text-sm text-red-600 hover:underline dark:text-red-400"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 dark:text-red-400">
          {error?.response?.data || "Failed to load orders"}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.order_id} order={order} adminMode={true} onPaymentStatusChange={hanldePaymentStatus} onStatusChange = {handleStatusChange} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && orders.length > 0 && totalPages > 0 && (
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
      <ErrorModal isOpen = {isOrderStatusError} message = {orderStatusError?.response?.data || "Failed to update order status"} onClose = {resetOrderStatus} />
      <SuccessModal isOpen = {isOrderStatusSuccess} message = "Order status updated successfully" onClose = {resetOrderStatus} />
       <ErrorModal isOpen = {isPaymentStatusError} message = {paymentStatusError?.response?.data || "Failed to update payment status"} onClose = {resetPaymentStatus} />
      <SuccessModal isOpen = {isPaymentStatusSuccess} message = "Payment status updated successfully" onClose = {resetPaymentStatus} />
    </>
  );
}