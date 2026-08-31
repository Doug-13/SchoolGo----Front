import * as Location from 'expo-location';
import { api } from './api';
let subscription: Location.LocationSubscription | null=null;
export async function startTripLocation(tripId:string){
 const permission=await Location.requestForegroundPermissionsAsync();
 if(permission.status!=='granted') throw new Error('Permissão de localização negada');
 subscription?.remove();
 subscription=await Location.watchPositionAsync({accuracy:Location.Accuracy.High,distanceInterval:20,timeInterval:10000},async loc=>{
   try{await api.patch(`/trips/${tripId}/location`,{latitude:loc.coords.latitude,longitude:loc.coords.longitude});}catch(e){console.log('Falha ao enviar localização',e);}
 });
}
export function stopTripLocation(){subscription?.remove();subscription=null;}
