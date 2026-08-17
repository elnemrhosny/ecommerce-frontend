// pages/CartPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useDeleteItemCart, useModifyCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import Spinner from '../components/Spinner';
import { useSubmitOrder } from '../hooks/useOrders';
import { useAuth } from '../contexts/AuthContext';

export default function CartPage() {
  const {user} = useAuth();
  const {data : cart , isLoading , isError , errro} = useCart();
  const {mutate : modifyItem , isPending : isModifyPending , isError : isModifyError , error : modifyError , isSuccess : isModifySuccess , reset : modifyReset} = useModifyCart();
  const {mutate : deleteItem , isPending : isDeletePending , isError : isDeleteError , error : deleteError , isSuccess : isDeleteSuccess , reset : deleteReset} = useDeleteItemCart();
  const {mutate : submitOrder ,  isError : checkoutError , isSuccess : checkoutSuccess} = useSubmitOrder();
  const [error , setError] = useState(false);
  const handleCheckout = async () => {
      if(!user){
        setError('You have to be logged in to submit order');
        return;
      }
      if(!user.email_verified){
        setError('You have to verify your email to submit orders visit your profile page to verify your email');
        return;
      }
    try {
      submitOrder({} , {
        onSuccess : data => {
          console.log(data)
          window.location.href = data.redirectUrl;
        } , 
        onError : (err) => setError(err.response.data)
      });
  
    } catch (err) {
      setError('Checkout failed. Please try again.');
    } 
  };


  if (isLoading) {
    return (
      <Spinner/>
    );
  }


  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <Link to="/" className="mt-4 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
  <>
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Shopping Cart
      </h1>

      {/* Items */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.item_id}
            item={item}
            onUpdateQuantity={(query) => modifyItem(query)}
            onRemove={(query) => deleteItem(query)}
          />
        ))}
      </div>

      {/* Grand Total & Checkout */}
      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800 dark:shadow-gray-900/50">
        <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Total
          </span>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${Number(cart.total_price).toFixed(2)}
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/"
            className="rounded-lg border border-gray-200 px-6 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleCheckout}
            className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
    <ErrorModal isOpen={isModifyError} onClose={modifyReset} message='Quantity exceeded stock' />
    <ErrorModal isOpen={isDeleteError} onClose={deleteReset} message='Something went wrong' />
    <SuccessModal isOpen={isDeleteSuccess} onClose={deleteReset} message='Item deleted' />
        <ErrorModal isOpen={error} onClose={() => setError(false)} message={error}/>
  </>

);
}