import "./datatable.scss";
import "./newDoctor.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import {
  userColumns,
  victimColumns,
  categoryColumns,
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

const VictimList = () => {
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const sliderRef = useRef(null);
  const [locationName, setLocationName] = useState("");
  const [locationImages, setLocationImages] = useState([]);
  const [tempName, setTempName] = useState("");
  const [tempId, setTempId] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [updateVictimModalOpen, setUpdateVictimModalOpen] = useState(false);

  const [categoryModalLoading, setCategoryModalLoading] = useState(false);
  const [updateModalLoading, setUpdateModalLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [catId, setCatId] = useState(0);
  const [payload, setPayload] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    user: 0,
    category: 0,
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const categoryList = ["Category 1", "Category 2", "Category 3"]; // Replace with your actual category list
  //   const handleInputChange = (event) => {
  //     if (event.target.name === "locationName") {
  //       setLocationName(event.target.value);
  //     } else if (event.target.name === "locationImageOne") {
  //       const files = Array.from(event.target.files);
  //       setLocationImages(files);
  //     } else if (event.target.name === "categoryName") {
  //       setCategoryName(event.target.value);
  //     }
  //   };

  const handleInputChange = (event) => {
    if (event.target.name === "firstName") {
      setFirstName(event.target.value);
    } else if (event.target.name === "lastName") {
      setLastName(event.target.value);
    } else if (event.target.name === "dob") {
      setDob(event.target.value);
    } else if (event.target.name === "phoneNumber") {
      setPhoneNumber(event.target.value);
    } else if (event.target.name === "user") {
      setUser(event.target.value);
    } else if (event.target.name === "category") {
      setCatId(event.target.value);
    }
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthdateObj = new Date(birthdate);
    let age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthdateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFormUpdateVictimSubmit = (event) => {
    event.preventDefault();
    if (!firstName || !lastName || !dob || !phoneNumber || !user) {
      toast.error("Please fill in all the mandatory fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const age = calculateAge(dob);

    if (age > 21) {
      toast.error("Age must be less than or equal to 21.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    const data = {
      firstName,
      lastName,
      phoneNumber,
      dob,
      user: auth().id,
      category: catId,
    };

    axios
      .put(`${BASE_URL}/victim/${tempId}`, data, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        // Handle the response data
        // ...

        toast.success(response.data.message, {
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
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
            setTempUsers(response.data);
          });

        setUpdateModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        let message = String(error.response?.data?.message || error.message);

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

        axios
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
            setTempUsers(response.data);
          });
      });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!firstName || !lastName || !dob || !phoneNumber || !user) {
      toast.error("Please fill in all the mandatory fields.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const age = calculateAge(dob);

    if (age > 21) {
      toast.error("Age must be less than or equal to 21.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const data = {
      firstName,
      lastName,
      phoneNumber,
      dob,
      user: auth().id,
      category: catId,
    };

    axios
      .post(`${BASE_URL}/victim/creation`, data, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        // Handle the response data
        // ...

        toast.success(response.data.message, {
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
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
            setTempUsers(response.data);
          });
        setCategoryModalOpen(false);
      })
      .catch((error) => {
        let message = String(error.response?.data?.message || error.message);

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
        axios
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
            setTempUsers(response.data);
          });
      });
  };

  const handleUpdateModalOpen = (categoryId) => {
    const selectedCategory = user.find(
      (category) => category.id === categoryId
    );
    setTempId(categoryId);
    setCategoryName(selectedCategory.categoryName);
    setModalOpen(true); // Update the state variable name to setModalOpen
  };

  // ...

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setCategoryName("");
    setUpdateModalLoading(false);
  };

  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsRegistering(true); // Start the registration process

    let combinedImageUrls = "";

    if (locationImages.length > 0) {
      // Upload images to Cloudinary
      const uploadPromises = locationImages.map((image) => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CloudinaryCredentials.uploadPreset);

        return axios.post(
          `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloudName}/upload`,
          formData
        );
      });

      const cloudinaryResponses = await Promise.all(uploadPromises);

      // Get the image URLs from Cloudinary responses
      const imageUrls = cloudinaryResponses.map(
        (response) => response.data.secure_url
      );

      // Combine the image URLs into a comma-separated string
      combinedImageUrls = imageUrls.join(",");
    }

    // Create the location data object
    const locationData = {
      locationName,
      locationImage: combinedImageUrls,
    };

    try {
      // Submit location data to API endpoint only if images were uploaded
      await axios.put(`${BASE_URL}/location/${tempId}`, locationData, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      });

      // Display success toast notification
      toast.success("Location was successfully updated", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Fetch categories again to refresh the list
      axios
        .get(`${BASE_URL}/victim`, {
          headers: {
            Authorization: `Bearer ${auth().jwtToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
          setTempUsers(response.data);
        });

      setModalOpen(false); // Close the dialog modal
    } catch (error) {
      // Display error toast notification
      toast.error(`Location update failed, ${error}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setIsRegistering(false); // Registration process completed
  };

  const handleCategoryModalOpen = () => {
    setCategoryModalOpen(true);
  };

  const handleCategoryModalClose = () => {
    window.location.reload();
    setCategoryModalOpen(false);
  };

  const handleCategoryModalSubmit = (event) => {
    event.preventDefault();
    if (categoryName.trim() === "") {
      toast.error("Please provide a category name", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setCategoryModalLoading(true);

    axios
      .post(
        `${BASE_URL}/category/creation`,
        { categoryName: categoryName.trim() },
        {
          headers: {
            Authorization: `Bearer ${auth().jwtToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Category created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Fetch categories again to refresh the list
        axios
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
            setTempUsers(response.data);
          });
      })
      .catch((error) => {
        toast.error("Failed to create category", {
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
      .finally(() => {
        setCategoryModalOpen(false);
        setCategoryModalLoading(false);
        setCategoryName("");
      });
  };
  const handleUpdateCategoryModalSubmit = (event) => {
    event.preventDefault();

    if (categoryName.trim() === "") {
      toast.error("Please provide a category name", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setCategoryModalLoading(true);

    axios
      .put(
        `${BASE_URL}/category/${tempId}`,
        { categoryName: categoryName.trim() },
        {
          headers: {
            Authorization: `Bearer ${auth().jwtToken}`,
          },
        }
      )
      .then((response) => {
        toast.success("Category updated successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Fetch categories again to refresh the list
        axios
          .get(`${BASE_URL}/victim`, {
            headers: {
              Authorization: `Bearer ${auth().jwtToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
          });
      })
      .catch((error) => {
        toast.error("Failed to update category", {
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
      .finally(() => {
        setModalOpen(false);
        setCategoryModalLoading(false);
        setCategoryName("");
      });
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
      setUser(filteredResult);
    }
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/victim`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setTempUsers(response.data);
      });

    axios
      .get(`${BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setCategory(response.data);
        setTempUsers(response.data);
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
                setUpdateModalOpen(true);

                setFirstName(params.row.firstName);
                setLastName(params.row.lastName);
                setPhoneNumber(params.row.primaryPhone);
                setDob(params.row.dob);
                setCatId(params.row.category.id);
                setTempId(params.row.id);
              }}
            >
              Update
            </div>

            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/victim/${params.row.id}`;
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
                    toast.success("Category was successfully deleted", {
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
                      .get(`${BASE_URL}/victim`, {
                        headers: {
                          Authorization: `Bearer ${auth().jwtToken}`,
                        },
                      })
                      .then((response) => {
                        setUser(response.data);
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
            <h3>All Victims</h3>
          </div>

          <div className={classes.searchBox}>
            <form>
              <TextField
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Searching category"
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

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              marginLeft: "160px",
            }}
            className="btn-add"
          >
            <Button
              style={{ height: "50px" }}
              onClick={handleCategoryModalOpen}
              className="link-add"
            >
              Add New
            </Button>
          </div>
        </div>
        <DataGrid
          style={{ width: "" }}
          className="datagrid"
          rows={
            search === ""
              ? user
              : user.filter((item) => {
                  const firstName = item.firstName || "";
                  const lastName = item.lastName || "";
                  const dob = item.dob || "";
                  const primaryPhone = item.primaryPhone || "";
                  const categoryName = item.category
                    ? item.category.categoryName || ""
                    : "";

                  return (
                    firstName.toLowerCase().includes(search.toLowerCase()) ||
                    lastName.toLowerCase().includes(search.toLowerCase()) ||
                    dob.toLowerCase().includes(search.toLowerCase()) ||
                    primaryPhone.toLowerCase().includes(search.toLowerCase()) ||
                    categoryName.toLowerCase().includes(search.toLowerCase())
                  );
                })
          }
          columns={victimColumns.concat(actionColumns)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <div>
        <Dialog open={categoryModalOpen} onClose={handleCategoryModalClose}>
          <DialogTitle>Create Victim</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormSubmit}>
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginTop: "10px" }}
              />
              <TextField
                id="dob"
                name="dob"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dob}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginTop: "10px" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ marginTop: "10px" }}
              />

              <TextField
                select
                id="category"
                name="category"
                variant="outlined"
                value={catId}
                onChange={handleInputChange}
                fullWidth
                required
                style={{ width: "100%", marginTop: "10px" }}
              >
                <MenuItem value={0} disabled>
                  Select category
                </MenuItem>
                {category.map((category) => (
                  <MenuItem
                    style={{
                      border: "solid white 0px",
                      backgroundColor: "white",
                    }}
                    key={category.id}
                    value={category.id}
                  >
                    {category.cateogryName}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                style={{
                  marginTop: "16px",
                  marginLeft: "20px",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => setCategoryModalOpen(false)}
              >
                Close
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={updateModalOpen} onClose={handleCategoryModalClose}>
          <DialogTitle>Update Victim</DialogTitle>
          <DialogContent>
            <form onSubmit={handleFormUpdateVictimSubmit}>
              <TextField
                id="firstName"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                id="lastName"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={handleInputChange}
                fullWidth
                style={{ marginTop: "10px" }}
              />
              <TextField
                id="dob"
                name="dob"
                label="Date of Birth"
                type="date"
                variant="outlined"
                value={dob}
                onChange={handleInputChange}
                fullWidth
                style={{ marginTop: "10px" }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                variant="outlined"
                value={phoneNumber}
                onChange={handleInputChange}
                fullWidth
                style={{ marginTop: "10px" }}
              />

              <TextField
                select
                id="category"
                name="category"
                variant="outlined"
                value={catId}
                onChange={handleInputChange}
                fullWidth
                style={{ width: "100%", marginTop: "10px" }}
              >
                <MenuItem value={0} disabled>
                  Select category
                </MenuItem>
                {category.map((category) => (
                  <MenuItem
                    style={{
                      border: "solid white 0px",
                      backgroundColor: "white",
                    }}
                    key={category.id}
                    value={category.id}
                  >
                    {category.cateogryName}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                style={{
                  marginTop: "16px",
                  marginLeft: "20px",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => setUpdateModalOpen(false)}
              >
                Close
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default VictimList;
