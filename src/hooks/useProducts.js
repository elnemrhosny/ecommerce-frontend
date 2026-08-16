import API from "../assets/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useProducts(searchParams) {
  const result = useQuery({
    queryKey: ["products", searchParams?.toString()],
    enabled : !!searchParams,
    queryFn: () =>
      API.get(`/products?${searchParams?.toString()}`).then((res) => res.data),
  } , 
);
  return result;
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (query) =>
      API.post("/admin/products", query).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return result;
}

export function useModifyProduct() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (query) =>
      API.patch("/admin/products", query).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return result;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (query) =>
      API.delete(`/admin/products/${query.product_id}`).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return result;
}

export function useAddProductImages() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (query) =>
      API.post("/admin/product_images", query, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return result;
}
export function useDeleteProductImages() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: (query) =>
      API.delete(`/admin/product_images` , {data :  {image_ids :query.imagesToDelete}}).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  return result;
}
