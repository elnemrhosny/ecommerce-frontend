import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../hooks/useCart";
import { useCategories } from "../hooks/useCategories";
import Icon from "./Icon";

export default function Navbar() {
  const {
    user,
    isLoading,
    logout,
    isLogoutPending,
    isLogoutError,
    logoutError,
  } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { data: cart } = useCart();
  const { data: categories = [] } = useCategories();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) ||
    0;
  const close = () => {
    setMenuOpen(false);
    setSearchOpen(false);
  };
  const search = (event) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("search").trim();
    navigate(value ? `/?search=${encodeURIComponent(value)}` : "/");
    close();
  };
  return (
    <header
      className="site-header sticky top-0 z-40"
      onKeyDown={(event) => {
        if (event.key === "Escape") close();
      }}
    >
      <div className="site-width flex h-[82px] items-center justify-between gap-4">
        <Link
          to="/"
          onClick={close}
          className="wordmark"
          aria-label="ShopName home"
        >
          shopname<span className="wordmark-dot">.</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          <NavLink to="/" className="header-link" end>
            Shop all
          </NavLink>
          <Link
            to="/?sort_by=created_at&order=DESC#collection"
            className="header-link"
          >
            Latest finds
          </Link>
          {user && (
            <NavLink to="/orders" className="header-link">
              My orders
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin/products" className="header-link">
              Manage store
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-0.5 sm:gap-2">
          <button
            className="icon-button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search products"
            aria-expanded={searchOpen}
            aria-controls="header-search"
          >
            <Icon name="search" />
          </button>
          <button
            className="icon-button hidden sm:inline-flex"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            <Icon name={darkMode ? "sun" : "moon"} size={19} />
          </button>
          {user && (
            <Link
              className="icon-button hidden sm:inline-flex"
              to="/wishlist"
              aria-label="Wishlist"
            >
              <Icon name="heart" />
            </Link>
          )}
          <Link
            className="icon-button relative"
            to="/cart"
            aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ""}`}
          >
            <Icon name="bag" />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gray-900 px-1 text-[9px] text-white dark:bg-gray-100 dark:text-gray-900">
                {cartCount}
              </span>
            )}
          </Link>
          <span className="mx-2 hidden h-5 border-l line-border sm:block" />
          {!isLoading &&
            (user ? (
              <>
                <Link
                  to="/profile"
                  className="header-link hidden sm:inline-flex items-center gap-2"
                >
                  <Icon name="user" size={17} />
                  Account
                </Link>
                <button
                  className="header-link hidden xl:block"
                  disabled={isLogoutPending}
                  onClick={() => logout()}
                >
                  {isLogoutPending ? "Signing out…" : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="header-link hidden sm:inline-block"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary hidden min-h-10 px-4 py-2 text-xs sm:inline-flex"
                >
                  Sign up <Icon name="arrow" size={15} />
                </Link>
              </>
            ))}
          <button
            className="icon-button lg:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {isLogoutError && (
        <p role="alert" className="site-width pb-3 text-sm text-red-700">
          {typeof logoutError?.response?.data === "string"
            ? logoutError.response.data
            : "Could not sign out. Please try again."}
        </p>
      )}
      {searchOpen && (
        <form
          id="header-search"
          onSubmit={search}
          className="site-width flex gap-3 pb-5"
        >
          <label htmlFor="nav-search" className="sr-only">
            Search the collection
          </label>
          <input
            id="nav-search"
            name="search"
            className="field"
            placeholder="What are you looking for?"
            autoFocus
            type="search"
          />
          <button className="btn-primary" type="submit">
            Search
          </button>
          <button
            className="icon-button"
            aria-label="Close search"
            type="button"
            onClick={() => setSearchOpen(false)}
          >
            <Icon name="close" />
          </button>
        </form>
      )}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="site-width max-h-[70vh] overflow-auto border-t line-border py-5 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Link to="/" onClick={close}>
              Shop all
            </Link>
            {categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/?category_id=${category.category_id}`}
                onClick={close}
              >
                {category.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={close}>
                  My account
                </Link>
                <Link to="/orders" onClick={close}>
                  My orders
                </Link>
                <Link to="/wishlist" onClick={close}>
                  Wishlist
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin/products" onClick={close}>
                    Manage store
                  </Link>
                )}
                <button
                  className="text-left"
                  disabled={isLogoutPending}
                  onClick={() => logout(undefined, { onSuccess: close })}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={close}>
                  Log in
                </Link>
                <Link to="/signup" onClick={close}>
                  Create an account
                </Link>
              </>
            )}
            <button className="text-left muted" onClick={toggleDarkMode}>
              {darkMode ? "Light appearance" : "Dark appearance"}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
