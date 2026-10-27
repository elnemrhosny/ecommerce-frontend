import { useEffect, useRef } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useVerifyEmailToken } from "../hooks/useUser";
import { getApiError } from "../functions/apiErrors";
import Icon from "../components/Icon";
import Spinner from "../components/Spinner";
export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { user, isLoading } = useAuth();
  const { mutate, isPending, isSuccess, isError, error } =
    useVerifyEmailToken();
  const attempted = useRef(null);
  useEffect(() => {
    if (user && token && attempted.current !== token) {
      attempted.current = token;
      mutate({ token });
    }
  }, [user, token, mutate]);
  if (isLoading) return <Spinner />;
  if (!user && token)
    return (
      <Navigate
        to="/login"
        state={{ from: `/verify-email?token=${encodeURIComponent(token)}` }}
        replace
      />
    );
  return (
    <div className="site-width py-16">
      <section className="mx-auto max-w-xl rounded-lg border line-border surface p-8 text-center sm:p-12">
        {isPending || Boolean(token && !isSuccess && !isError && user) ? (
          <>
            <Spinner />
            <p className="muted text-sm">Verifying your email…</p>
          </>
        ) : (
          <>
            <span className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-full soft-surface">
              <Icon name={isSuccess ? "check" : "close"} size={25} />
            </span>
            <p className="eyebrow mb-4">Your ShopName account</p>
            <h1 className="display-title text-4xl">
              {isSuccess ? "You’re all set." : "Let’s try that again."}
            </h1>
            <p className="muted my-6 text-sm leading-7">
              {isSuccess
                ? "Your email is verified. You can now place an order."
                : token
                  ? getApiError(
                      error,
                      "This verification link may have expired. Request a new one from your account.",
                    )
                  : "This link is missing a verification token. Request a new email from your account."}
            </p>
            <Link className="btn-primary" to={isSuccess ? "/" : "/profile"}>
              {isSuccess ? "Explore the collection" : "Go to my account"}
              <Icon name="arrow" size={16} />
            </Link>
          </>
        )}
      </section>
    </div>
  );
}
