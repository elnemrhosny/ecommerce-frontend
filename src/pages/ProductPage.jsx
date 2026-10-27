// pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Image from '../components/Image';
import Lightbox from '../components/Lightbox';
import { getProductImages, getGalleryIndex } from '../functions/productImages';
import Spinner from '../components/Spinner';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import { useProducts } from '../hooks/useProducts';
import { useAddCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useAddWishlist , useDeleteWishlist } from '../hooks/useUser';

export default function ProductPage() {
  const {user} = useAuth();
  const {id} = useParams();
  const {data  = {}  , isLoading : isProductLoading , isError : isProductError}= useProducts(`product_id=${id}`);
  const { mutate: addWishlist } = useAddWishlist();
  const { mutate: deleteWishlist } = useDeleteWishlist();
  const [wishlistError, setWishlistError] = useState(false);
  const {mutate : handleCartAdd , isPending : isCartAddLoading, isSuccess : isCartAddSuccess , isError : isCartAddError , reset : cartAddReset} = useAddCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const product = data?.product;
  

  if (isProductLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (isProductError || !product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-red-500">{isProductError ? 'Could not load this product. Please try again.' : 'Product not found'}</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    if (!user) setWishlistError("You have to be logged in the use the wishlist");
    else if (product.is_wishlisted) deleteWishlist({ product_id: product.product_id });
    else addWishlist({ product_id: product.product_id });
  };
  

  const allImages = getProductImages(product, data.images);
  const galleryIndex = getGalleryIndex(lightboxIndex, allImages.length);

  const openLightbox = (index) => {
    if (allImages.length === 0) return;
    setLightboxIndex(getGalleryIndex(index, allImages.length));
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) => (getGalleryIndex(prev, allImages.length) - 1 + allImages.length) % allImages.length);
  };

  const goToNext = () => {
    if (allImages.length === 0) return;
    setLightboxIndex((prev) => (getGalleryIndex(prev, allImages.length) + 1) % allImages.length);
  };



  return (
  <div className="mx-auto max-w-5xl px-4 py-8">
    {/* Back link */}
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mb-6 dark:text-indigo-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Products
    </Link>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* IMAGE GALLERY */}
      <div className="space-y-4">
        {/* Main image – clickable */}
        <button
          type="button"
          className="block w-full aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 cursor-pointer disabled:cursor-default dark:bg-gray-700"
          disabled={allImages.length === 0}
          aria-label={allImages.length ? `Enlarge image of ${product.name}` : 'No product image available'}
          onClick={() => openLightbox(galleryIndex)}
        >
          <Image
            key={allImages[galleryIndex]?.image_url || 'placeholder'}
            src={allImages[galleryIndex]?.image_url || '/placeholder.png'}
            alt={product.name}
            aspectRatio="4/3"
            objectFit="cover"
            containerClassName="rounded-xl"
            className='h-full w-full object-cover'
          />
        </button>

        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, idx) => (
              <button
                key={img.image_id}
                onClick={() => {
                  setLightboxIndex(idx);
                }}
                className={`h-20 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  idx === galleryIndex
                    ? 'border-indigo-600 dark:border-indigo-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                <Image
                  src={img.image_url}
                  alt=""
                  aspectRatio="1/1"
                  objectFit="cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-col">
        <div className="mb-2">
          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
            {product.category_name}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-100">
          {product.name}
        </h1>
        <p className="text-gray-600 mb-6 dark:text-gray-400">
          {product.description}
        </p>

        <div className="text-3xl font-bold text-indigo-600 mb-4 dark:text-indigo-400">
          ${Number(product.price).toFixed(2)}
        </div>

        <div
          className={`text-sm font-medium mb-6 ${
            product.stock > 0
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </div>

        {/* Add to Cart / Wishlist */}
        <div className="mt-auto flex gap-3">
          <button
            disabled={isCartAddLoading || product.stock === 0}
            className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer dark:bg-indigo-500 dark:hover:bg-indigo-600"
            onClick={() => handleCartAdd({ product_id: product.product_id })}
          >
            Add to Cart
          </button>
          <button onClick={handleToggleWishlist} className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50  dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700">
            <span
                className={
                  product.is_wishlisted ? "text-red-500 dark:text-red-400" : ""
                }
              >
                {product.is_wishlisted ? "♥" : "♡"}
              </span>
          </button>
        </div>
      </div>
    </div>

    {/* Lightbox */}
    <Lightbox
      isOpen={lightboxOpen}
      images={allImages}
      currentIndex={galleryIndex}
      onClose={closeLightbox}
      onPrev={goToPrev}
      onNext={goToNext}
    />
    <SuccessModal
      isOpen={isCartAddSuccess}
      onClose={cartAddReset}
      message="Item added to cart"
      onConfirm={cartAddReset}
    />
    <ErrorModal
      isOpen={isCartAddError}
      onClose={cartAddReset}
      message="You already have this item in your cart"
      onConfirm={cartAddReset}
    />
     <ErrorModal
      isOpen={wishlistError}
      onClose={() => setWishlistError(false)}
      message={wishlistError}
      onConfirm={() => setWishlistError(false)}
    />
  </div>
);
}