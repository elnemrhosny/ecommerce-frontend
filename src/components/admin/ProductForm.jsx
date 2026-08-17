// components/admin/ProductForm.jsx
import { useState, useEffect, useRef } from "react";
import { validateProduct } from "../../functions/products";
import ErrorModal from "../ErrorModal";
import ConfirmModal from "../ConfirmModal";

export default function ProductForm({ product, onClose, onSave , categories , images}) {
  const isNew = !product;
  const fileInputRef = useRef(null);
  const prevProductIdRef = useRef(null);
  const [pendingImageDeleteId , setPendingImageDeleteId] = useState(false);
  // Form state
  const [form, setForm] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "", 
    stock: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Image handling
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);          // File objects
  const [imagesToDelete, setImagesToDelete] = useState([]); // image_id strings
  const [newImagePreviews, setNewImagePreviews] = useState([]); // { file, previewUrl }

  // Fetch categories on mount
  

  // Populate form & reset images only when product changes identity
  useEffect(() => {
    const currentId = product?.product_id || null;

    // If the product changed (or we switched from new to edit), reset form and images
    if (prevProductIdRef.current !== currentId) {
      if (product) {
        setForm({
          name: product.name || "",
          category_id: product.category_id || "",
          description: product.description || "",
          price: product.price != null ? product.price : "",
          stock: product.stock != null ? product.stock : 0,
          is_active: product.is_active !== undefined ? product.is_active : true,
        });
        setExistingImages(
          images?.map((img) => ({
            image_id: img.image_id,
            image_url: img.image_url,
          })) || []
        );
      } else {
        setForm({
          name: "",
          category_id: "",
          description: "",
          price: "",
          stock: 0,
          is_active: true,
        });
        setExistingImages([]);
      }
      // Clear any file selections from previous product
      setNewImages([]);
      setNewImagePreviews([]);
      setImagesToDelete([]);
    }
    prevProductIdRef.current = currentId;
  }, [product]);

  // Generic input handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  };

  // File selection – generate previews immediately
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = ""; // reset input
  };

  // Remove a newly selected file
  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      const removed = prev.filter((_, i) => i !== index);
      // Revoke the blob URL of the removed item
      if (prev[index]) URL.revokeObjectURL(prev[index].previewUrl);
      return removed;
    });
  };

  // Mark an existing image for deletion
  const markExistingForDeletion = (imageId) => {
    setImagesToDelete((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.image_id !== imageId));
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateProduct(form);
    if (!validation.valid) {
      setErrors(validation.messages);
      setShowErrorModal(true);
      return;
    }

    let payload;
    if (isNew) {
      payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
    } else {
      const changes = { product_id: product.product_id };
      let hasChanges = false;
      if (form.name !== product.name) { changes.name = form.name; hasChanges = true; }
      if (form.category_id !== product.category_id) { changes.category_id = form.category_id; hasChanges = true; }
      if (form.description !== product.description) { changes.description = form.description; hasChanges = true; }
      if (Number(form.price) !== Number(product.price)) { changes.price = Number(form.price); hasChanges = true; }
      if (Number(form.stock) !== Number(product.stock)) { changes.stock = Number(form.stock); hasChanges = true; }
      if (form.is_active !== product.is_active) { changes.is_active = form.is_active; hasChanges = true; }
      if (!hasChanges && newImages.length === 0 && imagesToDelete.length === 0) {
        setErrors(["No changes detected."]);
        setShowErrorModal(true);
        return;
      }
      payload = changes;
    }

    onSave(payload, isNew, newImages, imagesToDelete);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {isNew ? "Add Product" : "Edit Product"}
      </h2>

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 mb-4 text-sm">
          {errors.map((err, i) => <div key={i}>• {err}</div>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-700"
            />
          </div>
        </div>

        {/* Active status */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-500 dark:checked:bg-indigo-500 dark:focus:ring-indigo-700"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
        </div>

        {/* ===== IMAGE SECTION ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images</label>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {existingImages.map(img => (
                <div key={img.image_id} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPendingImageDeleteId(img.image_id)}
                    className="absolute top-0 right-0 bg-red-600 dark:bg-red-700 text-white rounded-bl-lg p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Previews of newly selected files */}
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {newImagePreviews.map((item, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                  <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 dark:bg-red-700 text-white rounded-bl-lg p-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* File input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800 cursor-pointer"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            {isNew ? "Create Product" : "Update Product"}
          </button>
        </div>
      </form>
    </div>

    <ErrorModal
      isOpen={showErrorModal}
      onClose={() => setShowErrorModal(false)}
      title="Validation Error"
      message={errors.join("\n")}
      buttonText="Close"
    />
    <ConfirmModal
      isOpen={pendingImageDeleteId}
      onClose={() => setPendingImageDeleteId(false)}
      onConfirm={() => {
        if (pendingImageDeleteId) {
          markExistingForDeletion(pendingImageDeleteId);
          setPendingImageDeleteId(false);
        }
      }}
      title="Delete Image"
      message="Are you sure you want to delete this image? This cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
    />
  </div>
);
}