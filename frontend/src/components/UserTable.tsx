import React from "react";
import { useGetAllUsersQuery, useGetUserByEmailQuery } from "../state/users/usersApi";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { jwtDecode } from "jwt-decode";

const UserTable: React.FC = () => {
  // Get the logged-in user's email from the token in the Redux state
  const { token } = useSelector((state: RootStateType) => state.auth);
  const decodedToken: any = token ? jwtDecode(token) : null;
  const userEmail = decodedToken?.sub;

  // Fetch all users using RTK Query
  const { data: allUsers = [], isLoading: isUsersLoading, isError: isUsersError } = useGetAllUsersQuery();

  // Fetch the logged-in user's data using RTK Query
  const { isLoading: isUserDataLoading, isError: isUserDataError } = useGetUserByEmailQuery(
    { email: userEmail },
    { skip: !userEmail } // Skip query if email is not available
  );

  const handleFollow = async (userId: string) => {
    console.log(`Follow user with ID: ${userId}`);
    // Add follow logic here if needed
  };

  if (isUsersLoading || isUserDataLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (isUsersError || isUserDataError) {
    return <p className="text-red-500">Failed to load user data.</p>;
  }

  return (
    <div className="w-full p-4">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4">Profile Image</th>
            <th className="py-2 px-4">Username</th>
            <th className="py-2 px-4">Full Name</th>
            <th className="py-2 px-4">Bio</th>
            <th className="py-2 px-4">Location</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4">
                <img
                  src={user.profile?.profileImageUrl || "https://via.placeholder.com/40"}
                  alt={user.profile?.username || "User"}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </td>
              <td className="py-2 px-4">{user.profile?.username || "N/A"}</td>
              <td className="py-2 px-4">{user.profile?.fullName || "N/A"}</td>
              <td className="py-2 px-4">{user.profile?.bio || "N/A"}</td>
              <td className="py-2 px-4">{user.profile?.location || "N/A"}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Follow
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
