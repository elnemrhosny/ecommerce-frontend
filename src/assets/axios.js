import axios from "axios";

const API = axios.create({
    baseURL : "ecommerce-backend-seven-wine.vercel.app" , 
    timeout : 10000 , 
    headers : {
        'Content-Type' : 'application/json' ,
        'Accept' : 'application/json'  , 
    } , 
    withCredentials : true
})

export default API;