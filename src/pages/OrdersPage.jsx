// pages/OrdersPage.jsx
import { useState } from 'react';
import OrderCard from '../components/OrderCard';
import Spinner from '../components/Spinner';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../contexts/AuthContext';
import ErrorModal from '../components/ErrorModal';
import { useNavigate } from 'react-router-dom';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'past'
  const {data : orders = [] , isLoading , isError} = useOrders();
  const {user} = useAuth();

  const activeOrders = orders?.active || [];
  const pastOrders = orders?.past || [];

  
if(!user) return <ErrorModal isOpen={true} message="Please login to view your orders" onClose={() =>navigate('/') }/>
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        My Orders
      </h1>

      {/* Tab Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'active'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
          }`}
        >
          Active Orders
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'past'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
          }`}
        >
          Past Orders
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 dark:text-red-400">
          Something went wrong.
        </div>
      ) : activeTab === 'active' ? (
        activeOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            No active orders.
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <OrderCard key={order.order_id} order={order} />
            ))}
          </div>
        )
      ) : pastOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          No past orders.
        </div>
      ) : (
        <div className="space-y-4">
          {pastOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}