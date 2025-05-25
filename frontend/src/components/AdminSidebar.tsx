import Multiply from "../assets/Multiply.png";
import logo from "../assets/logo.png";
import layout from "../assets/layout-dashboard.png";
import member from "../assets/Member.png";
import logouts from "../assets/Logout Rounded.png";
import ctn from "../assets/ctn.png";
import "../styles/Admin.css";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../state/auth/authSlice";

const Sidebar = ({
    state,
    setState,
}: {
    state: boolean;
    setState: (value: boolean) => void;
}) => {
    const dispatch = useDispatch();
    const handleClose = () => {
        setState(!state);
    };

    return (
        <div className={state ? "sidebar active" : "sidebar"}>
            {/* Mobile Close Button */}
            <div className="mobile-nav" style={{ display: state ? "flex" : "none" }}>
                <img src={Multiply} alt="Close" onClick={handleClose} />
            </div>

            {/* Logo Section */}
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>

            {/* Navigation Links */}
            <div className="links">
                <NavLink
                    to="/Admin"
                    end
                    className={({ isActive }) => (isActive ? "link active" : "link")}
                >
                    <img src={layout} alt="Dashboard" />
                    <p>Dashboard</p>
                </NavLink>
                <NavLink
                    to="/Admin/Users"
                    className={({ isActive }) => (isActive ? "link active" : "link")}
                >
                    <img src={member} alt="Users" />
                    <p>Users</p>
                </NavLink>
                <NavLink
                    to="/login"
                    className={({ isActive }) => (isActive ? "link active logout" : "link logout")}
                    onClick={() => dispatch(logout())}
                >
                    <img src={logouts} alt="Logout" />
                    <p>Logout</p>
                </NavLink>
            </div>

            {/* Status Section */}
            <div className="logger">
                <img src={ctn} alt="Status" />
                <p>
                    <span className="px-4">0</span>Risk, all systems are <br />
                    operational
                </p>
            </div>
        </div>
    );
};

export default Sidebar;
