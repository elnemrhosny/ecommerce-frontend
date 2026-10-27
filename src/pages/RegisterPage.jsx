import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useRegisterUser, useLoginGoogle } from "../hooks/useUser";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../functions/users";
import { getApiError, safeReturnPath } from "../functions/apiErrors";
import AuthLayout from "../components/AuthLayout";
import GoogleLoginButton from "../components/GoogleLoginButton";
import Icon from "../components/Icon";
export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const register = useRegisterUser();
  const google = useLoginGoogle();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(null);
  const from = safeReturnPath(location.state?.from);
  const pending = register.isPending || google.isPending;
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.name = values.name.trim();
    values.email = values.email.trim();
    const invalid = {};
    if (!validateName(values.name))
      invalid.name = "Use at least 3 characters for your name.";
    if (!validateEmail(values.email))
      invalid.email = "Enter a valid email address.";
    if (!validatePassword(values.password))
      invalid.password =
        "Use 8 or more characters with uppercase, lowercase, a number, and a symbol: @$!%*?&.";
    if (values.confirm_password !== values.password)
      invalid.confirm_password = "Your passwords do not match.";
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    try {
      await register.mutateAsync(values);
      setRegistered(values.email);
    } catch (err) {
      setError(
        getApiError(err, "Could not create your account. Please try again."),
      );
    }
  };
  if (user) return <Navigate to={from} replace />;
  if (registered)
    return (
      <AuthLayout
        eyebrow="You're on the list"
        title="Make yourself at home."
        description="Your account has been created. Check your inbox for a verification email, then sign in to get started."
      >
        <div
          role="status"
          className="mb-7 flex items-center gap-3 rounded-md soft-surface p-5 text-sm"
        >
          <Icon name="check" />
          Verification email sent to {registered}
        </div>
        <Link
          className="btn-primary w-full"
          to="/login"
          state={{ from, email: registered, registered: true }}
        >
          Continue to log in
          <Icon name="arrow" size={17} />
        </Link>
      </AuthLayout>
    );
  const fields = [
    ["name", "Your name", "text", "name", "Alex Morgan"],
    ["email", "Email address", "email", "email", "you@example.com"],
    ["password", "Password", "password", "new-password", "Create a password"],
    [
      "confirm_password",
      "Confirm password",
      "password",
      "new-password",
      "Repeat your password",
    ],
  ];
  return (
    <AuthLayout
      eyebrow="The beginning of a good thing"
      title="Join the everyday edit."
      description="Create your account. Keep your favourites close and your next find closer."
    >
      <form
        onSubmit={submit}
        className="space-y-4"
        aria-label="Create an account"
        noValidate
        aria-busy={pending}
      >
        {fields.map(([name, label, type, autocomplete, placeholder]) => (
          <div key={name}>
            <label className="field-label" htmlFor={`signup-${name}`}>
              {label}
            </label>
            <input
              id={`signup-${name}`}
              className="field"
              name={name}
              type={type}
              autoComplete={autocomplete}
              placeholder={placeholder}
              required
              disabled={pending}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name]
                  ? `error-${name}`
                  : name === "password"
                    ? "password-help"
                    : undefined
              }
            />
            {errors[name] && (
              <p
                id={`error-${name}`}
                className="mt-2 text-xs text-red-700 dark:text-red-300"
              >
                {errors[name]}
              </p>
            )}
            {name === "password" && !errors.password && (
              <p
                id="password-help"
                className="muted mt-2 text-[11px] leading-5"
              >
                8+ characters, uppercase, lowercase, a number and a symbol
                (@$!%*?&).
              </p>
            )}
          </div>
        ))}
        {error && (
          <p role="alert" className="inline-error">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={pending || isLoading}
        >
          {pending ? "Creating your account…" : "Create account"}
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
            onSuccess={async (credential) => {
              setError("");
              try {
                await google.mutateAsync({ credential });
              } catch (err) {
                setError(getApiError(err, "Google sign-in failed."));
              }
            }}
            onError={() =>
              setError("Google sign-in was not completed. Please try again.")
            }
          />
        </>
      )}
      <p className="muted mt-7 text-center text-xs">
        Already part of the edit?{" "}
        <Link className="text-link ml-1 text-xs" to="/login" state={{ from }}>
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
