import { Stack } from 'expo-router'; import { StatusBar } from 'expo-status-bar'; import { AuthProvider } from '../src/contexts/AuthContext';
export default function Root(){return <AuthProvider><StatusBar style="dark"/><Stack screenOptions={{headerShown:false}}/></AuthProvider>}
