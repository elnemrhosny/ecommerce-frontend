import { useQuery , useQueryClient , useMutation } from "@tanstack/react-query";
import API from "../assets/axios";


export function useOrders(){
    const result = useQuery({
        queryKey : ['orders'] , 
        queryFn : () => API.get(`/orders`).then(res => res.data)
    });
    return result;
}

export function usePaymentStatus(order_id){
    const result = useQuery({
        queryKey : ['payment_status', order_id] , 
        queryFn : () => API.get(`/orders/payment_status?order_id=${order_id}`).then(res => res.data)
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



export function useAdminOrders(params){
    const result = useQuery({
        queryKey : ['admin_orders' , params?.toString()] , 
        queryFn : () => API.get(`/admin/orders?${params?.toString()}`).then(res => res.data)
    });
    return result;
}

export function useUpdateOrderStatus(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : ({order_id , status}) => API.patch(`/admin/orders/order_status` , {order_id ,order_status : status}).then(res => res.data),
        onSuccess : () => {
            queryClient.invalidateQueries(['admin_orders']);
            queryClient.invalidateQueries(['orders']);
        }
    });
    return result;
}
export function useUpdatePaymentStatus(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : ({order_id , status}) => API.patch(`/admin/orders/payment_status` , {order_id ,payment_status : status}).then(res => res.data),
        onSuccess : () => {
            queryClient.invalidateQueries(['admin_orders']);
            queryClient.invalidateQueries(['orders']);
        }
    });
    return result;
}