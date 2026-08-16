// pages/VerifyEmailPage.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useVerifyEmailToken } from '../hooks/useUser';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const {mutate : verifyToken , isPending : isLoading , isSuccess , isError} = useVerifyEmailToken();
  const [message, setMessage] = useState('');

 useEffect(()=>{
    verifyToken({token});
 } , [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-16">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        {isLoading ? (
          <Spinner />
        ) : isSuccess? (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-600 dark:text-green-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your email has been verified. You can now submit orders and access all features.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Continue Shopping
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600 dark:text-red-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your token is invalid you can resend token from your user profile
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Go to Profile to Resend
            </Link>
          </>
        )}
      </div>
    </div>
  );
}