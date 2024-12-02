// src/helpers/types/authTypes.ts

export interface User {
    id: string;
    email: string;
    name?: string;
    // 
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  
  export interface RegisterResponse {
    token: string;
    user: User;
  }
  
  export interface MeResponse {
    user: User;
  }
  