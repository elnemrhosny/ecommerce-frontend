import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import MainPage from "./pages/MainPage.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import {GoogleOAuthProvider} from '@react-oauth/google'
import CartPage from "./pages/CartPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminOrders from "./pages/admin/AdminOrders.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { QueryClient, QueryClientProvider , QueryCache , MutationCache } from "@tanstack/react-query";
import UserProfile from "./pages/UserProfile.jsx";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderStatusPage from "./pages/OrderStatusPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import Footer from "./components/Footer.jsx";

const queryClient = new QueryClient({
  queryCache : new QueryCache({
    onError : (err) => console.error('query error' , err) ,
  }) ,
  mutationCache : new MutationCache({
    onError : (err) => console.error('mutation error' , err)
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
    mutations: { 
    },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <><div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={googleClientId} >
        <AuthProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              </Route>
              <Route path="/" element={<MainPage />} />
              <Route path="/register" element = {<RegisterPage/>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/profile" element = {<UserProfile/>}/>
              <Route path="/wishlist" element = {<WishlistPage/>}/>
              <Route path = "/orders" element = {<OrdersPage/>} />
              <Route path="/order-status" element = {<OrderStatusPage/>}/>
              <Route path="/verify-email" element = {<VerifyEmailPage/>} />
            </Routes>
            <Footer/>
          </BrowserRouter>
          
        </AuthProvider>
        </GoogleOAuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
      </div>
      
    </>
  );
}

export default App;
