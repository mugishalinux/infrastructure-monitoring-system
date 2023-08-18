import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import { useAuthUser } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/loader/FullScreenLoader";
import AdminSidebar from "../../components/sidebar/AdminSidebar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import SkipperSidebar from "../../components/sidebar/SkipperSidebar";
import { BASE_URL } from "../../config/baseUrl";

const Home = () => {
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalBoats, setTotalBoats] = useState(0);
  const [todayIncomes, setTodayIncomes] = useState(0);
  const [todayIncomesPer, setTodayIncomesPer] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [totalClaimsFixed, setTotalClaimsFixed] = useState(0);
  const [totalClaimsUnFixed, setTotalClaimsUnFixed] = useState(0);
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        // Fetch user information using auth()
        const userInformation = await auth();

        if (userInformation.access_level == "admin") {
          navigate("/user");
        }
        // Set the user object in component state
        setUser(userInformation);

        const totalClaims = await axios.get(
          `${BASE_URL}/report/countClaims/${auth().id}`
        );
        setTotalClaims(totalClaims.data);

        const totalClaimsFixed = await axios.get(
          `${BASE_URL}/report/count/claims/fixed/${auth().id}`
        );
        setTotalClaimsFixed(totalClaimsFixed.data);

        const totalClaimsUnFixed = await axios.get(
          `${BASE_URL}/report/count/claims/unfixed/${auth().id}`
        );
        setTotalClaimsUnFixed(totalClaimsUnFixed.data);

        const response = await axios.get(
          `${BASE_URL}/report/claims/per/location/${auth().id}`
        );

        setDatas(response.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false);
      }
    };

    fetchUserInformation();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }
  return (
    <div className="home">
      <AdminSidebar />
      <div className="homeContainer">
        <Navbar imageUrl={user.profile} style={{ marginBottom: "50px" }} />
        <div className="widgets">
          {/* <Widget type="booking" amount={totalBookings} /> */}
          <Widget painter="#1d88e5" type="booking" amount={totalClaims} />
          {/* <Widget type="payments" amount={totalAmount[0].total_amount} /> */}
          <Widget painter="#26c6da" type="payments" amount={totalClaimsFixed} />
          {/* <Widget type="boats" amount={totalBoats} /> */}
          <Widget painter="#ffb22b" type="boats" amount={totalClaimsUnFixed} />
        </div>
        <div className="charts">
          {/* <Featured todayIncome={todayIncomes} percentage={todayIncomesPer} /> */}
          <Featured todayIncome={todayIncomes} percentage={300} />
          {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} data={datas} /> */}
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} data={datas} />
        </div>
      </div>
    </div>
  );
};

export default Home;
