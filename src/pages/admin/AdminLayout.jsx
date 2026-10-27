import { NavLink, Outlet } from "react-router-dom";
export default function AdminLayout() {
  return (
    <div className="site-width grid gap-8 py-10 lg:grid-cols-[190px_1fr] lg:gap-12">
      <aside>
        <p className="eyebrow mb-4">Behind the collection</p>
        <h1 className="font-display text-3xl">Store studio.</h1>
        <nav
          aria-label="Store management"
          className="mt-7 flex gap-5 overflow-auto lg:flex-col lg:gap-1"
        >
          {[
            ["products", "Products"],
            ["categories", "Categories"],
            ["orders", "Orders"],
          ].map(([path, label]) => (
            <NavLink
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) =>
                `rounded-md px-3 py-3 text-sm ${isActive ? "soft-surface font-medium" : "muted"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
