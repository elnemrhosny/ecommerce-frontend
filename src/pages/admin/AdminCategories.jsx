// pages/admin/AdminCategories.jsx
import { useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import SuccessModal from '../../components/SuccessModal';
import ErrorModal from '../../components/ErrorModal';
import Spinner from '../../components/Spinner';
import CategoryForm from '../../components/admin/CategoryForm';
import { useAddCategory, useAddCategoryImage, useCategories, useDeleteCategory, useDeleteCategoryImage, useModifyCategory } from '../../hooks/useCategories';

export default function AdminCategories() {
  const {data : categories = [] , isLoading} = useCategories();
  const {mutate : addCategory , isSuccess : isAddSuccess , isError : isAddError , reset : addReset} = useAddCategory();
  const {mutate : modifyCategory , isSuccess : isModifySuccess , isError : isModifyError , reset : modifyReset} = useModifyCategory();
  const {mutate : deleteCategory , isSuccess : isDeleteSuccess , isError : isDeleteError , reset : deleteReset} = useDeleteCategory();
  const {mutate : addImage , isSuccess : isAddImageSuccess , isError : isAddImageError , reset : addImageReset} = useAddCategoryImage();
  const {mutate : deleteImage , isSuccess : isDeleteImageSuccess , isError : isDeleteImageError , reset : deleteImageReset} = useDeleteCategoryImage();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete , setConfirmDelete] = useState(false);



const handleSave =  (categoryData, isNew, newImage, deleteImageFlag) => {
    // 1. Save category fields
    if(isNew){
      addCategory(categoryData , {
        onSuccess :  (data) =>{
           handleImage(data.category_id , newImage , deleteImageFlag);
        }
      })
    }
    else{
      modifyCategory(categoryData , {
        onSuccess :  (data) =>{
           handleImage(categoryData.category_id , newImage , deleteImageFlag)
        }
      })
    }

   
};

  const handleDelete =  (id) => {
      deleteCategory({category_id : id});
      setConfirmDelete(null);
  };

  const handleImage = (category_id , newImage , imageToDelete) =>{
      if (newImage) {
      const formData = new FormData();
      formData.append('category_id', category_id);
      formData.append('image', newImage);
      addImage(formData);
    }
    else if(imageToDelete) deleteImage({category_id});
  }

  if(isAddError){
    setError('Error adding category please try again');
    addReset();
  }
  if(isModifyError){
    setError('Error updating category please try again');
    modifyReset();
  }
  if(isDeleteError){
    setError('Error deleting category please try again');
    deleteReset();
  }
  if(isAddSuccess){
    setSuccess('Category added');
    addReset();
    setShowForm(null);
  }
  if(isModifySuccess){
    setSuccess('Category updated');
    modifyReset();
    setShowForm(null);
  }
  if(isDeleteSuccess){
    setSuccess('Category deleted');
    deleteReset();
    setShowForm(null);
  }

  return (
  <>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Categories
      </h1>
      <button
        onClick={() => {
          setEditingCategory(null);
          setShowForm(true);
        }}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        Add Category
      </button>
    </div>

    {isLoading ? (
      <Spinner />
    ) : (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.category_id}
                className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                  {cat.name}
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                  {cat.description}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:underline text-sm dark:text-indigo-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmDelete(cat.category_id)}
                    className="text-red-600 hover:underline text-sm dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* Category Form Modal */}
    {showForm && (
      <CategoryForm
        category={editingCategory}
        onClose={() => setShowForm(false)}
        onSave={handleSave}
      />
    )}

    <ConfirmModal
      isOpen={confirmDelete}
      onClose={() => setConfirmDelete(false)}
      onConfirm={() => handleDelete(confirmDelete)}
      title="Delete Category"
      message="Are you sure you want to delete this category?"
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