import { useState, useEffect } from "react";
import { News } from "../components";
import Sidebar from "../components/Sidebar";
import Tweets from "../components/Tweets";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { Toaster, toast } from "sonner";
import { useGetAllUsersQuery } from "../state/users/usersApi";
import FollowersCard from "../components/FollowersCard";

const Home = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state: RootStateType) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all users
    const { data: allUsers = [], isLoading: isUsersLoading } = useGetAllUsersQuery();

    // Filtered results
    const filteredUsers = allUsers.filter(
        (u) =>
            u.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (!storedToken || !isAuthenticated) {
            toast.error("Please log in to access this page");
            navigate("/");
            return;
        }
    }, [isAuthenticated, navigate]);

    if (isUsersLoading) {
        return (
            <div className="bg-[#0E1225] h-screen w-screen flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#0E1225] h-screen w-screen flex p-0 m-0">
            <Toaster position="top-right" richColors />
            <Sidebar />
            <div className="main flex flex-col w-full">
                {/* Shared Header */}
                <div className="header bg-[#1A1D2E] p-4 flex justify-between items-center">
                    <input
                        type="text"
                        placeholder="Search users."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#2A2E3E] outline-none text-white p-2 rounded-md w-1/2"
                    />
                    <div className="profile text-white flex items-center gap-4">
                        <div className="flex flex-col">
                            {user && <span>{user?.firstname} {user?.lastname}</span>}
                            {user && <span className="text-sm text-gray-400">{user?.role}</span>}
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                {searchQuery && (
                    <div className="absolute w-1/2 top-20 bg-[#1A1D2E] p-4">
                        <h2 className="text-white text-lg font-bold mb-4">Search Results</h2>
                        <div className="flex flex-col gap-4 h-[calc(80vh-200px)] overflow-y-auto">
                            {/* User Results */}
                            {filteredUsers.length > 0 ? (
                                <div>
                                    <div className="flex flex-wrap gap-4">
                                        {filteredUsers.map((user) => (
                                            <Link
                                                key={user.id}
                                                className="cursor-pointer w-full"
                                                to={`/profile?email=${user.username}`}
                                            >
                                                <FollowersCard user={user} currentUser={user} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">No results found.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Tweets and News Sections */}
                <div className="content flex flex-row w-full">
                    <div className="tweets-section flex flex-col w-[calc(100vw-39vw)]">
                        <Tweets />
                    </div>
                    <div className="news-section flex flex-col w-[21vw]">
                        <News />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
