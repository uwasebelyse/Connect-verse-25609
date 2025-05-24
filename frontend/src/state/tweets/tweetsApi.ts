import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootStateType } from "../types";
import url from "../../utils/api-client";

// Interfaces
interface Comment {
  id: number;
  content: string;
  createdAt: string;
}

interface Tweet {
  tweetId: number;
  tweet_id: number;
  message: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  likes: { id: number; userId: number }[];
  comments: Comment[];
  userId: number;
  username: string;
}

interface CreateTweetRequest {
  message: string;
}

// Initial 

// RTK Query API
export const tweetsApi = createApi({
  reducerPath: "tweetsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootStateType;
      const token = state.auth.token;
      if (token) {
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tweet", "Comment"],
  endpoints: (builder) => ({
    getTweets: builder.query<Tweet[], void>({
      query: () => "/api/v1/tweet/",
      providesTags: ["Tweet"],
    }),
    createTweet: builder.mutation<Tweet, CreateTweetRequest>({
      query: (body) => ({
        url: "/api/v1/tweet",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tweet"],
    }),
    deleteTweet: builder.mutation<void, number>({
      query: (tweetId) => ({
        url: `/api/v1/tweet/${tweetId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tweet"],
    }),
    likeTweet: builder.mutation<void, number>({
      query: (tweetId) => ({
        url: `/api/v1/tweet/${tweetId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Tweet"],
    }),
    unlikeTweet: builder.mutation<void, number>({
      query: (tweetId) => ({
        url: `/api/v1/tweet/${tweetId}/unlike`,
        method: "POST",
      }),
      invalidatesTags: ["Tweet"],
    }),
    getComments: builder.query<Comment[], number>({
      query: (userId) => `/api/v1/tweet/user/comments/${userId}`,
      providesTags: (_, __, tweetId) => [{ type: "Comment", id: tweetId }],
    }),
    addComment: builder.mutation<Comment, { tweetId: number; content: string }>({
      query: ({ tweetId, content }) => ({
        url: `/api/v1/tweet/${tweetId}/comment`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_, __, { tweetId }) => [{ type: "Comment", id: tweetId }],
    }),
  }),
});

// Export Hooks
export const {
  useGetTweetsQuery,
  useCreateTweetMutation,
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useUnlikeTweetMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
} = tweetsApi;