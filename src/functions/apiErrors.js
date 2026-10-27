export function getApiError(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT")
    return "The request took too long. Please try again.";
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (Array.isArray(data?.messages)) return data.messages.join(" ");
  return fallback;
}

export function safeReturnPath(path, fallback = "/") {
  return typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\") &&
    !/^\/(?:login|signup|register)(?:[/?#]|$)/.test(path)
    ? path
    : fallback;
}
