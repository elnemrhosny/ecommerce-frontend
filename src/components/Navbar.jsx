// components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCategories } from "../hooks/useCategories";
import UserDropdown from "./UserDropdown";
import ErrorModal from "./ErrorModal";
import Spinner from "./Spinner";
import { useCart } from "../hooks/useCart";
import { useWishlistCount } from "../hooks/useUser";
import GoogleLoginButton from "./GoogleLoginButton";

export default function Navbar({}) {
  const { darkMode, toggleDarkMode } = useTheme();
  const {
    user,
    isLoading: isUserLoading,
    login,
    logout,
    isLoginPending,
    isLoginError,
    resetLogin,
    isLogoutPending,
    loginWithGoogle
  } = useAuth();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const {data : wishlistCount = 0 , isLoading : isWishlistLoading} = useWishlistCount();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    error: categoriesError,
  } = useCategories();
  const [googleError ,setGoogleError] = useState(false);
  const navigate = useNavigate();
  const cartCount = cart?.items?.length;

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    const success = login({
      email: loginData.email,
      password: loginData.password,
    });
    if (success) {
      setShowLogin(false);
      setLoginData({ email: "", password: "" });
    }
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(() => false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    const success = logout();
    if (success) {
      setShowLogin(false);
      setLoginData({ email: "", password: "" });
    }
  };

  if (isUserLoading || isLoginPending || isLogoutPending) return <Spinner />;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm dark:bg-gray-800 dark:border-b dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                to="/"
                className="text-2xl sm:text-sm font-bold text-indigo-600 dark:text-indigo-400"
              >
                ShopName
              </Link>
            </div>

            {/* Desktop Navigation (hidden on mobile) */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:space-x-6">
              {/* Search Bar */}
              <form
                onSubmit={handleSearch}
                className="relative w-full max-w-md"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:bg-gray-700 dark:focus:ring-indigo-700"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500"
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
              </form>

              {/* Categories Desktop Dropdown */}
              <div className="relative group">
                <button className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  Categories
                  <svg
                    className="ml-1 h-4 w-4"
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
                <div className="absolute left-0 mt-1 w-56 origin-top-left rounded-xl border border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-hover:visible invisible dark:border-gray-600 dark:bg-gray-800">
                  <div className="py-2">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat.id || cat.category_id}
                          to={`/?category_id=${cat.id || cat.category_id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-indigo-400"
                        >
                          {cat.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                        No categories
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: cart, dark mode toggle, login/user, hamburger */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              {/* Cart button – always visible */}
              {isCartLoading ? <Spinner/> : <Link
                to="/cart"
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Cart"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-800">
                    {cartCount}
                  </span>
                )}
              </Link>}
              {isWishlistLoading ? <Spinner/> : user ?  <Link
  to="/wishlist"
  className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
  title="Wishlist"
>
  {/* Heart icon – outline, matches cart stroke style */}
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

  {/* Badge with count */}
  {wishlistCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-800">
      {wishlistCount}
    </span>
  )}
</Link> : ''}

              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Toggle theme"
              >
                {darkMode ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              {/* Login / User Dropdown – always visible */}
              {isUserLoading ? (
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  Loading...
                </span>
              ) : user ? (
                <UserDropdown user={user} onLogout={logout} />
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowLogin(!showLogin)}
                    className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:px-5 sm:py-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Login
                  </button>
                  {showLogin && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-100 bg-white p-5 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                        Sign In
                      </h3>
                      <form onSubmit={handleLogin} className="space-y-3">
                        <input
                          type="email"
                          placeholder="Email"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                          Log In
                        </button>
                      </form>
                      <div className="flex justify-center mt-4">
                      <GoogleLoginButton onSuccess={async (credential) =>{
                        await loginWithGoogle({credential})
                      }} onError={(err) => setGoogleError('Login with google failed')}/>
                      </div>
                      <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link
                          to="/register"
                          className="text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          Register
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger menu (mobile) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu (hamburger) */}
          {isMenuOpen && (
            <div className="border-t border-gray-100 py-4 space-y-4 md:hidden dark:border-gray-600">
              {/* Search on mobile */}
              <form onSubmit={handleSearch} className="px-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
                />
              </form>

              {/* Categories on mobile */}
              <div className="px-2">
                <p className="text-sm font-medium text-gray-500 mb-1 dark:text-gray-300">
                  Categories
                </p>
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <Link
                      key={cat.id || cat.category_id}
                      to={`/?category_id=${cat.category_id}`}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {cat.name}
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    No categories
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <ErrorModal
        isOpen={isLoginError}
        onClose={() => resetLogin()}
        message="Login failed"
      />
       <ErrorModal
        isOpen={googleError}
        onClose={() => setGoogleError(false)}
        message={googleError}
      />
    </>
  );
}
