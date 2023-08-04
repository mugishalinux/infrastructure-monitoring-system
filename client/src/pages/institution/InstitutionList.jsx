import SkipperSidebar from "../../components/sidebar/SkipperSidebar";
import Navbar from "../../components/navbar/Navbar";
import InstitutionList from "../../components/datatable/InstitutionList";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

const BookingList = () => {
  return (
    <div className="list">
      <AdminSidebar />
      <div className="listContainer">
        <Navbar />
        <InstitutionList />
      </div>
    </div>
  );
};

export default BookingList;
