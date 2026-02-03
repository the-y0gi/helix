
import  { axiosApi } from "@/lib/axios";
import { create } from "zustand";
interface AuthStates {
 isLoging: boolean,
  isSiging: boolean,
  currUser: null,
  testing:()=>{},
}
interface Login_signup_Data{
    email:string,
    password:string

}

export const useAuthStore = create<AuthStates>()((set, get) => ({
  isLoging: false,
  isSiging: false,
  currUser: null,

  userLogin:async(data:Login_signup_Data)=>{

    try {
        
    } catch (error) {
        
    }
  },
  userSignup:async (data:Login_signup_Data)=>{
    try {
        
    } catch (error) {
        
    }
  },
  testing:async ()=>{
    try {
      const res = await axiosApi.post('/testing', {name:"ram mohan laal"})
      console.log(res);
      
    } catch (error) {
      console.log(error);
      
    }
  }
  
}));
