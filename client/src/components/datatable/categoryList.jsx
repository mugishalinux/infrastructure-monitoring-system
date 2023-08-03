import "./datatable.scss";
import "./newDoctor.scss";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { userColumns, categoryColumns, userRows } from "../../datatablesource";
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

const CategoryList = () => {
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
  const [categoryModalLoading, setCategoryModalLoading] = useState(false);
  const [updateModalLoading, setUpdateModalLoading] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const handleInputChange = (event) => {
    if (event.target.name === "locationName") {
      setLocationName(event.target.value);
    } else if (event.target.name === "locationImageOne") {
      const files = Array.from(event.target.files);
      setLocationImages(files);
    } else if (event.target.name === "categoryName") {
      setCategoryName(event.target.value);
    }
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
        .get(`${BASE_URL}/category`, {
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
    setCategoryModalOpen(false);
  };

  const handleCategoryModalSubmit = () => {
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
          .get(`${BASE_URL}/category`, {
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
          .get(`${BASE_URL}/category`, {
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
      .get(`${BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${auth().jwtToken}`,
        },
      })
      .then((response) => {
        setUser(response.data);
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
                setTempId(params.row.id);
                setCategoryName(params.row.cateogryName);
                setTempName(params.row.cateogryName);
                setLocationImages(params.row.locationImage);
                setModalOpen(true);
              }}
            >
              Update
            </div>

            <div
              className="deleteButton"
              onClick={() => {
                let url = `${BASE_URL}/category/${params.row.id}`;
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
                      .get(`${BASE_URL}/category`, {
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
            <h3>All Categories</h3>
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
              : user.filter((item) =>
                  item.cateogryName.toLowerCase().includes(search.toLowerCase())
                )
          }
          columns={categoryColumns.concat(actionColumns)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      </div>

      <div>
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="md"
        >
          <DialogTitle>Update Category</DialogTitle>
          <DialogContent>
            <form onSubmit={handleUpdateCategoryModalSubmit}>
              <TextField
                id="categoryName"
                name="categoryName"
                label="Category Name"
                variant="outlined"
                value={tempName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
                disabled={categoryModalLoading}
              >
                {categoryModalLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "update"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={categoryModalOpen}
          onClose={handleCategoryModalClose}
          maxWidth="md"
        >
          <DialogTitle>Create Category</DialogTitle>
          <DialogContent>
            <form onSubmit={handleCategoryModalSubmit}>
              <TextField
                id="categoryName"
                name="categoryName"
                label="Category Name"
                variant="outlined"
                value={categoryName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "16px" }}
                disabled={categoryModalLoading}
              >
                {categoryModalLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                    alt={`Document ${index + 1}`}
                    style={{ height: 400, width: "auto" }}
                  />
                </Grid>
              </Grid>
            ))}
          </Slider>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={previousImage}
            disabled={currentImage === 0}
            style={{ color: "white" }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={nextImage}
            disabled={currentImage === images.length - 1}
            style={{ color: "white" }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={updateModalOpen}
        onClose={handleUpdateModalClose}
        maxWidth="md"
      >
        <DialogTitle>Update Category</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCategoryModalSubmit}>
            <TextField
              id="categoryName"
              name="categoryName"
              label="Category Name"
              variant="outlined"
              value={categoryName}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: "16px" }}
              disabled={updateModalLoading}
            >
              {updateModalLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Update"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CategoryList;
