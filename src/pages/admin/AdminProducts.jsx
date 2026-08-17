// pages/admin/AdminProducts.jsx
import {useCallback, useState } from "react";
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
  const {data : categories = [] , isLoading : isCategoriesLoading , isError : isCategoriesError} = useCategories();
  const {data : {products = [] , count} = {} , isLoading : isProductsLoading , isError : isProductsError} = useProducts(searchParams);
  const {mutate : addProduct , isPending : isAddPending , isError : isAddError , isSuccess : isAddSuccess , reset : addReset} = useAddProduct();
  const {mutate : modifyProduct , isPending : isModifyPending , isError : isModifyError , isSuccess : isModifySuccess , reset : modifyReset} = useModifyProduct();
  const {mutate : deleteProduct , isPending : isDeletePending , isError : isDeleteError , isSuccess : isDeleteSuccess , reset : deleteReset} = useDeleteProduct();
  const {mutate : addProductImages , isPending : isAddImagesPending , isError : isAddImagesError , isSuccess : isAddImagesSuccess , reset : addImagesReset} = useAddProductImages();
  const {mutate : deleteProductImages , isPending : isDeleteImagesPending , isError : isDeleteImagesError , isSuccess : isDeleteImagesSuccess , reset : deleteImagesReset} = useDeleteProductImages();
  const [editingProductId , setEditingProductId] = useState(null);
  const {data : editingProduct = {}} = useProducts(editingProductId ? "product_id=" + editingProductId : null);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [success , setSuccess] = useState(null);
  const [error , setError] = useState(null);

  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = parseInt(searchParams.get("offset") || "0");

  const handleSave = async (productData, isNew, newImages, imagesToDelete) => {
    try {
      if(isNew){
        addProduct(productData , {
          onSuccess : (data) =>{
            const productId = data.product_id;
            handleImages(productId , newImages , imagesToDelete);
          }
        })
      }
      else{
        modifyProduct(productData);
        handleImages(productData.product_id , newImages , imagesToDelete);
      }
      // Success feedback
      setShowForm(false);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Duplicate product name/slug");
      }
    }
  };

  const handleImages = (productId , newImages , imagesToDelete) =>{
    if (newImages && newImages.length > 0) {
        const formData = new FormData();
        formData.append("product_id", productId);
        // Append each file under the same field name 'images' (as expected by multer's .array('images'))
        newImages.forEach((file) => formData.append("images", file));
        addProductImages(formData);
      }
      // 3. Delete images marked for deletion
      if (imagesToDelete && imagesToDelete.length > 0) deleteProductImages({imagesToDelete});
  }

  const handleEditClick =  (productId) => {
  try {
    setEditingProductId(productId);
      setShowForm(true);
    
  } catch (err) {
    setError('Failed to load product details');
  }
};

const handleDelete = product_id =>{
  deleteProduct({product_id});
  setShowConfirmDelete(false);
  setSuccess('Product deleted')
}

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(count / limit);


  if(isAddSuccess){ setSuccess('Product added'); addReset();}
  if(isModifySuccess) {setSuccess('Product updated'); modifyReset()}
  if(isDeleteSuccess) {setSuccess('Product deleted'); deleteReset()}

  if(isAddError) setError('Problem adding product please try again');
  if(isModifyError) setError('Problem updating product please try again');
  if(isDeleteError) setError('Problem deleting product please try again');

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
        categories={categories}
      />
    )}

    <ConfirmModal
      isOpen={showConfirmDelete}
      onClose={() => setShowConfirmDelete(null)}
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
