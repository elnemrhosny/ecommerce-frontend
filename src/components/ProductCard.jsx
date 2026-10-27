import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAddCart } from "../hooks/useCart";
import { useAddWishlist, useDeleteWishlist } from "../hooks/useUser";
import { useAuth } from "../contexts/AuthContext";
import { getApiError } from "../functions/apiErrors";
import Image from "./Image";
import Icon from "./Icon";

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useAddCart();
  const addWishlist = useAddWishlist();
  const removeWishlist = useDeleteWishlist();
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const inStock =
    Number(product.stock) > 0 && Number(product.is_active ?? 1) === 1;
  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login", {
        state: { from: location.pathname + location.search },
      });
      return;
    }
    setError("");
    try {
      await (product.is_wishlisted ? removeWishlist : addWishlist).mutateAsync({
        product_id: product.product_id,
      });
    } catch (err) {
      setError(getApiError(err, "Could not update your wishlist."));
    }
  };
  const addToBag = async () => {
    setError("");
    setNotice("");
    try {
      await cart.mutateAsync({ product_id: product.product_id });
      setNotice("Added to your bag");
    } catch (err) {
      setError(getApiError(err, "Could not add this item to your bag."));
    }
  };
  return (
    <article className="product-card min-w-0">
      <div className="product-tile">
        <Link
          to={`/product/${product.product_id}`}
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image_url}
            alt={product.name}
            aspectRatio="4/5"
            containerClassName="h-full"
          />
        </Link>
        <button
          onClick={toggleWishlist}
          disabled={addWishlist.isPending || removeWishlist.isPending}
          className="icon-button absolute right-3 top-3 h-9 w-9 bg-white/90 text-gray-800"
          aria-label={`${product.is_wishlisted ? "Remove" : "Save"} ${product.name}${product.is_wishlisted ? " from" : " to"} wishlist`}
          aria-pressed={Boolean(product.is_wishlisted)}
        >
          <Icon
            name="heart"
            size={17}
            fill={product.is_wishlisted ? "currentColor" : "none"}
          />
        </button>
        {!inStock && (
          <span className="absolute left-3 top-4 bg-white/90 px-2 py-1 text-[9px] uppercase tracking-wider text-gray-700">
            Out of stock
          </span>
        )}
        <button
          onClick={addToBag}
          disabled={cart.isPending || !inStock}
          className="product-quick-add btn rounded-sm py-2.5 text-xs"
        >
          {cart.isPending
            ? "Adding…"
            : inStock
              ? "Add to bag"
              : "Currently unavailable"}
          {inStock && <Icon name="plus" size={14} />}
        </button>
      </div>
      <div className="flex flex-col items-start justify-between gap-1 pt-4 sm:flex-row sm:gap-3">
        <div className="min-w-0">
          <p className="eyebrow mb-1.5 text-[9px] tracking-[.15em]">
            {product.category_name || "The collection"}
          </p>
          <h3 className="text-sm font-medium leading-6">
            <Link
              to={`/product/${product.product_id}`}
              className="hover:underline underline-offset-4"
            >
              {product.name}
            </Link>
          </h3>
        </div>
        <p className="shrink-0 pt-1 text-sm tabular-nums sm:pt-5">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
      {notice && (
        <p
          role="status"
          className="mt-2 text-xs text-indigo-700 dark:text-indigo-300"
        >
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </article>
  );
}
