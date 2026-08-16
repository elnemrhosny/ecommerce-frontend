// components/EmailVerificationCard.jsx
import { useState } from 'react';

export default function EmailVerificationCard({
  isEmailVerified,
  onSendVerification,
  isSending,
  error,
  success,
  onDismissError,
  onDismissSuccess,
}) {
  if (isEmailVerified) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl p-4 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-green-600 dark:text-green-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            Email Verified
          </p>
          <p className="text-xs text-green-600 dark:text-green-400">
            Your email address has been verified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.27 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Email Not Verified
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please verify your email address to access all features.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
          <span>{error}</span>
          <button
            onClick={onDismissError}
            className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm">
          <span>{success}</span>
          <button
            onClick={onDismissSuccess}
            className="text-green-500 hover:text-green-700 dark:hover:text-green-400"
          >
            ✕
          </button>
        </div>
      )}

      <button
        onClick={onSendVerification}
        disabled={isSending}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        {isSending ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          'Send Verification Email'
        )}
      </button>
    </div>
  );
}