import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
export const api=axios.create({baseURL:process.env.EXPO_PUBLIC_API_URL||'http://10.0.2.2:3000',timeout:12000});
api.interceptors.request.use(async config=>{const token=await SecureStore.getItemAsync('schoolgo_token');if(token) config.headers.Authorization=`Bearer ${token}`;return config;});
