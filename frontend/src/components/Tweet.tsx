/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import defaultAvatar from "../assets/client.jpg";
import {
  ArrowUpTrayIcon,
  ChartBarIcon,
  ChatBubbleBottomCenterIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Comment } from "./index";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import {
  useDeleteTweetMutation,
  useLikeTweetMutation,
  useUnlikeTweetMutation,
} from "../state/tweets/tweetsApi";
import { Toaster } from "sonner";
import { useGetAllUsersQuery, usersApi } from '../state/users/usersApi';

interface TweetProps {
  tweetId: number;
  userImage: string | null;
  message: string;
  likesCount: number;
  commentsCount: number;
  min: string;
  tweetReview: any;
  likesUser: any;
  refetchTweets: () => void;
}

const Tweet = ({
  tweetId,
  userImage,
  message,
  likesCount,
  commentsCount,
  min,
  tweetReview,
  likesUser,
  refetchTweets,
}: TweetProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state: RootStateType) => state.auth);
const { data: users } = useGetAllUsersQuery();

// Get the username from the users data using the userId
const username = users?.find((u) => u.id === tweetReview.userId)?.username || "User";

  // RTK Query mutations
  const [deleteTweet] = useDeleteTweetMutation();
  const [likeTweet] = useLikeTweetMutation();
  const [unlikeTweet] = useUnlikeTweetMutation();

  const handleDelete = async () => {
    try {
      await deleteTweet(tweetId).unwrap();
      refetchTweets();
    } catch (error) {
      console.error("Error deleting tweet:", error);
    }
  };

  const handleComment = () => {
    setModalOpen(!modalOpen);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${tweetReview.userId}`);
  };

  const convertToMin = (timestamp: string) => {
    const createdAtDate = new Date(timestamp);
    const currentTime = new Date();
    const timeDifferenceMillis = currentTime.getTime() - createdAtDate.getTime();
    const timeDifferenceMinutes = Math.floor(timeDifferenceMillis / (1000 * 60));

    if (timeDifferenceMinutes < 60) {
      return `${timeDifferenceMinutes}m`;
    } else if (timeDifferenceMinutes < 1440) {
      return `${Math.floor(timeDifferenceMinutes / 60)}h`;
    } else {
      return `${Math.floor(timeDifferenceMinutes / 1440)}d`;
    }
  };

  const handleLikeClick = async () => {
    try {
      const isLiked = likesUser.some((like: any) => like.userId === user?.id);

      if (isLiked) {
        await unlikeTweet(tweetId).unwrap();
      } else {
        await likeTweet(tweetId).unwrap();
      }
      refetchTweets();
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      {modalOpen && (
        <Comment
          isOpen={modalOpen}
          onClose={handleComment}
          userId ={tweetReview.userId}
          refId={tweetId}
          refetchTweets={refetchTweets} // Pass refetchTweets to Comment
        />
      )}
      <div className="tweetcontainer mt-4 border border-slate-700/50 rounded-xl w-[58vw] p-4 hover:bg-slate-800/30 transition-colors">
        <div className="top flex gap-4 pb-3 justify-between">
          <div className="flex items-center gap-3">
            <img
              src={userImage || defaultAvatar}
              alt="Profile"
              className="w-11 h-11 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={handleProfileClick}
            />
            <div className="flex flex-col">
              <p
                className="text-white font-medium cursor-pointer hover:underline"
                onClick={handleProfileClick}
              >
                {username}
              </p>
              <p className="text-gray-400 text-sm">{convertToMin(min)}</p>
            </div>
          </div>
          {user?.id === tweetReview.userId && (
            <TrashIcon
              className="w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
              onClick={handleDelete}
            />
          )}
        </div>
        <div className="message mb-4">
          <p className="text-white text-[15px] leading-relaxed">{message}</p>
        </div>
        <div className="bottom">
          <div className="icons flex justify-between max-w-[90%]">
            <button
              className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              onClick={handleComment}
            >
              <ChatBubbleBottomCenterIcon className="w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{commentsCount}</span>
            </button>

            <button className="group flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
              <ShareIcon className="w-5 group-hover:scale-110 transition-transform" />
            </button>

            <button
              className="group flex items-center gap-2 transition-colors"
              onClick={handleLikeClick}
            >
              <HeartIcon
                className={`w-5 group-hover:scale-110 transition-transform ${
                  likesUser?.some((like: any) => like.userId === user?.id)
                    ? "text-red-500"
                    : "text-gray-400 group-hover:text-red-400"
                }`}
              />
              <span className="text-sm text-gray-400 group-hover:text-red-400">
                {likesCount}
              </span>
            </button>

            <button className="group flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
              <ChartBarIcon className="w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">1432</span>
            </button>

            <button className="group flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
              <ArrowUpTrayIcon className="w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tweet;
