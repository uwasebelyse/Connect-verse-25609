import {
  FaceSmileIcon,
  MapPinIcon,
  PhotoIcon,
  VideoCameraIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Tweet } from "./index";
import "../styles/Tweet.css"
import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { useCreateTweetMutation, useGetTweetsQuery } from "../state/tweets/tweetsApi";

interface Like {
  id: number;
}

interface Tweet {
  tweet_id: number;
  message: string;
  imageUrl: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  likes: Like[];
  comments: Comment[];
}

const Tweets = () => {
  const navigate = useNavigate();
  const {isAuthenticated } = useSelector((state: RootStateType) => state.auth);
  const [tweetMessage, setTweetMessage] = useState("");
  
  // RTK Query hooks
  const { data: tweetsData, isLoading, error, refetch } = useGetTweetsQuery(undefined, {
    skip: !isAuthenticated
  });
  const [createTweet, { isLoading: isCreating }] = useCreateTweetMutation();

  const handleSaveTweet = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to tweet");
      navigate("/");
      return;
    }

    if (tweetMessage.trim() === "") {
      toast.warning("Please enter a message");
      return;
    }

    try {
      await createTweet({ message: tweetMessage }).unwrap();
      setTweetMessage("");
      toast.success("Tweet posted successfully!");
      refetch(); // Refresh tweets after posting
    } catch (error) {
      toast.error("Failed to post tweet");
      console.error("Error posting tweet:", error);
    }
  };

  console.log("Tweets data:", tweetsData);

  if (isLoading) {
    return (
      <div className="w-[58vw] flex items-center justify-center h-[70vh]">
        <div className="text-white text-xl">Loading tweets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[58vw] tweetcontainer flex items-center justify-center h-[70vh]">
        <div className="text-white text-xl">Error loading tweets</div>
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-right" richColors />
      <div className="tweetcontainer mt-4 bg-[#D9D9D9] bg-opacity-10 rounded-md w-[calc(100%-2rem)] p-2 px-4 mx-4">
        <div className="top flex gap-4 pb-6">
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
          <textarea 
            value={tweetMessage}
            onChange={(e) => setTweetMessage(e.target.value)}
            placeholder="What is happening?"
            className="bg-transparent outline-none  text-white w-full resize-none h-14 overflow-y-auto"
            disabled={isCreating}
            rows={3}
          />
        </div>
        <div className="bottom flex justify-between">
          <div className="icons flex gap-12">
            <PhotoIcon className="w-6 text-white group-hover:text-blue hover:text-blue-600 cursor-pointer" />
            <VideoCameraIcon className="w-6 text-white group-hover:text-blue hover:text-blue-600 cursor-pointer" />
            <MapPinIcon className="w-6 text-white group-hover:text-blue hover:text-blue-600 cursor-pointer" />
            <FaceSmileIcon className="w-6 text-white group-hover:text-blue hover:text-blue-600 cursor-pointer" />
          </div>
          <button 
            onClick={handleSaveTweet} 
            className="bg-blue-700 px-6 py-1 text-white rounded-3xl hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreating || !tweetMessage.trim()}
          >
            {isCreating ? "Posting..." : "Tweet"}
          </button>
        </div>
      </div>
      <div className="overflow-y-scroll h-[70vh] px-2 mx-2 pt-6">
        {tweetsData?.map((tweet) => (
          <Tweet 
            key={tweet.tweet_id}
            userImage={tweet.imageUrl} 
            message={tweet.message} 
            likesCount={tweet.likesCount} 
            commentsCount={tweet?.comments?.length} 
            tweetId={tweet.tweetId} 
            min={tweet.createdAt} 
            tweetReview={tweet} 
            likesUser={tweet.likes}
            refetchTweets={() => refetch()}
          />
        ))}
      </div>
    </div>
  );
};

export default Tweets;
