import { useGetAllUsersQuery, useDeleteUserMutation } from "../state/users/usersApi";
import { Toaster, toast } from "sonner";
import Sidebar from "../components/AdminSidebar";
import "../styles/Users.css";

const Users = () => {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

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
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4">
                  <img
                    src={user.profile?.profileImageUrl}
                    alt={user.profile?.username}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </td>
                <td className="py-2 px-4">{user.profile?.username}</td>
                <td className="py-2 px-4">{user.profile?.fullName}</td>
                <td className="py-2 px-4">{user.profile?.bio}</td>
                <td className="py-2 px-4">{user.profile?.location}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
