import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";
import API from "../assets/axios";

export function useCategories(){
    const result =  useQuery({
        queryKey : ['categories'] , 
        queryFn : () => API.get('/categories').then(res => res.data) , 
        staleTime : 10 * 60 * 1000
    });
    return result
}

export function useAddCategory(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.post('/admin/categories' , query).then(res => res.data), 
        onSuccess : data =>{
            queryClient.invalidateQueries('categories')
        }
    })
    return result;
}

export function useModifyCategory(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.patch('/admin/categories' , query).then(res => res.data), 
        onSuccess : data =>{
            queryClient.invalidateQueries('categories')
        }
    })
    return result;
}

export function useDeleteCategory(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.delete(`/admin/categories/${query.category_id}`).then(res => res.data), 
        onSuccess : data =>{
            queryClient.invalidateQueries('categories')
        }
    })
    return result;
}

export function useAddCategoryImage(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.post(`/admin/category_image` , query , {
        headers: { "Content-Type": "multipart/form-data" },
      }).then(res => res.data), 
        onSuccess : data =>{
            queryClient.invalidateQueries('categories')
        }
    })
    return result;
}

export function useDeleteCategoryImage(){
    const queryClient = useQueryClient();
    const result = useMutation({
        mutationFn : (query) => API.delete(`/admin/category_image/${query.category_id}`).then(res => res.data), 
        onSuccess : data =>{
            queryClient.invalidateQueries('categories')
        }
    })
    return result;
}