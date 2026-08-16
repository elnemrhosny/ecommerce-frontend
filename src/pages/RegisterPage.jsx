// pages/RegisterPage.jsx
import { useState } from 'react';
import { Link  , useNavigate} from 'react-router-dom';
import { validateEmail, validateName, validatePassword } from '../functions/users';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import { useCheckUsername, useRegisterUser } from '../hooks/useUser';
import Spinner from '../components/Spinner';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const {user , loginWithGoogle} = useAuth();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const {isSuccess : isNameAvailable , isLoading : isNameAvailableLoading} = useCheckUsername(form);
  const {mutate : register , isPending} = useRegisterUser();

  // Basic validation flags
  const isEmailValid = validateEmail(form.email);
  const isPasswordValid = validatePassword(form.password);
  const isConfirmPasswordValid = form.confirm_password === form.password;
  const isUsernameValid = validateName(form.name); // adjust to actual availability logic later
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear messages when user types
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isUsernameValid) {
      setError('Please correct the highlighted fields.');
      setSuccess(false);
    } else {
      register(form , {
        onSuccess : () => {
            setSuccess('Registered successfully you can now login');
            setError(false);
        } , 
        onError : err => {
            if(err?.response?.status === 409){
              console.log(err.response.status);
                setSuccess(false);
                setError('This email already exists');
            }
        }
      })
      
    }
  };

  if(isPending) return (<Spinner/>)
  if(user) navigate('/');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">Create Account</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Join ShopName for a better shopping experience</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                !isUsernameValid
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500'
                  : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'
              }`}
              placeholder="Your username"
            />
            {!isUsernameValid ? (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Username must be at least 3 characters and available.
              </p>
            ) : 
            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              {isNameAvailableLoading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-gray-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-gray-500 dark:text-gray-400">Checking availability...</span>
                </>
              ) : isNameAvailable  ? (
                <>
                  <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 dark:text-green-400">Name is available</span>
                </>
              ) :  (
                <>
                  <svg className="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-600 dark:text-red-400">Name is already taken</span>
                </>
              ) }
              </div>
          }
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                !isEmailValid
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500'
                  : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'
              }`}
              placeholder="you@example.com"
            />
            {!isEmailValid && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Please enter a valid email address.
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                !isPasswordValid
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500'
                  : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'
              }`}
              placeholder="At least 8 characters, upper/lowercase, number, symbol"
            />
            {!isPasswordValid && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Must be at least 8 characters, include uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                !isConfirmPasswordValid
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500'
                  : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100'
              }`}
              placeholder="Re-enter your password"
            />
            {!isConfirmPasswordValid && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Register
          </button>
        </form>

        <div className="flex justify-center mt-4">
                              <GoogleLoginButton onSuccess={async (credential) =>{
                                await loginWithGoogle({credential})
                              }} onError={(err) => setGoogleError('Login with google failed')}/>
                              </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Login
          </Link>
        </p>
      </div>
        <ErrorModal isOpen={error} message={error} onClose={() => setError(false)}/>
        <SuccessModal isOpen={success} message={success} onClose={()=>setSuccess(false)}/>
    </div>
  );
}