import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  useChangeUsername,
  useChangePassword,
  useSendVerificationToken,
} from "../hooks/useUser";
import { validatePasswordChange, validateName } from "../functions/users";
import { getApiError } from "../functions/apiErrors";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";
export default function UserProfile() {
  const { user, isLoading } = useAuth();
  const changeName = useChangeUsername(),
    changePassword = useChangePassword(),
    sendVerification = useSendVerificationToken();
  const [notice, setNotice] = useState(""),
    [error, setError] = useState("");
  if (isLoading) return <Spinner />;
  if (!user)
    return <Navigate to="/login" state={{ from: "/profile" }} replace />;
  const begin = () => {
    setNotice("");
    setError("");
  };
  const updateName = async (event) => {
    event.preventDefault();
    begin();
    const name = new FormData(event.currentTarget).get("name").trim();
    if (!validateName(name)) {
      setError("Your name must contain at least 3 characters.");
      return;
    }
    try {
      await changeName.mutateAsync({ name });
      setNotice("Your name has been updated.");
    } catch (err) {
      setError(getApiError(err, "Could not update your name."));
    }
  };
  const updatePassword = async (event) => {
    event.preventDefault();
    begin();
    const form = event.currentTarget,
      values = Object.fromEntries(new FormData(form)),
      validation = validatePasswordChange(values);
    if (!validation.valid) {
      setError(
        "Use 8+ characters with uppercase, lowercase, a number and a symbol (@$!%*?&).",
      );
      return;
    }
    if (!validation.match) {
      setError("Your new passwords do not match.");
      return;
    }
    try {
      await changePassword.mutateAsync(values);
      form.reset();
      setNotice("Your password has been changed.");
    } catch (err) {
      setError(getApiError(err, "Could not change your password."));
    }
  };
  const verify = async () => {
    begin();
    try {
      await sendVerification.mutateAsync();
      setNotice("A verification link has been sent. Please check your inbox.");
    } catch (err) {
      setError(getApiError(err, "Could not send a verification email."));
    }
  };
  return (
    <div className="site-width py-10 sm:py-14">
      <p className="eyebrow mb-4">Make yourself at home</p>
      <h1 className="display-title text-5xl sm:text-6xl">Your space.</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[230px_1fr] lg:gap-16">
        <aside>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full soft-surface font-display text-xl">
              {user.name?.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="muted mt-1 text-[11px]">Your ShopName account</p>
            </div>
          </div>
          <nav
            aria-label="Account navigation"
            className="flex flex-col gap-4 border-t line-border pt-6 text-sm"
          >
            <Link className="font-medium" to="/profile">
              Account details
            </Link>
            <Link className="muted" to="/orders">
              My orders
            </Link>
            <Link className="muted" to="/wishlist">
              Saved favourites
            </Link>
            <Link className="muted" to="/cart">
              Shopping bag
            </Link>
            {user.role === "admin" && (
              <Link className="muted" to="/admin/products">
                Manage store
              </Link>
            )}
          </nav>
        </aside>
        <div className="max-w-3xl">
          {notice && (
            <p
              role="status"
              className="mb-6 rounded-md soft-surface p-4 text-sm"
            >
              {notice}
            </p>
          )}
          {error && (
            <p role="alert" className="inline-error mb-6">
              {error}
            </p>
          )}
          <section className="mb-8 rounded-lg border line-border surface p-6 sm:p-8">
            <h2 className="font-display text-3xl">The personal details.</h2>
            <p className="muted mb-6 mt-3 text-sm">
              A few things that make this account yours.
            </p>
            <form key={user.name} onSubmit={updateName} className="space-y-5">
              <div>
                <label htmlFor="account-name" className="field-label">
                  Your name
                </label>
                <input
                  id="account-name"
                  name="name"
                  defaultValue={user.name}
                  maxLength={50}
                  required
                  className="field"
                  disabled={changeName.isPending}
                />
              </div>
              <div>
                <label htmlFor="account-email" className="field-label">
                  Email address
                </label>
                <input
                  id="account-email"
                  className="field opacity-70"
                  type="email"
                  value={user.email}
                  readOnly
                />
                <p className="muted mt-2 text-[11px]">
                  Your email address is used to sign in.
                </p>
              </div>
              <button className="btn-primary" disabled={changeName.isPending}>
                {changeName.isPending ? "Saving…" : "Save details"}
                <Icon name="arrow" size={16} />
              </button>
            </form>
          </section>
          <section className="mb-8 rounded-lg border line-border surface p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-3xl">Email verification.</h2>
              {user.email_verified && (
                <Icon name="check" className="text-indigo-600" />
              )}
            </div>
            <p className="muted mt-3 text-sm leading-7">
              {user.email_verified
                ? "Your email is verified. You’re ready to check out."
                : "Verify your email before placing your first order. We’ll send a link to your inbox."}
            </p>
            {!user.email_verified && (
              <button
                className="btn-secondary mt-5"
                onClick={verify}
                disabled={sendVerification.isPending}
              >
                {sendVerification.isPending
                  ? "Sending…"
                  : "Send verification email"}
              </button>
            )}
          </section>
          <section className="rounded-lg border line-border surface p-6 sm:p-8">
            <h2 className="font-display text-3xl">Keep it yours.</h2>
            {user.auth_provider === "google" ? (
              <p className="muted mt-3 text-sm leading-7">
                You sign in with Google. Manage your password in your Google
                account.
              </p>
            ) : (
              <form onSubmit={updatePassword} className="mt-6 space-y-5">
                {[
                  ["password", "Current password", "current-password"],
                  ["new_password", "New password", "new-password"],
                  ["confirm_password", "Confirm new password", "new-password"],
                ].map(([name, label, autocomplete]) => (
                  <div key={name}>
                    <label className="field-label" htmlFor={`account-${name}`}>
                      {label}
                    </label>
                    <input
                      id={`account-${name}`}
                      name={name}
                      type="password"
                      autoComplete={autocomplete}
                      required
                      maxLength={128}
                      className="field"
                      disabled={changePassword.isPending}
                    />
                  </div>
                ))}
                <p className="muted text-[11px]">
                  Use 8+ characters, uppercase, lowercase, a number and a symbol
                  (@$!%*?&).
                </p>
                <button
                  className="btn-primary"
                  disabled={changePassword.isPending}
                >
                  {changePassword.isPending ? "Updating…" : "Update password"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
