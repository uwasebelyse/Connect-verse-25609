import React from "react";
import { useGetAllUsersQuery, useGetUserByEmailQuery } from "../state/users/usersApi";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { jwtDecode } from "jwt-decode";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const UserTable: React.FC = () => {
    const { token } = useSelector((state: RootStateType) => state.auth);
    const decodedToken: any = token ? jwtDecode(token) : null;
    const userEmail = decodedToken?.sub;

    const { data: allUsers = [], isLoading: isUsersLoading, isError: isUsersError } = useGetAllUsersQuery();
    const { isLoading: isUserDataLoading, isError: isUserDataError } = useGetUserByEmailQuery(
        { email: userEmail },
        { skip: !userEmail }
    );

    const handleFollow = async (userId: string) => {
        console.log(`Follow user with ID: ${userId}`);
    };

    const handleDelete = (userId: string) => {
        console.log(`Delete user with ID: ${userId}`);
        // Add delete logic here
    };

    if (isUsersLoading || isUserDataLoading) {
        return <p className="text-white">Loading...</p>;
    }

    if (isUsersError || isUserDataError) {
        return <p className="text-red-500">Failed to load user data.</p>;
    }

    return (
        <div className="w-full p-6 bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>
            <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
                <thead>
                    <tr className="bg-gray-700">
                        <th className="py-3 px-4 text-left border-b border-gray-600">Profile</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600">Username</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600">Full Name</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600">Email</th>
                        <th className="py-3 px-4 text-left border-b border-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700">
                            <td className="py-3 px-4">
                                <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto" />
                            </td>
                            <td className="py-3 px-4">{user?.username || "N/A"}</td>
                            <td className="py-3 px-4">{user?.firstname || "N/A"}</td>
                            <td className="py-3 px-4">{user?.email || "N/A"}</td>
                            <td className="py-3 px-4 flex space-x-2">
                                <button
                                    onClick={() => handleFollow(user.id)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Follow
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
