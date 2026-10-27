import API from "../assets/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function refreshAccountData(client) {
  for (const key of ["cart", "wishlist", "wishlistcount", "orders", "products"])
    client.invalidateQueries({ queryKey: [key] });
}
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return (await API.get("/users/auth")).data;
      } catch (error) {
        if (error.response?.status === 401) return null;
        throw error;
      }
    },
    retry: 1,
  });
}
export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) => (await API.post("/users/login", values)).data,
    onSuccess: (data) => {
      client.setQueryData(["user"], data);
      refreshAccountData(client);
    },
  });
}
export function useLoginGoogle() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) =>
      (await API.post("/users/google", values)).data,
    onSuccess: (data) => {
      client.setQueryData(["user"], data);
      refreshAccountData(client);
    },
  });
}
export function useLogout() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async () => (await API.post("/users/logout")).data,
    onSuccess: () => {
      client.setQueryData(["user"], null);
      for (const key of ["orders", "wishlist", "wishlistcount"])
        client.removeQueries({ queryKey: [key] });
      refreshAccountData(client);
    },
  });
}
export function useChangeUsername() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) =>
      (await API.patch("/users/username", values)).data,
    onSuccess: (data) => client.setQueryData(["user"], data),
  });
}
export function useCheckUsername(query) {
  return useQuery({
    queryKey: ["checkusername", query?.name],
    enabled: Boolean(query?.name && query.name.trim().length >= 3),
    queryFn: async () =>
      (await API.get(`/users/checkname/${encodeURIComponent(query.name)}`))
        .data,
  });
}
export function useChangePassword() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) =>
      (await API.patch("/users/password", values)).data,
    onSuccess: () => client.invalidateQueries({ queryKey: ["user"] }),
  });
}
export function useRegisterUser() {
  return useMutation({
    mutationFn: async (values) =>
      (await API.post("/users/register", values)).data,
  });
}
export function useAddWishlist() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) => (await API.post("/wishlists", values)).data,
    onSuccess: () => {
      for (const key of ["products", "wishlist", "wishlistcount"])
        client.invalidateQueries({ queryKey: [key] });
    },
  });
}
export function useDeleteWishlist() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) =>
      (await API.delete(`/wishlists/${values.product_id}`)).data,
    onSuccess: () => {
      for (const key of ["products", "wishlist", "wishlistcount"])
        client.invalidateQueries({ queryKey: [key] });
    },
  });
}
export function useWishlist(offset, limit, enabled = true) {
  return useQuery({
    queryKey: ["wishlist", offset, limit],
    enabled,
    queryFn: async () =>
      (await API.get("/wishlists", { params: { offset, limit } })).data,
  });
}
export function useWishlistCount(enabled = true) {
  return useQuery({
    queryKey: ["wishlistcount", "wishlist"],
    enabled,
    queryFn: async () => (await API.get("/wishlists/count")).data,
  });
}
export function useSendVerificationToken() {
  return useMutation({
    mutationFn: async () => (await API.post("/users/resend-token")).data,
  });
}
export function useVerifyEmailToken() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) =>
      (
        await API.get("/users/verify-email", {
          params: { token: values?.token },
        })
      ).data,
    onSuccess: () => client.invalidateQueries({ queryKey: ["user"] }),
  });
}
