import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Icon from "./Icon";
export default function FilterBar({ categories = [], hideCategory = false }) {
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const admin = useLocation().pathname.startsWith("/admin");
  const update = (fields) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(fields)) {
      if (value === "" || value == null) next.delete(key);
      else next.set(key, value);
    }
    next.delete("offset");
    setParams(next);
  };
  const apply = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (
      event.currentTarget.querySelector("[name=in_stock]") &&
      !data.has("in_stock")
    )
      data.set("in_stock", "");
    update(Object.fromEntries(data));
  };
  const currentSort = `${params.get("sort_by") || "created_at"}:${params.get("order") || "DESC"}`;
  const filterCount = [
    "min_price",
    "max_price",
    "in_stock",
    ...(admin ? ["is_active"] : []),
  ].filter((key) => params.has(key)).length;
  return (
    <div className="border-y line-border py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form
          key={`search-${params.get("search") || ""}`}
          onSubmit={apply}
          className="relative w-full sm:min-w-[180px] sm:w-auto sm:flex-1 sm:max-w-[280px]"
        >
          <label className="sr-only" htmlFor="collection-search">
            Search collection
          </label>
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 top-3.5 muted"
          />
          <input
            id="collection-search"
            name="search"
            type="search"
            defaultValue={params.get("search") || ""}
            className="field min-h-11 py-2.5 pl-10"
            placeholder="Search the collection"
          />
          <button className="sr-only" type="submit">
            Search collection
          </button>
        </form>
        <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto">
          {!hideCategory && (
            <select
              className="field min-h-11 w-auto py-2.5"
              aria-label="Category"
              value={params.get("category_id") || ""}
              onChange={(event) => update({ category_id: event.target.value })}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
          <label className="flex items-center gap-2 text-xs muted">
            <span className="hidden sm:inline">Sort by</span>
            <select
              className="field min-h-11 w-auto py-2.5"
              aria-label="Sort products"
              value={currentSort}
              onChange={(event) => {
                const [sort_by, order] = event.target.value.split(":");
                update({ sort_by, order });
              }}
            >
              <option value="created_at:DESC">Newest first</option>
              <option value="price:ASC">Price: low to high</option>
              <option value="price:DESC">Price: high to low</option>
              <option value="name:ASC">Name: A to Z</option>
            </select>
          </label>
          <button
            className="btn-secondary min-h-11 px-3 py-2 text-xs"
            aria-expanded={open}
            aria-controls="collection-filters"
            onClick={() => setOpen(!open)}
          >
            <Icon name="filter" size={16} />
            Filters{filterCount ? ` (${filterCount})` : ""}
          </button>
        </div>
      </div>
      {open && (
        <form
          key={params.toString()}
          id="collection-filters"
          onSubmit={apply}
          className="mt-5 grid items-end gap-4 border-t line-border pt-5 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label htmlFor="min-price" className="field-label">
              Minimum price
            </label>
            <input
              id="min-price"
              className="field"
              name="min_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="$0"
              defaultValue={params.get("min_price") || ""}
            />
          </div>
          <div>
            <label htmlFor="max-price" className="field-label">
              Maximum price
            </label>
            <input
              id="max-price"
              className="field"
              name="max_price"
              type="number"
              min="0"
              step="0.01"
              placeholder="No maximum"
              defaultValue={params.get("max_price") || ""}
            />
          </div>
          <label className="flex min-h-12 items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="in_stock"
              value="true"
              defaultChecked={params.get("in_stock") === "true"}
            />{" "}
            In stock only
          </label>
          {admin && (
            <div>
              <label htmlFor="product-status" className="field-label">
                Product status
              </label>
              <select
                id="product-status"
                name="is_active"
                className="field"
                defaultValue={params.get("is_active") || ""}
              >
                <option value="">All statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Apply
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setParams({})}
            >
              Reset
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
