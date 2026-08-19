// components/OrderCard.jsx
import { useState } from 'react';

const statusIndex = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
};

const statusLabels = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
const orderStatusOptions = ["pending", "confirmed", "shipped", "delivered" , "cancelled"];
const paymentStatusOptions = ["paid", "pending", "failed", "refunded"];
export default function OrderCard({ order , adminMode = false , onPaymentStatusChange , onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm , setEditForm] = useState({
    order_status : order.order_status,
    payment_status : order.payment_status
  });

  const paymentStatusColors = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    refunded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  };
 
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const activeStatusIndex = statusIndex[order.order_status] ?? 0;
  const truckLeft = `${(activeStatusIndex / (statusLabels.length - 1)) * 100}%`;

  const handleSaveEdit = () => {
  if (adminMode) {
    if(order.order_status !== editForm.order_status) onStatusChange(order.order_id, editForm.order_status);
    if(order.payment_status !== editForm.payment_status) onPaymentStatusChange(order.order_id, editForm.payment_status);
  }
  setEditOpen(false);
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Summary Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
      >
        <div className="flex flex-row gap-4">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Order #{order.order_id?.slice(0, 8)}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentStatusColors[order.payment_status] || ''}`}>
              payment is {order.payment_status}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </div>
          {order.order_status === 'cancelled' && (
            <span className="px-2 py-0.5 rounded-full text-xs text-center font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              <p>Order is Cancelled</p>
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ${Number(order.total_amount).toFixed(2)}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Progress Bar */}
      <div className="px-5 pb-5">
        <div className="relative h-16"> {/* Increased height for truck */}
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />

          {/* Dots */}
          {statusLabels.map((label, idx) => {
            const left = `${(idx / (statusLabels.length - 1)) * 100}%`;
            return (
              <div
                key={label}
                className="absolute top-1/2 -translate-y-1/2 z-10"
                style={{ left }}
              >
                <div
                  className={`h-4 w-4 rounded-full ${
                    idx <= activeStatusIndex
                      ? 'bg-indigo-600 dark:bg-indigo-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              </div>
            );
          })}

          {/* Animated Truck – now positioned above the line */}
          <div
            className="absolute z-20"
            style={{
              left: truckLeft,
              top: 'calc(50% - 32px)', // move truck above center
              transform: 'translate(-30%, -50%)', // lift it entirely above
            }}
          >
          <TruckIcon order_status={order.order_status}/>
          </div>
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2">
          {statusLabels.map((label) => (
            <span key={label} className="text-xs text-gray-500 dark:text-gray-400">
              {label}
            </span>
          ))}
        </div>

        {/* Date under first point */}
       <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
  <div className="inline-flex items-center gap-2 rounded-full bg-gray-50 dark:bg-gray-700/50 px-4 py-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500 dark:text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
      Placed on {new Date(order.created_at).toLocaleDateString()}
    </span>
  </div>
</div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-5">
          {/* Modern Customer Details Card (Admin Only) */}
{adminMode && order.user && (
  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
    <div className="rounded-xl mb-5 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <svg className="h-4 w-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          Customer Details
        </h4>
        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-full">
          User ID: {order.user.user_id?.slice(0,8) || order.user_id?.slice(0,8) || 'N/A'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 h-9 w-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.user.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 h-9 w-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.user.email}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <span className="shrink-0 h-9 w-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.user.phone || 'N/A'}</p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <span className="shrink-0 h-9 w-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center mt-0.5">
            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shipping Address</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
              {order.user.address || 'Address not provided'}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div key={item.product_id} className="flex items-center gap-4 py-2">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  <img
                    src={item.product_image_url || '/placeholder.png'}
                    alt={item.product_name}
                    className="h-full w-full object-cover text-xs text-center text-opacity-5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {item.product_name}
                  </p>
                  
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  ${Number(item.product_price).toFixed(2)} × {item.quantity}
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  ${Number(item.total_price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {adminMode && (
  <button
    onClick={(e) => {
      e.stopPropagation();
      setEditOpen(true);
    }}
    className="rounded-lg m-5 border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
  >
    Edit Order
  </button>
)}
{editOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Edit Order
      </h3>

      <div className="space-y-4">
        {/* Order Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Order Status
          </label>
          <select
            value={editForm.order_status}
            onChange={(e) =>
              setEditForm({ ...editForm, order_status: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {orderStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Status
          </label>
          <select
            value={editForm.payment_status}
            onChange={(e) =>
              setEditForm({ ...editForm, payment_status: e.target.value })
            }
            className="w-full rounded-lg border border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {paymentStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setEditOpen(false)}
          className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveEdit}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

function TruckIcon({order_status}) {
  if(order_status === 'cancelled') return('')
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-bounce"
    >
      <path d="M20 8h-3V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a2 2 0 0 0 4 0h6a2 2 0 0 0 4 0h1a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-2v-2a1 1 0 0 0-1-1zm-7 8H9v-2h4v2zm4-4h-4V9h4v3z" />
    </svg>
  );
}