import { useQuery , useQueryClient , useMutation } from "@tanstack/react-query";
import API from "../assets/axios";


export function useOrders(){
    const result = useQuery({
        queryKey : ['orders'] , 
        queryFn : () => API.get(`/orders`).then(res => res.data)
    });
    return result;
}

export function useSubmitOrder(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.post(`/checkout/create-session`).then(res => res.data),
    });
    return result;
}