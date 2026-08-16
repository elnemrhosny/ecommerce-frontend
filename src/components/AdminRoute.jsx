// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

export default function AdminRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}