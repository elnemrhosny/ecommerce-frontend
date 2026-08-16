// components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top section with newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8 border-b border-gray-100 dark:border-gray-700">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">ShopName</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Discover the best products curated for you. From electronics to fashion, we bring quality and value straight to your door.
            </p>
            <div className="flex gap-4">
              {/* Social icons */}
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Newsletter signup */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Subscribe to get special offers and new arrivals.</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">New Arrivals</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Best Sellers</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Sale</Link></li>
              <li><Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Shipping Info</Link></li>
              <li><Link to="/returns" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">FAQ</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Careers</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">My Account</Link></li>
              <li><Link to="/orders" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Order History</Link></li>
              <li><Link to="/wishlist" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Wishlist</Link></li>
              <li><Link to="/cart" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Cart</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-100 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} ShopName. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Privacy</Link>
            <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}