import Home from "./pages/home/Home";
import Index from "./pages/HomeIndex/Index";
import Doctor from "./pages/Doctor/ListOfDoctors";
import Landing from "./pages/Landing/Landing";
import Register from "./pages/Register/Register";
// import FullScreenLoader "./components/loader/FullScreenLoader";
import Destination from "./pages/destinations/DestinationList";
import SchedulesList from "./pages/Schedules/Schedules";
import Appoint from "./pages/HomeIndex/Appoint";
import AppointmentList from "./pages/Appointment/AppointmentList";
import Login from "./pages/login/Login";
import NewDoctor from "./pages/New_doctor/NewDoctor";
import NewSchedule from "./pages/new_schedule/New";
import List from "./pages/List_Appointment/List";
import ListOfDoctors from "./pages/Doctor/ListOfDoctors";
import Single from "./pages/single/Single";
import New from "./pages/new_department/New";

import NewDestination from "./pages/new_destionation/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { RequireAuth } from "react-auth-kit";
import Skipper from "./pages/skippers/Skipper";
import Victim from "./pages/victim/Victim";
import InstitutionList from "./pages/institution/InstitutionList";
import Categories from "./pages/Locations/Categories";
import Boat from "./pages/Boat/Boat";
import NewBoat from "./pages/new_boat/New";
import LandingPage from "./pages/LandingPage/LandingPage";
import Payment from "./pages/payments/Payment";
import ClaimForm from "./pages/claimFrom/claimForm";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              path="home"
              element={
                <RequireAuth loginPath="/login">
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="institutions"
              element={
                <RequireAuth loginPath="/login">
                  <InstitutionList />
                </RequireAuth>
              }
            />

            <Route
              path="claims"
              element={
                <RequireAuth loginPath="/login">
                  <Payment />
                </RequireAuth>
              }
            />
            <Route
              path="bookings"
              element={
                <RequireAuth loginPath="/login">
                  {/* <BookingList /> */}
                </RequireAuth>
              }
            />
            {/* FullScreenLoader */}
            <Route index element={<LandingPage />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="claimForm" element={<ClaimForm />} />
            <Route path="appointment" element={<AppointmentList />} />
            <Route path="appoint" element={<Appoint />} />
            <Route
              path="user"
              element={
                <RequireAuth loginPath="/login">
                  <Skipper />
                </RequireAuth>
              }
            />
            <Route
              path="victims"
              element={
                <RequireAuth loginPath="/login">
                  <Victim />
                </RequireAuth>
              }
            />

            <Route path="categories">
              <Route
                index
                element={
                  <RequireAuth loginPath="/login">
                    <Categories />
                  </RequireAuth>
                }
              />

              <Route
                path=":locationId"
                element={
                  <RequireAuth loginPath="/login">
                    <Single />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
