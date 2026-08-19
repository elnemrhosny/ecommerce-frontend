import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const linkClasses = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400'
        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
    }`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar – full width on mobile, fixed width on md+ */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 space-y-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Admin Panel
        </h2>
        <nav className="flex md:flex-col md:space-y-1 space-x-2 md:space-x-0 overflow-x-auto">
          <NavLink to="/admin/products" className={linkClasses}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClasses}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={linkClasses}>
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
}