import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLogin, useLoginGoogle } from "../hooks/useUser";
import { getApiError, safeReturnPath } from "../functions/apiErrors";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Icon from "../components/Icon";
export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const login = useLogin();
  const google = useLoginGoogle();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const from = safeReturnPath(location.state?.from);
  const pending = login.isPending || google.isPending;
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await login.mutateAsync({
        email: data.get("email").trim(),
        password: data.get("password"),
      });
    } catch (err) {
      setError(
        getApiError(
          err,
          "Could not sign in. Please check your email and password.",
        ),
      );
    }
  };
  const googleLogin = async (credential) => {
    setError("");
    try {
      await google.mutateAsync({ credential });
    } catch (err) {
      setError(getApiError(err, "Google sign-in failed. Please try again."));
    }
  };
  if (user) return <Navigate to={from} replace />;
  return (
    <AuthLayout
      eyebrow="A space of your own"
      title="Welcome back."
      description="Sign in to see your favourites, follow your orders, and share your finds."
    >
      {location.state?.registered && (
        <p
          role="status"
          className="mb-5 rounded-md bg-indigo-50 p-4 text-sm text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
        >
          Your account is ready. Sign in, then check your email to verify your
          account.
        </p>
      )}
      <form
        onSubmit={submit}
        className="space-y-5"
        aria-label="Log in"
        aria-busy={pending}
      >
        <div>
          <label className="field-label" htmlFor="login-email">
            Email address
          </label>
          <input
            id="login-email"
            className="field"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={location.state?.email || ""}
            placeholder="you@example.com"
            disabled={pending}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="login-password">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              className="field pr-16"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={pending}
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-xs muted"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {error && (
          <p role="alert" className="inline-error">
            {error}
          </p>
        )}
        <button
          className="btn-primary w-full"
          type="submit"
          disabled={pending || isLoading}
        >
          {pending ? "Signing in…" : "Log in"}
          {!pending && <Icon name="arrow" size={17} />}
        </button>
      </form>
      {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
        <>
          <div className="my-6 flex items-center gap-4 text-[10px] uppercase tracking-widest muted">
            <span className="flex-1 border-t line-border" />
            or continue with
            <span className="flex-1 border-t line-border" />
          </div>
          <GoogleLoginButton
            onSuccess={googleLogin}
            onError={() =>
              setError("Google sign-in was not completed. Please try again.")
            }
          />
        </>
      )}
      <p className="muted mt-7 text-center text-xs">
        New around here?{" "}
        <Link className="text-link ml-1 text-xs" to="/signup" state={{ from }}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
