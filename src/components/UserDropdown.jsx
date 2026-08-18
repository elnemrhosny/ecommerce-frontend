import { useState , useRef } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../hooks/useClickOutside";

export default function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 sm:px-4 sm:py-2 shrink-0 overflow-hidden max-w-[160px]"
      >
        {/* On very small screens, show only the initial or a generic icon */}
        <span className="hidden sm:inline truncate max-w-[120px]">{user.name}</span>
        <span className="inline sm:hidden">Account</span> {/* or use user.name[0] */}
        <svg
          className="h-4 w-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <div className="p-1">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              🛒 Cart
            </Link>
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              👤 Profile
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              📦 Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Wishlist
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                📦 Admin Panel
              </Link>
            )}
            <hr className="my-1 dark:border-gray-600" />
            <button
              onClick={() => {
                onLogout();
                setOpen(false);
              }}
              className="w-full rounded-lg px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}