import {
  ArrowLeftEndOnRectangleIcon,
  BellIcon,
  ChatBubbleBottomCenterIcon,
  CheckBadgeIcon,
  EllipsisHorizontalCircleIcon,
  FireIcon,
  HomeIcon,
  QueueListIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import logo from "../assets/logo.png";
import MenuLinks from "../utils/MenuLinks";
// import username from "../assets/client.jpg";
import { logout } from "../state/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootStateType } from "../state/types";
import { useGetUserByEmailQuery } from "../state/users/usersApi";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootStateType) => state.auth);
  
  const { data: userData, isLoading } = useGetUserByEmailQuery(
    { email: user?.email || '' },
    { skip: !user?.email }
  );

  console.log(userData);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="sidebar flex justify-between flex-col p-3 w-[18vw] border-r border-slate-100 h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="sidebar flex justify-between flex-col p-3 w-[18vw] border-r border-slate-100 h-screen">
        <div className="logo">
          <img src={logo} alt="ConnectVerse Logo" className="w-36" />
        </div>
        <div className="links flex-col justify-between">
          <MenuLinks icon={HomeIcon} text="Home" route="/home" />
          <MenuLinks icon={FireIcon} text="Explore" route="/home" />
          <MenuLinks icon={BellIcon} text="Notifications" route="/home" />
          <MenuLinks
            icon={ChatBubbleBottomCenterIcon}
            text="Messages"
            route="/home"
          />
          <MenuLinks icon={QueueListIcon} text="Lists" route="/userslist" />
          <MenuLinks icon={UserPlusIcon} text="Communities" route="/home" />
          <MenuLinks icon={CheckBadgeIcon} text="Verified" route="/home" />
          <MenuLinks icon={UserCircleIcon} text="Profile" route="/profile" />
          <MenuLinks
            icon={EllipsisHorizontalCircleIcon}
            text="More"
            route="/home"
          />
        </div>
        <div className="profiles flex items-center justify-between">
          <div className="user flex">
            <UserCircleIcon className="w-12 h-12 text-gray-400" />
            <div className="info text-white pl-1">
              <h4>
                {userData?.firstname && userData?.lastname
                  ? `${userData.firstname} ${userData.lastname}`
                  : "User"}
              </h4>
              <p className="text-sm">
                {userData?.role ? userData.role : "User"}
              </p>
            </div>
          </div>
          <ArrowLeftEndOnRectangleIcon
            className="w-8 text-red-500 hover:cursor-pointer hover:text-red-600 transition-colors"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
