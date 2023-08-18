import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useSignOut } from "react-auth-kit";
import { useContext, useState, useEffect } from "react";
import CategoryIcon from "@mui/icons-material/Category";
import GirlIcon from "@mui/icons-material/Girl";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReportIcon from "@mui/icons-material/Report";
import { useAuthUser } from "react-auth-kit";

const AdminSidebar = () => {
  const auth = useAuthUser();
  const signOut = useSignOut();
  const { dispatch } = useContext(DarkModeContext);
  const [isAdmin, setIsAdmin] = useState();
  const handleLogout = () => {
    signOut();
  };

  useEffect(() => {
    if (auth().access_level == "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  });
  return (
    <div className="sidebar">
      <div className="top">
        <div style={{ textDecoration: "none" }}>
          <span className="logo">Admin Portal</span>
        </div>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          {!isAdmin ? (
            <Link to="/home" style={{ textDecoration: "none" }}>
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>
              </li>
            </Link>
          ) : (
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          )}
          <p className="title">LISTS</p>
          {isAdmin && (
            <Link to="/user" style={{ textDecoration: "none" }}>
              <li>
                <PersonOutlineIcon className="icon" />
                <span>User</span>
              </li>
            </Link>
          )}
          {isAdmin && (
            <Link to="/institutions" style={{ textDecoration: "none" }}>
              <li>
                <AccountBalanceIcon className="icon" />
                <span>Institutions</span>
              </li>
            </Link>
          )}

          <Link to="/claims" style={{ textDecoration: "none" }}>
            <li>
              <ReportIcon className="icon" />
              <span>Claims</span>
            </li>
          </Link>

          <Link
            to="/"
            onClick={handleLogout}
            style={{ textDecoration: "none" }}
          >
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default AdminSidebar;
