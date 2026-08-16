// pages/ProfilePage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useChangeUsername , useChangePassword, useCheckUsername, useSendVerificationToken } from '../hooks/useUser';
import { validatePasswordChange } from '../functions/users';
import ErrorModal from '../components/ErrorModal';
import SuccessModal from '../components/SuccessModal';
import Spinner from '../components/Spinner';
import EmailVerificationCard from '../components/EmailVerificationCard';

export default function UserProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const {mutate : changeUsername , isPending : isUsernamePending , isError : isUsernameError , reset : usernameReset} = useChangeUsername();
    const {mutate : changePassword , isPending : isPasswordPending , isError : isPasswordError , reset : passwordReset} = useChangePassword();
    const {mutate : sendVerificationToken , isPending : isVerificationPending } = useSendVerificationToken();
    // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password : '',
    new_password: '',
    confirm_password: '',
  });
  const [nameForm , setNameForm] = useState({name : ''})
  const {data : checkUsername , isSuccess : isNameAvailable , isLoading : isNameAvailableLoading} = useCheckUsername(nameForm);
  const [showNameModal , setShowNameModal] = useState(false);
  const [error , setError] = useState(false);
  const [success , setSuccess] = useState(false);


  const handleChangePassword = (e) => {
    e.preventDefault();
    const {valid , match} = validatePasswordChange(passwordForm);
    if(!valid) setError('Password has to be at least 8 characters with an upper case letter and a symbol');
    else if(!match) setError('Confirm password is not matching your new password');
    else{
      changePassword(passwordForm , {
        onSuccess : data => {
          setSuccess('Password changed') ;
          setShowPasswordModal(false);
        },
        onError :()=> setError('Your old password is incorrect')
      })
    }

  };

  const handleChangeName = (e) =>{
     e.preventDefault();
    if(String(nameForm.name).length < 3){
      setError('Username has to be more than 3 characters');
    }
    else{
      changeUsername(nameForm , {
        onSuccess : data => {
          setSuccess('Username changed');
          setShowNameModal(false);
        },
        onError : ()=>setError('Something went wrong please try again')
      });
    }
  }

  const handleVerifyEmail = e =>{
    e.preventDefault();
    try{
      sendVerificationToken(null , {
        onError : () => setError('Something went wrong please try again') , 
        onSuccess : () => setSuccess('Verification token has been sent please check your email')
      })
    }catch(err){
      setError('Something went wrong please try again');
      setSuccess(false);
    }
  }

  const navigateToCart = () => {navigate('/cart') };
  const navigateToOrders = () => { /* navigate to /orders */ };
  const navigateToWishlist = () => { navigate('/wishlist') };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
  <div className="max-w-4xl mx-auto px-4 py-12">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
      My Profile
    </h1>

    {/* Profile Card */}
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => setShowNameModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Change Name
        </button>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Change Password
        </button>
      </div>
    </div>

    {/* Quick Links */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <button
        onClick={navigateToCart}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition group"
      >
        <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-800 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Cart</span>
      </button>

      <button
        onClick={navigateToOrders}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition group"
      >
        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 group-hover:bg-green-100 dark:group-hover:bg-green-800 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Orders</span>
      </button>

      <button
        onClick={navigateToWishlist}
        className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition group"
      >
        <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900 text-pink-600 dark:text-pink-300 group-hover:bg-pink-100 dark:group-hover:bg-pink-800 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Wishlist</span>
      </button>
    </div>

    {/* Change Name Modal */}
    {isUsernamePending ? <Spinner/> :  showNameModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Change username</h2>

      <form onSubmit={handleChangeName} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New username</label>
          <input
            type="text"
            value={nameForm.name}
            onChange={(e) => setNameForm({ ...nameForm, name: e.target.value })}
            required
            className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Enter your new username"
          />

          {/* Availability feedback */}
          {nameForm?.name?.trim() && (
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
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setShowNameModal(false);
              setNameForm({ name: '' });
            }}
            className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isNameAvailable}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Name
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    {/* Password Change Modal */}
    {isPasswordPending ? <Spinner/> :  showPasswordModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Change Password</h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Old Password</label>
              <input
                type="password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters, include a number and an uppercase letter.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                required
                className="w-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ password: '', new_password: '', confirm_password: '' });
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
              onClick={handleChangePassword}
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    <EmailVerificationCard isEmailVerified={user.email_verified} onSendVerification={handleVerifyEmail} isSending={isVerificationPending}/>
    <ErrorModal isOpen={error} message={error} onClose={() => setError(false)}/>
    <SuccessModal isOpen={success} message={success} onClose={() => setSuccess(false)}/>
  </div>
);
}