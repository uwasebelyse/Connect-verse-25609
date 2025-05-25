import {
  ArrowLongLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import {
  useGetUserByEmailQuery,
  useGetFollowersQuery,
} from "../state/users/usersApi";

const ProfileInfo = () => {
  const [selectedTab, setSelectedTab] = useState("Tweets");
  const navigate = useNavigate();

  // Get the logged-in user's email from the token in the Redux state
  const { token } = useSelector((state: RootStateType) => state.auth);
  const decodedToken: any = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userEmail = decodedToken?.sub;

  // Fetch user data using RTK Query
  const { data: userData, isLoading, isError } = useGetUserByEmailQuery(
    { email: userEmail },
    { skip: !userEmail }
  );

  // Fetch followers using RTK Query
  const { data: followers = [] } = useGetFollowersQuery(userData?.id || "", {
    skip: !userData?.id,
  });

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  const handleHomeClick = () => {
    navigate("/Home");
  };

  if (isLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (isError || !userData) {
    return <p className="text-red-500">Failed to load user data.</p>;
  }

  return (
    <div className="p-6 w-full bg-gray-900 text-white rounded-lg shadow-lg">
      {/* Header Section */}
      <div
        className="flex items-center gap-4 cursor-pointer hover:text-blue-400"
        onClick={handleHomeClick}
      >
        <ArrowLongLeftIcon className="w-6" />
        <p className="text-lg font-semibold">Home</p>
      </div>

      {/* Profile Section */}
      <div className="mt-6 flex flex-col items-center">
        <UserCircleIcon className="w-24 h-24 text-gray-400" />
        <h1 className="text-2xl font-bold mt-4">
          {userData.firstname} {userData.lastname}
        </h1>
        <p className="text-gray-400">@{userData.email}</p>
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg font-bold">{userData.followersCount || 0}</p>
            <p className="text-sm text-gray-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{userData.followingCount || 0}</p>
            <p className="text-sm text-gray-400">Following</p>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-6 text-center">
        <p className="text-gray-400">{userData.profile?.bio || "No bio available"}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <p>{userData.profile?.gender || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-gray-400" />
            <p>{userData.profile?.location || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <p>{userData.joinDate || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 border-b border-gray-700 flex justify-around">
        {["Tweets", "Replies", "Media", "Likes"].map((tab) => (
          <p
            key={tab}
            className={`cursor-pointer pb-2 ${
              selectedTab === tab ? "text-white border-b-2 border-blue-500" : "text-gray-400"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </p>
        ))}
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {selectedTab === "Tweets" && (
          <p className="text-gray-400">Displaying Tweets...</p>
        )}
        {selectedTab === "Replies" && (
          <p className="text-gray-400">Displaying Replies...</p>
        )}
        {selectedTab === "Media" && (
          <p className="text-gray-400">Displaying Media...</p>
        )}
        {selectedTab === "Likes" && (
          <p className="text-gray-400">Displaying Likes...</p>
        )}
      </div>

      {/* Followers Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Followers</h2>
        <div className="flex flex-wrap gap-4">
          {followers.map((follower) => (
            <div
              key={follower.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center gap-4"
            >
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div>
                <h3 className="text-lg font-semibold">
                  {follower.firstname} {follower.lastname}
                </h3>
                <p className="text-sm text-gray-400">@{follower.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
