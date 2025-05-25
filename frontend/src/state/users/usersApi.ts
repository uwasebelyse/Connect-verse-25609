import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import url from '../../utils/api-client';
import { RootStateType } from '../types';
import { ReactNode } from 'react';

interface User {
  followingCount: number;
  followersCount: number;
  role: ReactNode;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  joinDate: string;
  profile?: {
    profileImageUrl: string;
    username: string;
    fullName: string;
    bio: string;
    location: string;
    gender: string;
  };
}

interface GetUserByEmailRequest {
  email: string;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootStateType;
      const token = state.auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => '/api/v1/user/all',
      providesTags: ['User'],
    }),
    getUserByEmail: builder.query<User, GetUserByEmailRequest>({
      query: ({ email }) => ({
        url: '/api/v1/user/getuserbyemail',
        method: 'POST',
        body: { email },
      }),
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/api/v1/user/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getFollowers: builder.query<User[], string>({
        query: (userId) => `/api/v1/follow/${userId}/followers`,
        providesTags: ['User'],
      }),
    followUser: builder.mutation<void, { userId: string; targetUserId: string }>({
      query: ({ userId, targetUserId }) => ({
        url: `/api/v1/user/${userId}/follow/${targetUserId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    unfollowUser: builder.mutation<void, { userId: string; targetUserId: string }>({
      query: ({ userId, targetUserId }) => ({
        url: `/api/v1/user/${userId}/unfollow/${targetUserId}`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
  useGetFollowersQuery,
  useDeleteUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = usersApi;