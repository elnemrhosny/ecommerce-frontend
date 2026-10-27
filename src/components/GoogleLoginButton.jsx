import { GoogleLogin } from "@react-oauth/google";
export default function GoogleLoginButton({
  onSuccess,
  onError,
  className = "",
}) {
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;
  return (
    <div className={`flex min-h-11 justify-center ${className}`}>
      <GoogleLogin
        onSuccess={(response) =>
          response.credential ? onSuccess?.(response.credential) : onError?.()
        }
        onError={onError}
        theme="outline"
        shape="rectangular"
        text="continue_with"
        size="large"
      />
    </div>
  );
}
