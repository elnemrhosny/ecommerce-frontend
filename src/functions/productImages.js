// Exclude missing images and retain products that only have a main image.
export function getProductImages(product, images) {
  const gallery = Array.isArray(images)
    ? images.filter((image) => typeof image?.image_url === "string" && image.image_url.trim())
    : [];
  const mainImage = product?.image_url;
  if (typeof mainImage === "string" && mainImage.trim() && !gallery.some((image) => image.image_url === mainImage)) {
    return [{ image_id: "main", image_url: mainImage }, ...gallery];
  }
  return gallery;
}

export function getGalleryIndex(index, length) {
  return Number.isInteger(index) && index >= 0 && index < length ? index : 0;
}
