import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../hooks/useUser";
import ProductCard from "../components/ProductCard";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";
export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isError, refetch } = useWishlist(
    offset,
    12,
    Boolean(user),
  );
  if (!authLoading && !user)
    return <Navigate to="/login" state={{ from: "/wishlist" }} replace />;
  const products = data?.wishlist || [];
  const count = Number(data?.count) || 0;
  return (
    <div className="site-width py-10 sm:py-14">
      <p className="eyebrow mb-4">Keep the good ones close</p>
      <div className="mb-10 flex items-end justify-between gap-4">
        <h1 className="display-title text-5xl sm:text-6xl">Your favourites.</h1>
        <span className="muted text-xs">
          {count} saved {count === 1 ? "find" : "finds"}
        </span>
      </div>
      {isLoading || authLoading ? (
        <Spinner />
      ) : isError ? (
        <div className="empty-state">
          <p>Your wishlist couldn’t load.</p>
          <button className="btn-secondary" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : products.length ? (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-7 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
          {count > 12 && (
            <nav
              aria-label="Wishlist pages"
              className="mt-10 flex items-center justify-between"
            >
              <button
                className="btn-secondary"
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - 12))}
              >
                Previous
              </button>
              <span className="muted text-xs">
                {Math.floor(offset / 12) + 1} / {Math.ceil(count / 12)}
              </span>
              <button
                className="btn-secondary"
                disabled={offset + 12 >= count}
                onClick={() => setOffset(offset + 12)}
              >
                Next
              </button>
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <Icon name="heart" size={30} />
          <h2 className="font-display text-3xl">
            A space for your favourites.
          </h2>
          <p className="muted text-sm">
            Tap the heart on an item to save it for another day.
          </p>
          <Link className="btn-primary" to="/">
            Find something to love
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
