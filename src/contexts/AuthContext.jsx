// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useLogin, useLogout, useLoginGoogle } from "../hooks/useUser";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: user, isLoading, isError, error } = useUser();
  const {
    mutate: login,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
    reset : resetLogin
  } = useLogin();
  const {
    mutate: logout,
    isPending: isLogoutPending,
    isError: isLogoutError,
    error: logoutError,
  } = useLogout();

  const {
    mutate : loginWithGoogle
  } = useLoginGoogle();
  // Check if user is logged in on initial load (via the cookie)

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isError,
        error,
        login,
        isLoginPending,
        isLoginError,
        loginError,
        loginWithGoogle ,
        resetLogin,
        logout,
        isLogoutPending,
        isLogoutError,
        logoutError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  // If context is undefined, return a default object to prevent errors
  if (context === undefined) {
    return {
      user: null,
      isLoading: false,
      isError: false,
      error: null,
      login: () => false,
      isLoginPending: false,
      isLoginError: false,
      loginError: null,
      resetLogin: () => {},
      logout: () => false,
      isLogoutPending: false,
      isLogoutError: false,
      logoutError: null,
    };
  }
  return context;
};
