import { UserCircleIcon } from '@heroicons/react/24/solid';
import User from '../types/userType';

interface Props {
    user: User | null;
}
const AdminHeader = ({ user }: Props) => {
  return (
    <div className="headers flex justify-between items-center p-4 bg-gray-100 shadow-md">
        <div className="info flex-1">
            <input
                type="text"
                placeholder="Search..."
                className="search-bar px-4 py-2 w-full max-w-md rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        <div className="user flex items-center space-x-4">
            <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto" />
            <div className="user-details text-right">
                <h3 className="text-lg font-semibold">{user?.firstname} {user?.lastname}</h3>
                <p className="text-sm text-gray-500">{user?.role || "User"}</p>
            </div>
        </div>
    </div>
  )
}

export default AdminHeader