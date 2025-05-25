import Sidebar from "../components/AdminSidebar";
import "../styles/Admin.css";
import PadLock from "../assets/Padlock.png";
import ellips from "../assets/Ellipsis.png";
import Email from "../assets/Email.png";
import project from "../assets/Project.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AreaChartComponent from "../components/AreaChart";
import { Toaster } from "sonner";
import AdminHeader from "../components/AdminHeader";
import { useGetAllUsersQuery } from "../state/users/usersApi";
import { useGetTweetsQuery } from "../state/tweets/tweetsApi";

const Admin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((state: any) => state.auth.user); // Assuming user data is in Redux state

  // Fetch all users and tweets using RTK Query
  const { data: allUsers = [], isLoading: isUsersLoading } = useGetAllUsersQuery();
  const { data: allTweets = [], isLoading: isTweetsLoading } = useGetTweetsQuery();

  if (isUsersLoading || isTweetsLoading) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="adminContainer">
      <Sidebar state={menuOpen} setState={setMenuOpen} />
      <Toaster position="top-right" richColors />
      <div className="w-full">
        <AdminHeader user={user} />
        <div className="cards">
          {/* Endpoints Card */}
          <div className="card user">
            <div className="row1">
              <div>
                <img src={PadLock} alt="Endpoints" />
                <p>Endpoints</p>
              </div>
              <div>
                <img src={ellips} alt="Options" />
              </div>
            </div>
            <div className="row2">
              <p>25</p>
              <Link to="/endpoints">View All</Link>
            </div>
          </div>

          {/* Users Card */}
          <div className="card user">
            <div className="row1">
              <div>
                <img src={Email} alt="Users" />
                <p>Users</p>
              </div>
              <div>
                <img src={ellips} alt="Options" />
              </div>
            </div>
            <div className="row2">
              <p className="cEmail">{allUsers.length}</p>
              <Link to="/Admin/Users">View All</Link>
            </div>
          </div>

          {/* Tweets Card */}
          <div className="card user">
            <div className="row1">
              <div>
                <img src={project} alt="Tweets" />
                <p>Tweets</p>
              </div>
              <div>
                <img src={ellips} alt="Options" />
              </div>
            </div>
            <div className="row2">
              <p>{allTweets.length}</p>
              <Link to="/tweets">View All</Link>
            </div>
          </div>
        </div>

        <div className="mobile">
          <h2>Income</h2>
          <p>10,000,000 RWF</p>
          <span>2-05-2024</span>
        </div>
        <div className="mt-12 h-96 w-full">
          <AreaChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Admin;
