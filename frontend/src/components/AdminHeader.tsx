import { useState, useEffect, useRef } from "react";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { logout } from "../state/auth/authSlice";
import { useNavigate } from "react-router-dom";
import User from "../types/userType";

interface Props {
    user: User | null;
}

const AdminHeader = ({ user }: Props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="headers flex justify-between items-center px-4 bg-gray-100 shadow-md">
            <div className="info flex-1">
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar px-4 py-2 w-full max-w-md rounded-lg bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div
                className="user relative flex items-center space-x-4 cursor-pointer"
                onClick={toggleDropdown}
                ref={dropdownRef}
            >
                <UserCircleIcon className="w-10 h-10 text-gray-400 mx-auto" />
                <div className="user-details text-right">
                    <h3 className="text-lg font-semibold">{user?.firstname} {user?.lastname}</h3>
                    <p className="text-sm text-gray-500">{user?.role || "User"}</p>
                </div>
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                {dropdownOpen && (
                    <div className="absolute right-10 mt-56 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                        <ul className="py-2">
                            <li
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                onClick={() => navigate("/admin/profile")}
                            >
                                Profile
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                                onClick={() => navigate("/Home")}
                            >
                                User Dashboard
                            </li>
                            <li
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-red-400"
                                onClick={handleLogout}
                            >
                                Logout
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHeader;