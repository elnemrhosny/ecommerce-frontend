// pages/admin/AdminProducts.jsx
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterBar from "../../components/FilterBar";
import ProductForm from "../../components/admin/ProductForm";
import ConfirmModal from "../../components/ConfirmModal";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import Spinner from "../../components/Spinner";
import { useCategories } from "../../hooks/useCategories";
import { useAddProduct, useAddProductImages, useDeleteProduct, useDeleteProductImages, useModifyProduct, useProducts } from "../../hooks/useProducts";

export default function AdminProducts() {
  const [searchParams , setSearchParams] = useSearchParams();
  const {data : categories = []} = useCategories();
  const {data : {products = [] , count} = {} , isLoading : isProductsLoading , isError : isProductsError} = useProducts(searchParams);
  const { mutateAsync: addProduct, isPending: isAddPending } = useAddProduct();
  const { mutateAsync: modifyProduct, isPending: isModifyPending } = useModifyProduct();
  const { mutateAsync: deleteProduct, isPending: isDeletePending } = useDeleteProduct();
  const { mutateAsync: addProductImages, isPending: isAddImagesPending } = useAddProductImages();
  const { mutateAsync: deleteProductImages, isPending: isDeleteImagesPending } = useDeleteProductImages();
  const [editingProductId , setEditingProductId] = useState(null);
  const {data : editingProduct = {}} = useProducts(editingProductId ? "product_id=" + editingProductId : null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [success , setSuccess] = useState(null);
  const [error , setError] = useState(null);

  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = parseInt(searchParams.get("offset") || "0");

  const isSaving = isAddPending || isModifyPending || isAddImagesPending || isDeleteImagesPending;

  const errorMessage = (err, fallback) => {
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return 'The request timed out. Refresh the product list to check whether it completed before trying again.';
    }
    return typeof err.response?.data === 'string' ? err.response.data : fallback;
  };

  const handleImages = async (productId, newImages, imagesToDelete) => {
    // Finish removals before uploads so main-image updates cannot race.
    if (imagesToDelete?.length) await deleteProductImages({ imagesToDelete });
    if (newImages?.length) {
      const formData = new FormData();
      formData.append('product_id', productId);
      newImages.forEach((file) => formData.append('images', file));
      await addProductImages(formData);
    }
  };

  const handleSave = async (productData, isNew, newImages, imagesToDelete) => {
    if (isSaving) return;
    let productSaved = false;
    try {
      const saved = isNew ? await addProduct(productData) : await modifyProduct(productData);
      productSaved = true;
      // The API returns { product, images }, not a top-level product_id.
      const productId = isNew ? saved.product.product_id : productData.product_id;
      await handleImages(productId, newImages, imagesToDelete);
      setShowForm(false);
      setSuccess(isNew ? 'Product added' : 'Product updated');
    } catch (err) {
      // A retry must edit an already-created product, not create it again.
      if (productSaved) setShowForm(false);
      const message = errorMessage(err, 'Could not save the product. Please try again.');
      setError(productSaved ? `Product saved, but image changes may be incomplete. Reopen Edit to check before retrying. ${message}` : message);
    }
  };

  const handleEditClick = (productId) => {
    setEditingProductId(productId);
    setShowForm(true);
  };

  const handleDelete = async (product_id) => {
    if (isDeletePending) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteProduct({ product_id });
      setSuccess('Product deleted');
    } catch (err) {
      setError(errorMessage(err, 'Could not delete the product. Please try again.'));
    } finally {
      setShowConfirmDelete(false);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);


 return (
  <>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Products
      </h1>
      <button
        onClick={() => {
          setEditingProductId(null);
          setShowForm(true);
        }}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        Add Product
      </button>
    </div>
        <div className="m-5">
    <FilterBar categories={categories} />
    </div>

    {isProductsLoading ? (
      <Spinner />
    ) : isProductsError ? (
      <p role="alert" className="text-red-600 dark:text-red-400">Could not load products. Please refresh and try again.</p>
    ) : (
      <>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.category_name}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">${Number(p.price).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        p.is_active ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(p.product_id)}
                      className="text-indigo-600 hover:underline text-sm dark:text-indigo-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(p.product_id)}
                      disabled={isDeletePending}
                      className="text-red-600 hover:underline text-sm dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 dark:text-gray-400">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("offset", (currentPage - 2) * limit);
                setSearchParams(params);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("offset", currentPage * limit);
                setSearchParams(params);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        )}
      </>
    )}

    {/* Product Form Modal */}
    {showForm && (
      <ProductForm
        product={editingProduct?.product}
        images={editingProduct?.images}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        isSaving={isSaving}
        categories={categories}
      />
    )}

    <ConfirmModal
      isOpen={showConfirmDelete}
      onClose={() => { if (!isDeletePending) setShowConfirmDelete(null); }}
      loading={isDeletePending}
      onConfirm={() => handleDelete(showConfirmDelete)}
      title="Delete Product"
      message="Are you sure you want to delete this product? This cannot be undone."
      variant="danger"
    />

    <SuccessModal
      isOpen={success}
      onClose={() => setSuccess(null)}
      message={success}
    />

    <ErrorModal
      isOpen={error}
      onClose={() => setError(null)}
      message={error}
    />
  </>
);
}
