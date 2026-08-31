export type Role='PARENT'|'DRIVER'|'ADMIN';
export type User={id:string;name:string;email:string;phone?:string;role:Role};
export type Vehicle={id:string;name:string;plate:string;driver?:{id:string;name:string;phone?:string}};
export type Student={id:string;name:string;pickupAddress:string;schoolName?:string;vehicle?:Vehicle|null};
export type TripStudentStatus='WAITING'|'ABSENT'|'ON_BOARD'|'AT_SCHOOL'|'DROPPED_OFF';
export type TripStudent={id:string;status:TripStudentStatus;sequence:number;student:Student};
export type Trip={id:string;status:string;serviceDate:string;currentLatitude?:number|null;currentLongitude?:number|null;locationUpdatedAt?:string|null;vehicle:Vehicle;students:TripStudent[]};
