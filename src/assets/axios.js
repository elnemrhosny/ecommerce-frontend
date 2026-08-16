import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost:8000" , 
    timeout : 10000 , 
    headers : {
        'Content-Type' : 'application/json' ,
        'Accept' : 'application/json'  , 
    } , 
    withCredentials : true
})

export default API;