// components/OrderCard.jsx
import { useState } from 'react';

const statusIndex = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
};

const statusLabels = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  console.log(order)

  const paymentStatusColors = {
    pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    paid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    refunded: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  };

  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const activeStatusIndex = statusIndex[order.order_status] ?? 0;
  const truckLeft = `${(activeStatusIndex / (statusLabels.length - 1)) * 100}%`;

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
              {order.payment_status}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </div>
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
            <TruckIcon />
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
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-5">
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.category_name}
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
    </div>
  );
}

function TruckIcon() {
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