import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  userColumns,
  skippersColumn,
  depColumns,
  userRows,
} from "../../datatablesource";
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

const UsersList = () => {
  const auth = useAuthUser();
  const classes = useStyles();
  const [user, setUser] = useState([]);
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

  const sliderRef = useRef(null);

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
      setUser(filteredResult);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
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
        let status = "";
        if (params.row.status == 2) {
          status = "Activate Account";
        } else {
          status = "Disable Account";
        }
        return (
          <div className="cellAction">
            <div
              className="updateButton"
              onClick={() => {
                // openPop()
                let url = "";
                if (params.row.status == 2) {
                  url = `${BASE_URL}/user/activateMentorAccount/${params.row.id}`;
                } else if (params.row.status == 1) {
                  url = `${BASE_URL}/user/disableMentorAccount/${params.row.id}`;
                }

                const status =
                  params.row.status === 1
                    ? "Disable Account"
                    : "Activate Account";
                fetch(url, {
                  method: "PUT",
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
                    toast.success("Account was successfully updated", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  })
                  .then((data) => {
                    axios
                      .get(`${BASE_URL}/user`, {
                        headers: {
                          Authorization: `Bearer ${auth().jwtToken}`,
                        },
                      })
                      .then((response) => {
                        setUser(response.data);
                        console.log(response.data);
                      });
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
              {status}
            </div>

            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/user/${params.row.id}`;
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
                    toast.success("User was successfully deleted", {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    axios
                      .get(`${BASE_URL}/user`, {
                        headers: {
                          Authorization: `Bearer ${auth().jwtToken}`,
                        },
                      })
                      .then((response) => {
                        setUser(response.data);
                        console.log(response.data);
                      });
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
            <h3>Users</h3>
          </div>

          <div className={classes.searchBox}>
            <form>
              <TextField
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Searching user"
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
        </div>
        <DataGrid
          className="datagrid"
          rows={
            search === ""
              ? user
              : user.filter(
                  (item) =>
                    item.firstName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    item.primaryPhone.includes(search)
                )
          }
          columns={skippersColumn.concat(actionColumns)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Documents</DialogTitle>
        <DialogContent>
          <Slider {...settings} ref={sliderRef} initialSlide={currentImage}>
            {images.map((image, index) => (
              <Grid container justifyContent="center" key={index}>
                <Grid item>
                  <img
                    src={image}
                    alt={`Image ${index}`}
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            ))}
          </Slider>
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
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            aria-label="next"
            onClick={nextImage}
            style={{
              color: "#333",
              padding: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersList;
