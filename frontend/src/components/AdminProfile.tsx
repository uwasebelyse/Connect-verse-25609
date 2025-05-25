import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { RootStateType } from "../state/types";
import { useGetUserByEmailQuery } from "../state/users/usersApi";

const AdminProfile = () => {
  // Get the logged-in user's email from the Redux state
  const { token } = useSelector((state: RootStateType) => state.auth);
  const decodedToken: any = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userEmail = decodedToken?.sub;

  // Fetch user data using RTK Query
  const { data: user, isLoading, isError } = useGetUserByEmailQuery(
    { email: userEmail },
    { skip: !userEmail }
  );

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (isError || !user) {
    return <div className="text-center text-red-500">Failed to load user data.</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <UserCircleIcon className="w-24 h-24 text-gray-400" />
          <h1 className="text-xl font-semibold mt-4">
            {user.firstname} {user.lastname}
          </h1>
          {user.email && (
            <p className="text-gray-500">@{user.email}</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-700">Contact Info</h2>
          <p className="text-gray-600 mt-2">
            <span className="font-medium">Email:</span> {user.username || "N/A"}
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-700">Profile Details</h2>
          <p className="text-gray-600 mt-2">
            <span className="font-medium">Role:</span> {user.role || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;