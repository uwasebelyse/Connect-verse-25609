import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useFollowUserMutation, useGetFollowersQuery, useUnfollowUserMutation } from "../state/users/usersApi";

interface User {
    id: string;
    firstname: string;
    lastname: string;
    username?: string;
    email?: string;
}
interface FollowersCardProps {
  user: User;
  currentUser: User | undefined;
}

const FollowersCard: React.FC<FollowersCardProps> = ({
  user,
  currentUser,
}) => {

    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();

    const { data: followers = [], refetch } = useGetFollowersQuery(user?.id || "", {
        skip: !currentUser?.id,
    });

    const handleFollow = async (targetUserId: string) => {
        if (!currentUser) return;
        try {
            await followUser({ userId: currentUser.id, targetUserId }).unwrap();
            console.log(`Followed user with ID: ${targetUserId}`);
        } catch (error) {
            console.error("Failed to follow user:", error);
        }

        refetch(); // Refresh followers after following
    };

    const handleUnfollow = async (targetUserId: string) => {
        if (!currentUser) return;
        try {
            await unfollowUser({ userId: currentUser.id, targetUserId }).unwrap();
            console.log(`Unfollowed user with ID: ${targetUserId}`);
        } catch (error) {
            console.error("Failed to unfollow user:", error);
        }

        refetch(); // Refresh followers after unfollowing
    };

    const isFollowing = () => {
        const userId = currentUser?.id;
        return followers.some((follower) => follower.id === userId);
    };

  return (
    <div
      key={user.id}
      className="bg-gray-800 text-white p-4 rounded-lg shadow-md flex items-center w-full sm:w-auto"
    >
      <UserCircleIcon className="w-16 h-16 text-gray-400 mr-4" />
      <div className="flex-1">
        <h3 className="text-lg font-semibold">
          {user.firstname} {user.lastname}
        </h3>
        <p className="text-sm text-gray-400">{user.username || "N/A"}</p>
        {user.email && <p className="text-sm text-gray-400">@{user.email}</p>}
      </div>
      {currentUser?.id !== user.id && (
        <button
          onClick={() =>
            isFollowing() ? handleUnfollow(user.id) : handleFollow(user.id)
          }
          className={`ml-4 ${
            isFollowing()
              ? "bg-red-500 hover:bg-red-700"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          {isFollowing() ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default FollowersCard;