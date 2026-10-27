import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../assets/axios";
export function useReviews(productId) {
  return useQuery({
    queryKey: ["reviews", productId],
    enabled: Boolean(productId),
    queryFn: async () => {
      const { data } = await API.get("/reviews/product", {
        params: { product_id: productId },
      });
      return Array.isArray(data) ? data : [];
    },
  });
}
export function useReviewMutation(productId, method) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      if (method === "delete")
        return (await API.delete(`/reviews/${values.review_id}`)).data;
      return (
        await API[method === "create" ? "post" : "patch"](
          "/reviews",
          method === "create" ? { ...values, product_id: productId } : values,
        )
      ).data;
    },
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["reviews", productId] }),
  });
}
