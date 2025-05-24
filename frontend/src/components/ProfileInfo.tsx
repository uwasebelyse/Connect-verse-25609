import {
  ArrowLongLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import MenuLinks from "../utils/MenuLinks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditProfile } from "./index";
import { useGetUserByEmailQuery } from "../state/users/usersApi";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";

const ProfileInfo = () => {
  const [selectedTab, setSelectedTab] = useState("Tweets");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get the logged-in user's email from the token in the Redux state
  const { token } = useSelector((state: RootStateType) => state.auth);
  const decodedToken: any = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userEmail = decodedToken?.sub;

  // Fetch user data using RTK Query
  const { data: userData, isLoading, isError } = useGetUserByEmailQuery(
    { email: userEmail },
    { skip: !userEmail } // Skip query if email is not available
  );

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

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
    <>
      {modalOpen && (
        <EditProfile
          isOpen={modalOpen}
          onClose={handleModal}
          dataId={userData.id}
          imageUrl={userData.profile?.profileImageUrl || ""}
        >
          <p className="text-black"></p>
        </EditProfile>
      )}
      <div className="p-4 w-full">
        <div
          className="text-white flex gap-4 items-center hover:cursor-pointer hover:text-blue-400"
          onClick={handleHomeClick}
        >
          <ArrowLongLeftIcon className="w-6 text-white" />
          <p>{userData.username}</p>
        </div>
        <div className="pt-4 relative">
          <img
            src={userData.profile?.profileImageUrl}
            alt="Cover"
            className="w-full h-56 object-cover"
          />
          <img
            src={userData.profile?.profileImageUrl}
            alt="Profile"
            className="absolute top-32 w-44 h-44 rounded-full object-cover"
          />
          <button
            className="bg-blue-700 ml-[45vw] mt-4 px-6 py-1 text-white rounded-3xl"
            onClick={handleModal}
          >
            Edit Profile
          </button>
        </div>
        <div className="userBio text-white pt-10">
          <h1>{userData.profile?.fullName}</h1>
          <h1>{userData.profile?.username}</h1>
          <h1>
            Followers <span className="text-slate-300 pl-4">{userData.followersCount || 0}</span>
          </h1>
          <h1>
            Following <span className="text-slate-300 pl-4">{userData.followingCount || 0}</span>
          </h1>
          <div className="flex gap-12">
            <MenuLinks
              icon={UserIcon}
              text={userData.profile?.gender || "N/A"}
              route="/home"
            />
            <MenuLinks
              icon={MapPinIcon}
              text={userData.profile?.location || "N/A"}
              route="/home"
            />
            <MenuLinks
              icon={CalendarIcon}
              text={userData.joinDate || "N/A"}
              route="/home"
            />
          </div>
        </div>

        <div className="infomessage text-slate-300 border-b border-slate-600 flex justify-between mt-6">
          <p
            className={`cursor-pointer ${
              selectedTab === "Tweets" ? "text-white" : ""
            }`}
            onClick={() => handleTabClick("Tweets")}
          >
            Tweets
          </p>
          <p
            className={`cursor-pointer ${
              selectedTab === "Replies" ? "text-white" : ""
            }`}
            onClick={() => handleTabClick("Replies")}
          >
            Replies
          </p>
          <p
            className={`cursor-pointer ${
              selectedTab === "Media" ? "text-white" : ""
            }`}
            onClick={() => handleTabClick("Media")}
          >
            Media
          </p>
          <p
            className={`cursor-pointer ${
              selectedTab === "Likes" ? "text-white" : ""
            }`}
            onClick={() => handleTabClick("Likes")}
          >
            Likes
          </p>
        </div>
        <div className="content mt-6">
          {selectedTab === "Tweets" && (
            <div className="flex gap-2 text-slate-300">
              <p>Displaying Tweets</p>
            </div>
          )}
          {selectedTab === "Replies" && (
            <p className="text-white">Displaying Replies</p>
          )}
          {selectedTab === "Media" && (
            <p className="text-white">Displaying Media</p>
          )}
          {selectedTab === "Likes" && (
            <p className="text-white">Displaying Likes</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileInfo;
