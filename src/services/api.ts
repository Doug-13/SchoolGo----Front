import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/* ======================================================
   SCHOOLGO API CONFIG
====================================================== */

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    '[SchoolGo] EXPO_PUBLIC_API_URL não configurada. ' +
      'Usando Android Emulator: http://10.0.2.2:3000/api',
  );
}

/* ======================================================
   ENV
====================================================== */

export const ENV = {
  API_URL:
    apiUrl ??
    'http://10.0.2.2:3000/api',
};

/* ======================================================
   AXIOS INSTANCE
====================================================== */

export const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ======================================================
   REQUEST INTERCEPTOR
====================================================== */

api.interceptors.request.use(
  async config => {
    const token =
      await SecureStore.getItemAsync(
        'schoolgo_token',
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);