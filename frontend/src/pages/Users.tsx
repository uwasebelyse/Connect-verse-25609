import { useGetAllUsersQuery, useDeleteUserMutation } from "../state/users/usersApi";
import { Toaster, toast } from "sonner";
import Sidebar from "../components/AdminSidebar";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import "../styles/Users.css";
import { useEffect, useState } from "react";
import AdminHeader from "../components/AdminHeader";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Users = () => {
    const { user, isAuthenticated } = useSelector((state: RootStateType) => state.auth);
    const { data: users, isLoading, error } = useGetAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 5;

    const handleDeleteUser = async (userId: string) => {
        try {
            await deleteUser(userId).unwrap();
        } catch (error) {
            toast.error("Failed to delete user");
        }finally {
            toast.success("User deleted successfully");
            setCurrentPage(1); // Reset to first page after deletion
        }
    };

    const filteredUsers = users?.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil((filteredUsers?.length || 0) / rowsPerPage);
    const paginatedUsers = filteredUsers?.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
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

    if (error) {
        return <div>Error loading users</div>;
    }

    return (
        <div className="Container">
            <Toaster position="top-right" richColors />
            <Sidebar state={false} setState={() => {}} />
            <div className="w-full p-4">
                <AdminHeader user={ user as any }/>
                <h1 className="text-4xl font-bold text-white  mt-4 mb-4 text-center tracking-wide">User Management</h1>
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-1/3"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-gray-800 text-white rounded-lg shadow-lg">
                        <thead>
                            <tr className="bg-gray-700 text-gray-300">
                                <th className="py-3 px-6 text-center">Profile Image</th>
                                <th className="py-3 px-6 text-center">Username</th>
                                <th className="py-3 px-6 text-center">Full Name</th>
                                <th className="py-3 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers?.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`${
                                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                    } hover:bg-gray-600`}
                                >
                                    <td className="py-3 px-6 text-center">
                                        <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto" />
                                    </td>
                                    <td className="py-3 px-6 text-center">{user?.username}</td>
                                    <td className="py-3 px-6 text-center">
                                        {user?.firstname} {user?.lastname}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`${
                                currentPage === index + 1
                                    ? "bg-blue-500"
                                    : "bg-gray-500 hover:bg-gray-700"
                            } text-white font-bold py-2 px-4 rounded mx-1`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Users;
