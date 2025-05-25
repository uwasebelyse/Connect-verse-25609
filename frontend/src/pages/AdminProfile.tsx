import { useGetAllUsersQuery } from "../state/users/usersApi";
import { Toaster, toast } from "sonner";
import Sidebar from "../components/AdminSidebar";
import "../styles/Users.css";
import { useEffect } from "react";
import AdminHeader from "../components/AdminHeader";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminProfile from "../components/AdminProfile";

const AdminProfilePage= () => {
    const { user, isAuthenticated } = useSelector((state: RootStateType) => state.auth);
    const { isLoading } = useGetAllUsersQuery();
    const navigate = useNavigate();


    useEffect(() => {
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
        return <div>Loading...</div>;
    }

    return (
        <div className="Container">
            <Toaster position="top-right" richColors />
            <Sidebar state={false} setState={() => {}} />
            <div className="w-full">
                <AdminHeader user={ user as any }/>
                <h1 className="text-4xl font-bold text-white  mt-4 mb-4 text-center tracking-wide">Admin Profile</h1>
                <AdminProfile />
            </div>
        </div>
    );
};

export default AdminProfilePage;
