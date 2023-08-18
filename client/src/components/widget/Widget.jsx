import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import DangerousIcon from "@mui/icons-material/Dangerous";
const Widget = ({ painter, type, amount }) => {
  let data;

  //temporary
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        path: "/payment",
        icon: (
          <ReportGmailerrorredIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "booking":
      data = {
        title: "All Claims",
        isMoney: false,
        link: "View all bookings",
        path: "/bookings",
        icon: (
          <ReportGmailerrorredIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "payments":
      data = {
        title: "All Claims Fixed",
        isMoney: false,
        link: "View all payments",
        path: "/payment",
        icon: (
          <DoneOutlineIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "boats":
      data = {
        title: "All Claims UnFixed",
        isMoney: false,
        link: "See details",
        path: "/boat",
        icon: (
          <DangerousIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div
      className="widget"
      style={{
        border: "",
        paddingBottom: "120px",
        backgroundColor: `${painter}`,
      }}
    >
      <div className="left">
        <span className="title">{data.title}</span>
        <span style={{ color: "white" }} className="counter">
          {data.isMoney && "$"} {amount}
        </span>
      </div>
      <div className="right" style={{ color: "white" }}>
        <span style={{ color: "white" }}>{data.icon}</span>
      </div>
    </div>
  );
};

export default Widget;
