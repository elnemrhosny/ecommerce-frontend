// components/CartItem.jsx
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";


export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDecrease =  () => {
    if (item.quantity <= 1) return;
    setLoading(true);
    onUpdateQuantity({item_id : item.item_id, quantity : item.quantity - 1});
    setLoading(false);
  };

  const handleIncrease =  () => {
    setLoading(true);
    onUpdateQuantity({item_id : item.item_id, quantity : item.quantity + 1});
    setLoading(false);
  };

  const handleRemoveClick = () => setShowConfirm(() => true);

  const handleRemove =  () => {
    setLoading(true);
    onRemove({item_id : item.item_id});
    setLoading(false);
  };

 

  const subtotal = (item.price * item.quantity).toFixed(2);

  return(
 <>
  <div
    className={`flex flex-col sm:flex-row gap-4 rounded-xl bg-white p-4 shadow-sm transition-opacity dark:bg-gray-800 dark:shadow-gray-900/50 ${
      loading ? "opacity-50 pointer-events-none" : ""
    }`}
  >
    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
      <img
        src={item.image_url || "/placeholder.png"}
        alt={item.name}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {item.description}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          ${Number(item.price).toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            disabled={item.quantity <= 1 || loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            −
          </button>
          <span className="w-8 text-center font-medium dark:text-gray-200">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-1 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
        Subtotal: ${subtotal}
      </div>
    </div>
    <button
      onClick={handleRemoveClick}
      disabled={loading}
      className="self-start rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-red-400"
      title="Remove item"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
  <ConfirmModal
    isOpen={showConfirm}
    onClose={() => setShowConfirm(false)}
    onConfirm={handleRemove}
    title="Remove Item"
    message="Are you sure you want to remove this item from your cart?"
    confirmText="Remove"
    cancelText="Cancel"
    variant="danger"
    loading={loading}
  />
</>
  )
}
