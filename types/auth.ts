// types/auth.ts

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: string | null;
    mobile: string;
    email: string;
    verify: boolean;
    firstTime: boolean | null;
    birthdate: string | null;
    langCode: number;
    firebaseToken: string;
    userUuid: string;
}

export interface LoginResponse {
    data: {
        id: number;
        firstName: string;
        lastName: string;
        address: string | null;
        mobile: string;
        email: string;
        userOTP: string | null;
        verify: boolean;
        hasFirebaseToken: boolean;
        firebaseToken: string;
        userUuid: string;
        langCode: number;
        firstTime: boolean | null;
        birthdate: string | null;
        token: string | null;
    };
    success: boolean;
}

export interface CompleteDataRequest {
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    address: string;
    birthdate: string;
}

export interface CompleteDataResponse {
    data: string; // JWT token
    data2: {
        id: number;
        token: string;
        firstName: string;
        lastName: string;
        address: string;
        mobile: string;
        verify: boolean;
    };
    success: boolean;
}

export type AuthStep = 'login' | 'otp' | 'complete-profile';

export interface AuthState {
    step: AuthStep;
    userData: LoginResponse['data'] | null;
    loading: boolean;
    error: string | null;
}