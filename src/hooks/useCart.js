import API from "../assets/axios";
import { useQueryClient , useQuery , useMutation } from "@tanstack/react-query";

export function useCart(){
    const result = useQuery({
        queryKey : ['cart' , 'user'] , 
        queryFn : () => API.get('/carts').then(res => res.data)
    });
    return result;
}

export function useAddCart(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (product) => API.post('/carts' , product).then(res => res.data) ,
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['cart']})
        }
    })
    return result;
}

export function useModifyCart(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.patch('/carts' , query).then(res => res.data) ,
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['cart']})
        }
    })
    return result;
}

export function useDeleteItemCart(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.delete(`/carts/${query.item_id}`).then(res => res.data) ,
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['cart']})
        }
    })
    return result;
}