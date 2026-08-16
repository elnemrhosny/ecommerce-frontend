// components/admin/CategoryForm.jsx
import { useState, useEffect, useRef } from "react";
import ConfirmModal from "../ConfirmModal";
import ErrorModal from "../ErrorModal";

export default function CategoryForm({ category, onClose, onSave }) {
  const isNew = !category;
  const fileInputRef = useRef(null);

  // Keep a ref to the original image URL so we can decide if a replacement needs deletion
  const originalImageRef = useRef(category?.image_url || null);

  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Image states
  const [currentImage, setCurrentImage] = useState(null); // currently displayed existing image (or null)
  const [newImage, setNewImage] = useState(null); // File object for new upload
  const [newImagePreview, setNewImagePreview] = useState(null); // blob URL for preview
  const [explicitDelete, setExplicitDelete] = useState(false); // true when X button confirmed
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate form when category changes
  useEffect(() => {
    originalImageRef.current = category?.image_url || null;
    if (category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
      });
      setCurrentImage(category.image_url || null);
    } else {
      setForm({ name: "", description: "" });
      setCurrentImage(null);
    }
    // Reset image selections
    setNewImage(null);
    setNewImagePreview(null);
    setExplicitDelete(false);
  }, [category]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    };
  }, [newImagePreview]);

  // Derived flag: true if we should delete the old image
  const deleteImageFlag = explicitDelete || (newImage !== null && !!originalImageRef.current);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // File selection (single file)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revoke previous preview
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);

    setNewImage(file);
    setNewImagePreview(URL.createObjectURL(file));

    // If we had an existing image and it hasn't been explicitly deleted yet,
    // we'll need to delete it (replacement). Explicit delete flag remains as is.
    // The derived deleteImageFlag will become true automatically if originalImageRef.current exists.

    // Hide the current image preview because we're showing the new one
    setCurrentImage(null);

    e.target.value = "";
  };

  const removeNewImage = () => {
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImage(null);
    setNewImagePreview(null);

    // If the user hadn't explicitly asked to delete the original image,
    // and they are removing the replacement, show the original again
    if (!explicitDelete && originalImageRef.current) {
      setCurrentImage(originalImageRef.current);
    }
  };

  // Trigger delete of existing image (X button)
  const handleDeleteExisting = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setExplicitDelete(true);
    setCurrentImage(null);
    // Discard any new file selection
    if (newImagePreview) URL.revokeObjectURL(newImagePreview);
    setNewImage(null);
    setNewImagePreview(null);
    setShowDeleteConfirm(false);
  };

  // Validate form fields (simple)
  const validate = () => {
    const msgs = [];
    if (!form.name || form.name.trim() === "") msgs.push("Category name is required.");
    return { valid: msgs.length === 0, messages: msgs };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();
    if (!validation.valid) {
      setErrors(validation.messages);
      setShowErrorModal(true);
      return;
    }

    // Build payload
    const payload = isNew
      ? { name: form.name, description: form.description }
      : { category_id: category.category_id, ...form };

    // Pass image instructions to parent
    onSave(payload, isNew, newImage, deleteImageFlag);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {isNew ? "Add Category" : "Edit Category"}
      </h2>

      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 mb-4 text-sm">
          {errors.map((err, i) => (
            <div key={i}>• {err}</div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-700"
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Image
          </label>

          {/* Current image display */}
          {currentImage && !deleteImageFlag && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border mb-3 border-gray-200 dark:border-gray-600">
              <img
                src={currentImage}
                alt="Current category"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleDeleteExisting}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100 dark:bg-red-700 dark:hover:bg-red-800"
                title="Delete image"
              >
                ✕
              </button>
            </div>
          )}

          {/* New image preview */}
          {newImagePreview && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border mb-3 border-gray-200 dark:border-gray-600">
              <img
                src={newImagePreview}
                alt="New preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeNewImage}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 dark:bg-red-700 dark:hover:bg-red-800"
                title="Remove"
              >
                ✕
              </button>
            </div>
          )}

          {/* File input (single) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900 dark:file:text-indigo-300 dark:hover:file:bg-indigo-800 cursor-pointer"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Upload a new image to replace the current one.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition"
          >
            {isNew ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>

    {/* Confirm delete modal */}
    <ConfirmModal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={confirmDelete}
      title="Remove Image"
      message="Are you sure you want to remove the current image?"
      confirmText="Remove"
      variant="danger"
    />

    {/* Error modal */}
    <ErrorModal
      isOpen={showErrorModal}
      onClose={() => setShowErrorModal(false)}
      title="Validation Error"
      message={errors.join("\n")}
      buttonText="Close"
    />
  </div>
);
}