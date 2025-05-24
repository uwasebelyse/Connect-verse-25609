import { useEffect } from "react";
import { News } from "../components";
import Sidebar from "../components/Sidebar";
import Tweets from "../components/Tweets";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { Toaster, toast } from "sonner";
import { useGetUserByEmailQuery } from "../state/users/usersApi";
import { jwtDecode } from "jwt-decode";

const Home = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootStateType) => state.auth);
  const { isLoading, error } = useGetUserByEmailQuery(
    { email: user?.email || '' },
    { skip: !user?.email }
  );


  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken || !isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/");
      return;
    }

    const isTokenExpired = () => {
      try {
        const { exp } = jwtDecode(storedToken);
        if (!exp) return true;
        const currentTime = Date.now() / 1000;
        return exp < currentTime;
      } catch (error) {
        return true;
      }
    };

    if (isTokenExpired()) {
      toast.error("Session expired, please log in again");
      localStorage.removeItem('token');
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="bg-[#0E1225] h-screen w-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0E1225] h-screen w-screen flex items-center justify-center">
        <div className="text-white text-xl">Error loading user data</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0E1225] h-screen w-screen flex p-0 m-0">
      <Toaster position="top-right" richColors />
      <Sidebar />
      <div className="main"> 
        <Tweets />
      </div>
      <div className="right">
        <News />
      </div>
    </div>
  );
};

export default Home;
