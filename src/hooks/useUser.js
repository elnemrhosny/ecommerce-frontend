import API from "../assets/axios";
import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";

export function useUser(){
    const result = useQuery({
        queryKey : ['user'] , 
        queryFn : () => API.get('/users/auth').then(res => res.data)
    });
    return result;
}

export function useLogin( ){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (user) => API.post('/users/login' , user).then(res => res.data),
        onSuccess : (data) =>{
            queryClient.invalidateQueries({queryKey : ['cart']});
            queryClient.setQueryData(['user'] , data);
        }
    });
    return result;
}

export function useLoginGoogle( ){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : ({credential}) => API.post('/users/google' , {credential}).then(res => res.data),
        onSuccess : (data) =>{
            queryClient.invalidateQueries({queryKey : ['cart']});
            queryClient.setQueryData(['user'] , data);
        }
    });
    return result;
}

export function useLogout(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : () => API.post('/users/logout').then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['cart']})
            queryClient.setQueryData(['user'] , null);
        }
    });
    return result;
}

export function useChangeUsername(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.patch('/users/username' , query).then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries(['user']);
        }
    });
    return result;
}

export function useCheckUsername(query){
    const result = useQuery({
        queryKey : ['checkusername' , query?.name] , 
        queryFn : () => API.get(`/users/checkname/${query.name}`).then(res => res.data) , 
        enabled : !!query?.name && query.name.length > 0
    });
    return result;
}

export function useChangePassword(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.patch('/users/password' , query).then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['user']})
        }
    });
    return result;
}

export function useRegisterUser(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.post('/users/register' , query).then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['user']})
        }
    });
    return result;
}

export function useAddWishlist(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.post('/wishlists' , query).then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['products']}) , 
            queryClient.invalidateQueries({queryKey : ['wishlist']}) ,
            queryClient.invalidateQueries({queryKey : ['wishlistcount']})
        }
    });
    return result;
}

export function useDeleteWishlist(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.delete(`/wishlists/${query.product_id}`).then(res => res.data),
        onSuccess : (data) => {
            queryClient.invalidateQueries({queryKey : ['products']}) , 
            queryClient.invalidateQueries({queryKey : ['wishlist']}),
            queryClient.invalidateQueries({queryKey : ['wishlistcount']})
        }
    });
    return result;
}


export function useWishlist(offset , limit){
    const result = useQuery({
        queryKey : ['wishlist' , offset] , 
        queryFn : () => API.get(`/wishlists?offset=${offset}&limit=${limit}`).then(res => res.data)
    });
    return result;
}

export function useWishlistCount(){
    const result = useQuery({
        queryKey : ['wishlistcount' , 'wishlist'] , 
        queryFn : () => API.get(`/wishlists/count`).then(res => res.data)        
    });
    return result;
}

export function useSendVerificationToken(){
    const result = useMutation({
        mutationFn : () => API.post(`/users/resend-token`).then(res => res.data)        
    });
    return result;
};

export function useVerifyEmailToken(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.get(`/users/verify-email?token=${query?.token}`).then(res => res.data),
        onSuccess : () =>{
            queryClient.invalidateQueries({queryKey : ['user']});
        }       
    });
    return result;
};

