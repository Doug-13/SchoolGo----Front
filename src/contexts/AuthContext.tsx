import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import React,{createContext,useContext,useEffect,useState} from 'react';
import { api } from '../services/api'; import { Role,User } from '../types';
type AuthValue={user:User|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;register:(data:{name:string;email:string;password:string;role:Role})=>Promise<void>;logout:()=>Promise<void>};
const Ctx=createContext<AuthValue>({} as AuthValue);
export function AuthProvider({children}:{children:React.ReactNode}){
 const [user,setUser]=useState<User|null>(null); const [loading,setLoading]=useState(true);
 useEffect(()=>{(async()=>{const token=await SecureStore.getItemAsync('schoolgo_token');if(token){try{const {data}=await api.get('/users/me');setUser(data)}catch{await SecureStore.deleteItemAsync('schoolgo_token')}}setLoading(false)})()},[]);
 const save=async(data:any)=>{await SecureStore.setItemAsync('schoolgo_token',data.accessToken);setUser(data.user);router.replace(data.user.role==='DRIVER'?'/(driver)/home':'/(parent)/home')};
 const login=async(email:string,password:string)=>save((await api.post('/auth/login',{email,password})).data);
 const register=async(data:any)=>save((await api.post('/auth/register',data)).data);
 const logout=async()=>{await SecureStore.deleteItemAsync('schoolgo_token');setUser(null);router.replace('/(auth)/login')};
 return <Ctx.Provider value={{user,loading,login,register,logout}}>{children}</Ctx.Provider>;
}
export const useAuth=()=>useContext(Ctx);
