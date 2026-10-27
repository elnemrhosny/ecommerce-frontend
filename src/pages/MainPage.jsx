import { Link, useSearchParams } from "react-router-dom";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import Icon from "../components/Icon";

export default function MainPage() {
  const [params, setParams] = useSearchParams();
  const query = new URLSearchParams(params);
  query.set("is_active", "true");
  const { data, isLoading, isError, refetch } = useProducts(query);
  const { data: categories = [] } = useCategories();
  const products = data?.products || [];
  const count = Number(data?.count || 0);
  const limit = Math.min(Math.max(Number(params.get("limit")) || 12, 1), 100);
  const offset = Math.max(Number(params.get("offset")) || 0, 0);
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(count / limit);
  const filtered = [
    "search",
    "category_id",
    "min_price",
    "max_price",
    "in_stock",
  ].some((key) => params.has(key));
  const goToPage = (next) => {
    const query = new URLSearchParams(params);
    query.set("offset", String((next - 1) * limit));
    setParams(query);
    document.getElementById("collection")?.scrollIntoView();
  };
  return (
    <div className="site-width">
      {!filtered && (
        <section
          className="grid gap-8 border-b line-border py-8 sm:py-12 lg:grid-cols-[1fr_1.08fr] lg:gap-16 lg:py-14"
          aria-label="Welcome to ShopName"
        >
          <div className="flex flex-col items-start justify-center py-7 lg:py-10">
            <p className="eyebrow mb-7">The everyday edit / ShopName</p>
            <h1 className="display-title max-w-xl text-[clamp(3.5rem,6.5vw,6.4rem)]">
              Good things.
              <br />
              <span className="italic" style={{ color: "var(--accent)" }}>
                Every day.
              </span>
            </h1>
            <p className="muted mb-8 mt-7 max-w-[340px] text-sm leading-7">
              Objects to wear, use, and make your own. Explore the collection,
              one good find at a time.
            </p>
            <a href="#collection" className="btn-primary">
              Explore the collection <Icon name="arrow" size={17} />
            </a>
            <div className="mt-10 flex items-center gap-3">
              <span
                className="h-px w-9"
                style={{ background: "var(--accent)" }}
              />
              <span className="eyebrow text-[9px]">
                A little less noise. A little more you.
              </span>
            </div>
          </div>
          <div className="hero-art min-h-72 lg:min-h-[480px]">
            <img
              src="/everyday-edit.svg"
              alt="Illustration of a canvas tote, headphones, notebook and bottle in a quiet studio"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
            <span className="hero-art-label">OBJECTS FOR EVERYDAY LIVING</span>
          </div>
        </section>
      )}
      <section id="collection" className="scroll-mt-28 py-10 sm:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Discover your next favourite</p>
            <h2 className="display-title text-4xl sm:text-5xl">
              {params.get("search")
                ? `Results for “${params.get("search")}”`
                : "The collection"}
            </h2>
          </div>
          <p className="muted pb-1 text-xs">
            {isLoading
              ? "Finding your favourites…"
              : `${count} ${count === 1 ? "item" : "items"}`}
          </p>
        </div>
        <nav
          className="catalog-tabs mb-5 flex gap-7 overflow-x-auto"
          aria-label="Product categories"
        >
          <Link
            className={!params.get("category_id") ? "active" : ""}
            to={
              params.get("search")
                ? `/?search=${encodeURIComponent(params.get("search"))}#collection`
                : "/#collection"
            }
          >
            All objects
          </Link>
          {categories.map((category) => {
            const next = new URLSearchParams(params);
            next.set("category_id", category.category_id);
            next.delete("offset");
            return (
              <Link
                className={
                  params.get("category_id") === category.category_id
                    ? "active"
                    : ""
                }
                key={category.category_id}
                to={`/?${next}#collection`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
        <FilterBar categories={categories} hideCategory />
        {isLoading ? (
          <div
            aria-label="Loading products"
            role="status"
            className="mt-7 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="soft-surface aspect-[4/5] rounded" />
                <div className="soft-surface mt-4 h-3 w-1/3 rounded" />
                <div className="soft-surface mt-3 h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="empty-state mt-7">
            <h3 className="font-display text-2xl">
              The collection couldn’t load.
            </h3>
            <p className="muted text-sm">
              Please check your connection and try again.
            </p>
            <button className="btn-secondary" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        ) : products.length ? (
          <div className="mt-7 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state mt-7">
            <Icon name="search" size={28} />
            <h3 className="font-display text-2xl">Nothing here just yet.</h3>
            <p className="muted max-w-sm text-sm">
              {filtered
                ? "Try another search or clear your filters to explore the collection."
                : "New finds will appear here when they are available."}
            </p>
            {filtered && (
              <button className="btn-secondary" onClick={() => setParams({})}>
                Clear filters
              </button>
            )}
          </div>
        )}
        {pages > 1 && (
          <nav
            className="mt-12 flex items-center justify-between border-t line-border pt-6"
            aria-label="Product pages"
          >
            <button
              className="btn-secondary"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              <Icon name="back" size={16} />
              Previous
            </button>
            <span className="muted text-xs">
              {page} / {pages}
            </span>
            <button
              className="btn-secondary"
              disabled={page >= pages}
              onClick={() => goToPage(page + 1)}
            >
              Next
              <Icon name="arrow" size={16} />
            </button>
          </nav>
        )}
      </section>
      <section className="mb-4 grid gap-6 border-t line-border py-9 sm:grid-cols-3">
        <div>
          <p className="eyebrow mb-3">01 / Discover</p>
          <p className="text-sm">A collection to explore at your pace.</p>
        </div>
        <div>
          <p className="eyebrow mb-3">02 / Make it yours</p>
          <p className="text-sm">Save the things you love to your wishlist.</p>
        </div>
        <div>
          <p className="eyebrow mb-3">03 / Share your view</p>
          <p className="text-sm">Real opinions, from people like you.</p>
        </div>
      </section>
    </div>
  );
}
