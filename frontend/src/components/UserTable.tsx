import React from "react";
import {
  useGetAllUsersQuery,
  useGetUserByEmailQuery,
} from "../state/users/usersApi";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { jwtDecode } from "jwt-decode";
import FollowersCard from "./FollowersCard";

const UserTable: React.FC = () => {
  const { token } = useSelector((state: RootStateType) => state.auth);
  const decodedToken: any = token ? jwtDecode(token) : null;
  const userEmail = decodedToken?.sub;

  const { data: allUsers = [], isLoading: isUsersLoading, isError: isUsersError } = useGetAllUsersQuery();
  const { data: currentUser, isLoading: isUserDataLoading, isError: isUserDataError } = useGetUserByEmailQuery(
    { email: userEmail },
    { skip: !userEmail }
  );

  if (isUsersLoading || isUserDataLoading) {
    return <p className="text-white">Loading...</p>;
  }

  if (isUsersError || isUserDataError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>Failed to load user data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">User List</h2>
      <div className="flex flex-col w-full gap-6 h-[calc(100lvh-100px)] pb-9 overflow-y-auto no-scrollbar">
        {allUsers.map((user) => (
          <FollowersCard
            key={user.id}
            user={user}
            currentUser={currentUser}
          />
        ))}
      </div>
    </div>
  );
};

export default UserTable;