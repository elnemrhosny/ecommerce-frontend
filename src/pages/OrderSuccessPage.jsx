// pages/OrderSuccess.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export default function OrderSuccessPage() {
  const queryClient = useQueryClient();

  // Invalidate cart so it's fresh next time user visits cart
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }, [queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
      {/* Animated card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
        {/* Animated checkmark circle */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
          <svg
            className="h-12 w-12 text-green-600 dark:text-green-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M4 12.5l5 5L20 6.5"
              className="checkmark-draw"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Your order has been processed. Thank you for shopping with us.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            View Orders
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Inline CSS keyframes */}
      <style jsx>{`
        @keyframes checkmark-draw {
          0% {
            stroke-dasharray: 0 100;
            stroke-dashoffset: 100;
          }
          100% {
            stroke-dasharray: 100 0;
            stroke-dashoffset: 0;
          }
        }

        .checkmark-draw {
          stroke-dasharray: 0 100;
          animation: checkmark-draw 1s ease forwards 0.2s;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
        }
      `}</style>
    </div>
  );
}