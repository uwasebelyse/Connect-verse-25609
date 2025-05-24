import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import url from '../../utils/api-client';
// import { RootStateType } from '../types';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  username: string;
}

interface VerificationRequest {
  email: string;
  code: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

interface AuthResponse {
  token: string;
  user: {
    role: string;
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
  };
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: url,
        prepareHeaders: (headers, { getState, endpoint }) => {
            // Add token to headers only for the '/me' endpoint
            if (endpoint === 'getCurrentUser') {
                const token = (getState() as any).auth?.token;
                if (token) {
                    headers.set('Authorization', `Bearer ${token}`);
                }
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/api/v1/auth/authenticate',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<AuthResponse, RegisterRequest>({
            query: (userData) => ({
                url: '/api/v1/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        verifyEmail: builder.mutation<{ message: string }, VerificationRequest>({
            query: (verificationData) => ({
                url: '/api/v1/auth/verify-email',
                method: 'POST',
                body: verificationData,
            }),
        }),
        sendVerificationCode: builder.mutation<{ message: string }, { email: string }>({
            query: (data) => ({
                url: '/api/v1/auth/send-verification',
                method: 'POST',
                body: data,
            }),
        }),
        forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
            query: (data) => ({
                url: '/api/v1/auth/forgot-password',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
            query: (data) => ({
                url: '/api/v1/auth/reset-password',
                method: 'POST',
                body: data,
            }),
        }),
        getCurrentUser: builder.query<AuthResponse['user'], void>({
            query: () => '/api/v1/auth/me',
        }),
    }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useSendVerificationCodeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCurrentUserQuery,
} = authApi; 