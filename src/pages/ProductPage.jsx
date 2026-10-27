import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useAddCart } from "../hooks/useCart";
import { useAddWishlist, useDeleteWishlist } from "../hooks/useUser";
import { useAuth } from "../contexts/AuthContext";
import { getProductImages, getGalleryIndex } from "../functions/productImages";
import { getApiError } from "../functions/apiErrors";
import Image from "../components/Image";
import Lightbox from "../components/Lightbox";
import Icon from "../components/Icon";
import ProductReviews from "../components/ProductReviews";
export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useProducts(`product_id=${id}`);
  const cart = useAddCart();
  const wishlistAdd = useAddWishlist();
  const wishlistDelete = useDeleteWishlist();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const product = data?.product;
  const images = getProductImages(product, data?.images);
  const current = getGalleryIndex(index, images.length);
  useEffect(() => {
    if (!isLoading && product && location.hash === "#reviews")
      document.getElementById("reviews")?.scrollIntoView();
  }, [isLoading, product, location.hash]);
  if (isLoading)
    return (
      <div
        className="site-width grid animate-pulse gap-10 py-12 lg:grid-cols-2"
        role="status"
        aria-label="Loading product"
      >
        <div className="soft-surface aspect-square rounded" />
        <div className="soft-surface h-64 rounded" />
      </div>
    );
  if (isError || !product)
    return (
      <div className="site-width py-16">
        <div className="empty-state">
          <h1 className="display-title text-4xl">
            {isError ? "This find couldn’t load." : "Product not found."}
          </h1>
          <p className="muted text-sm">
            {isError
              ? "Please check your connection and try again."
              : "It may have moved or is no longer available."}
          </p>
          {isError ? (
            <button className="btn-secondary" onClick={() => refetch()}>
              Try again
            </button>
          ) : (
            <Link className="btn-primary" to="/">
              Explore the collection
            </Link>
          )}
        </div>
      </div>
    );
  const addToBag = async () => {
    setError("");
    setNotice("");
    try {
      await cart.mutateAsync({ product_id: id });
      setNotice("Added to your bag.");
    } catch (err) {
      setError(getApiError(err, "Could not add this item."));
    }
  };
  const toggleWishlist = async () => {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setError("");
    try {
      await (product.is_wishlisted ? wishlistDelete : wishlistAdd).mutateAsync({
        product_id: id,
      });
    } catch (err) {
      setError(getApiError(err, "Could not update your wishlist."));
    }
  };
  const available =
    Number(product.stock) > 0 && Boolean(Number(product.is_active));
  return (
    <div className="site-width py-7 sm:py-10">
      <nav
        className="muted mb-8 flex items-center gap-3 text-[11px]"
        aria-label="Breadcrumb"
      >
        <Link to="/">The collection</Link>
        <span>/</span>
        <Link to={`/?category_id=${product.category_id}`}>
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="truncate max-w-40">{product.name}</span>
      </nav>
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <button
            type="button"
            className="block w-full cursor-zoom-in overflow-hidden rounded-md disabled:cursor-default"
            disabled={!images.length}
            aria-label={
              images.length
                ? `Enlarge image of ${product.name}`
                : "No product image available"
            }
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              key={images[current]?.image_url || "placeholder"}
              src={images[current]?.image_url}
              alt={product.name}
              aspectRatio="1/1"
              loading="eager"
            />
          </button>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-auto">
              {images.map((image, i) => (
                <button
                  key={image.image_id || image.image_url}
                  className={`w-20 shrink-0 overflow-hidden rounded border-2 ${i === current ? "border-indigo-600" : "border-transparent"}`}
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === current}
                >
                  <Image src={image.image_url} alt="" aspectRatio="1/1" />
                </button>
              ))}
            </div>
          )}
          <p className="muted mt-4 text-center text-[10px] tracking-wide">
            {images.length
              ? "A closer look. Select an image to enlarge."
              : "Photography for this item is not available yet."}
          </p>
        </div>
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow mb-4">{product.category_name}</p>
          <h1 className="display-title text-[clamp(2.5rem,4vw,4.3rem)]">
            {product.name}
          </h1>
          <p className="mt-6 text-2xl tabular-nums">
            ${Number(product.price).toFixed(2)}
          </p>
          <a
            href="#reviews"
            className="muted mt-4 inline-flex items-center gap-2 text-xs underline underline-offset-4"
          >
            <Icon name="star" size={14} />
            Read customer reviews
          </a>
          <p className="muted mb-7 mt-7 whitespace-pre-line text-sm leading-8">
            {product.description ||
              "A new addition to the collection. Explore the details and make it part of your everyday."}
          </p>
          <div className="mb-6 flex items-center gap-2 text-xs">
            <span
              className={`h-1.5 w-1.5 rounded-full ${available ? "bg-indigo-600" : "bg-gray-400"}`}
            />
            {available
              ? "In stock and ready to add to your bag"
              : "Currently unavailable"}
          </div>
          <div className="flex gap-3">
            <button
              className="btn-primary flex-1"
              disabled={!available || cart.isPending}
              onClick={addToBag}
            >
              {cart.isPending
                ? "Adding…"
                : available
                  ? "Add to bag"
                  : "Out of stock"}
              <Icon name="bag" size={17} />
            </button>
            <button
              className="btn-secondary px-4"
              aria-label={
                product.is_wishlisted
                  ? "Remove from wishlist"
                  : "Save to wishlist"
              }
              aria-pressed={Boolean(product.is_wishlisted)}
              disabled={wishlistAdd.isPending || wishlistDelete.isPending}
              onClick={toggleWishlist}
            >
              <Icon
                name="heart"
                fill={product.is_wishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
          {notice && (
            <p
              role="status"
              className="mt-4 rounded-md soft-surface px-4 py-3 text-sm"
            >
              {notice}{" "}
              <Link className="underline underline-offset-4" to="/cart">
                View bag
              </Link>
            </p>
          )}
          {error && (
            <p role="alert" className="inline-error mt-4">
              {error}
            </p>
          )}
          <div className="mt-8 border-t line-border">
            <details className="border-b line-border py-5" open>
              <summary className="cursor-pointer text-xs font-medium">
                Product details
              </summary>
              <dl className="muted mt-4 grid grid-cols-2 gap-3 text-xs">
                <dt>Category</dt>
                <dd>{product.category_name}</dd>
                <dt>Availability</dt>
                <dd>{available ? "In stock" : "Unavailable"}</dd>
              </dl>
            </details>
            <details className="border-b line-border py-5">
              <summary className="cursor-pointer text-xs font-medium">
                A note from the community
              </summary>
              <p className="muted mt-4 text-xs leading-6">
                Explore honest ratings and experiences below. Have something to
                share? Sign in to leave your own review.
              </p>
            </details>
          </div>
        </div>
      </div>
      <ProductReviews key={id} productId={id} />
      <Lightbox
        isOpen={lightboxOpen && Boolean(images.length)}
        images={images}
        currentIndex={current}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => {
          if (images.length)
            setIndex((current - 1 + images.length) % images.length);
        }}
        onNext={() => {
          if (images.length) setIndex((current + 1) % images.length);
        }}
      />
    </div>
  );
}
