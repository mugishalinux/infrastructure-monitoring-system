import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  userColumns,
  paymentColumn,
  claimColumns,
  depColumns,
  userRows,
} from "../../datatablesource";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Import the autoTable plugin
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loading } from "../../pages/Loading/Loading";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItem";
import { BASE_URL } from "../../config/baseUrl";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import {
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Divider,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useAuthUser } from "react-auth-kit";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { color, textAlign } from "@mui/system";
import ImageSlideshow from "./ImageSlideshow";

const useStyles = makeStyles((theme) => ({
  header: {
    height: "70px",
  },
  searchBox: {
    "& .MuiOutlinedInput-root": {
      border: "solid 1px gray",
      borderRadius: 5,
      height: 55,
      width: 600,
    },
  },
  menuItem: {
    borderBottom: `1px solid white`,
    backgroundColor: "white",
    "&:last-child": {
      borderBottom: `1px solid white`,
      backgroundColor: "white",
    },
    "&:first-child": {
      borderBottom: `1px solid white`,
      backgroundColor: "white",
    },
  },
  selectBox: {
    width: "200px",
  },
  middle: {
    height: "350px",
    backgroundColor: "#007ACC",
  },
  formControl: {
    backgroundColor: "#fff",
    // width:250,
    marginTop: 50,
    borderRadius: 5,
    textTransform: "capitalize",
  },
  container: {
    marginTop: 80,
  },
  title: {
    marginTop: 50,
    color: "#fff",
  },
  footer: {
    height: "50px",
    backgroundColor: "#535A6B",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    textTransform: "capitalize",
  },
}));

const PaymentList = () => {
  const auth = useAuthUser();
  const classes = useStyles();
  const [user, setUser] = useState([]);
  const [claim, setClaim] = useState([]);
  const [tempUsers, setTempUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [depName, setDepName] = useState("");
  const [rowValue, setRowValue] = useState({});
  const [requestLoad, setRequestLoad] = useState(false);
  const [requestDialog, setRequestDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [search, setSearch] = useState("");
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(user);
  const [tempId, setTempId] = useState([]);
  const [pictures, setPictures] = useState("");
  const [description, setDescription] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");
  const [isResolved, setIsResolved] = useState();
  const [institutionName, setInstitutionName] = useState();
  const [status, setStatus] = useState();
  const sliderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rowId, setRowId] = useState(0);

  const handleExportToPDF = () => {
    const doc = new jsPDF();

    // Define columns for the PDF table
    const columns = claimColumns.map((column) => column.headerName);

    // Prepare the rows for the PDF table
    const rows = claim.map((item) => {
      const rowData = [];
      claimColumns.forEach((column) => {
        const field = column.field;
        if (field) {
          rowData.push(item[field]);
        }
      });
      return rowData;
    });

    // Add a title
    doc.text("List Of All Claims", 105, 10, { align: "center" });

    // Add the table using autoTable
    doc.autoTable({
      head: [columns],
      body: rows,
    });

    // Save the PDF
    doc.save("claims_list.pdf");
  };

  //change status of claim
  const handleResolveClick = async () => {
    setIsLoading(true);

    const newStatus = !isResolved;
    const apiUrl = `${BASE_URL}/claims/update/claims/${newStatus}/${rowId}`;

    try {
      const response = await axios.put(apiUrl, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      });
      if (response.status === 200) {
        setIsResolved(newStatus);
        toast.success("Status was successfully change", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1900);
      }
    } catch (error) {
      console.error("Error updating claim status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const previousImage = () => {
    sliderRef.current.slickPrev();
  };

  const nextImage = () => {
    sliderRef.current.slickNext();
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (_, next) => setCurrentImage(next),
  };

  const handleRoleSelect = (event) => {
    const role = event.target.value;
    setSelectedRole(role);

    if (role === "") {
      setFilteredUsers(user);
    } else {
      const filteredResult = tempUsers.filter(
        (user) => user.access_level === role
      );
      setClaim(filteredResult);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/claims/list/fetch`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setClaim(response.data);
        setTempUsers(response.data);
        console.log(response.data);
      });
  }, []);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    // setRowValue({...rowValue, [rowValue.name]:value});
    setDepName(value);
    // console.log(depName)
  };

  const [data, setData] = useState(userRows);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const [searchText, setSearchText] = useState("");
  const [filteredUser, setFilteredUser] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filter the user based on the search text
    const filteredData = user.filter((item) => {
      // Check if any column value includes the search text
      return Object.values(item).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredUser(filteredData);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setFilteredUser(user);
  };

  const columns = [
    // Define your columns here
    // Modify or replace these with your actual columns
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    // Add more columns as needed
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              {/* <div className="viewButton">View</div> */}
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const actionColumns = [
    {
      field: "action",
      headerName: "Action",
      width: 330,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="updateButton"
              onClick={() => {
                setOpen(true);

                setRowId(params.row.id);
                setDescription(params.row.description);
                setPictures(params.row.images);
                setIsResolved(params.row.isResolved);
                setInstitutionName(params.row.institution.institutionName);
                setProvince(params.row.province.name);
                setDistrict(params.row.district.name);
                setSector(params.row.sector.name);
                setCell(params.row.cell.name);
                setVillage(params.row.village.name);
                setIsResolved(params.row.isResolved);
                if (params.row.isResolved == true) {
                  setStatus("fixed");
                } else {
                  setStatus("unfixed");
                }
              }}
            >
              View Details
            </div>

            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/claims/${params.row.id}`;
                fetch(url, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth().jwtToken}`,
                  },
                  body: JSON.stringify({
                    id: params.row.id,
                  }),
                })
                  .then((response) => {
                    response.json();
                    toast.success("Claim was successfully deleted", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    setTimeout(() => {
                      window.location.reload();
                    }, 1900);
                  })
                  .then((data) => {
                    // Handle response data here
                    console.log(data);
                  })
                  .catch((error) => {
                    let message = String(
                      error.response?.data?.message || error.message
                    );
                    // Handle error here
                    console.error(error);
                    toast.error(message, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  });
              }}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="datatable">
        <ToastContainer />
        <div style={{ marginBottom: "30px" }} className="upper-section-trip">
          <div className="title">
            <h3>Claims</h3>
          </div>

          <div className={classes.searchBox}>
            <form>
              <TextField
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Searching claim"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </div>
          <div>
            <button
              onClick={handleExportToPDF}
              style={{
                padding: "13px",
                width: "150px",
                borderRadius: "7px",
                marginLeft: "50px",
                backgroundColor: "#09143c",
                color: "white",
                border: "solid 1px #09143c",
              }}
            >
              Print
            </button>
          </div>
        </div>
        <DataGrid
          style={{ width: "95%", margin: "0 auto" }}
          className="datagrid"
          rows={claim.filter((item) => {
            const propertiesToFilter = [
              item.id,
              item.description,
              item.images,
              item.isResolved,
              item.status,
              item.institution.id,
              item.institution.institutionName,
              item.province.id,
              item.province.name,
              item.district.id,
              item.district.name,
              item.sector.id,
              item.sector.name,
              item.cell.id,
              item.cell.name,
              item.village.id,
              item.village.name,
            ];

            return propertiesToFilter.some((value) =>
              String(value).toLowerCase().includes(search.toLowerCase())
            );
          })}
          columns={claimColumns.concat(actionColumns)}
          pageSize={30}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <Dialog
        style={{ width: "1300px", height: "700px" }}
        open={open}
        onClose={handleCloseDialog}
        maxWidth="md"
      >
        <DialogTitle>Full details</DialogTitle>
        <DialogContent>
          <div>
            <h4>Damage Description</h4>
            <p
              style={{ color: "gray", padding: "100px;", textAlign: "justify" }}
            >
              {description}
            </p>
            <h4>Location</h4>
            <p style={{ color: "back", fontWeight: "bold" }}>
              province :
              <span style={{ marginLeft: "10px", color: "gray" }}>
                {province}
              </span>
            </p>
            <p style={{ color: "back", fontWeight: "bold" }}>
              district :
              <span style={{ marginLeft: "10px", color: "gray" }}>
                {district}
              </span>
            </p>
            <p style={{ color: "back", fontWeight: "bold" }}>
              sector :
              <span style={{ marginLeft: "10px", color: "gray" }}>
                {sector}
              </span>
            </p>
            <p style={{ color: "back", fontWeight: "bold" }}>
              cell :
              <span style={{ marginLeft: "10px", color: "gray" }}>{cell}</span>
            </p>
            <p style={{ color: "back", fontWeight: "bold" }}>
              village :
              <span style={{ marginLeft: "10px", color: "gray" }}>
                {village}
              </span>
            </p>

            <div style={{ display: "flex" }}>
              {" "}
              <div>
                {" "}
                <p style={{ color: "back", fontWeight: "bold" }}>
                  Claim Status :
                  <span style={{ marginLeft: "10px", color: "red" }}>
                    {status}
                  </span>
                </p>
              </div>{" "}
              <div
                style={{ marginLeft: "30px", marginBottom: "-210px" }}
                className="resolve-button"
              >
                <Button
                  onClick={handleResolveClick}
                  variant="contained"
                  color={isResolved ? "secondary" : "primary"}
                  startIcon={isResolved ? <CloseIcon /> : <CheckIcon />}
                  disabled={isLoading}
                >
                  {isResolved ? "Unfix" : "Fix"}
                </Button>
              </div>{" "}
            </div>

            <ImageSlideshow imageList={pictures} />
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <IconButton
            aria-label="previous"
            onClick={previousImage}
            style={{
              color: "#333",
              padding: "8px",
              backgroundColor: "#f5f5f5",
            }}
          ></IconButton>
          <IconButton
            aria-label="next"
            onClick={nextImage}
            style={{
              color: "#333",
              padding: "8px",
              backgroundColor: "#f5f5f5",
            }}
          ></IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentList;
