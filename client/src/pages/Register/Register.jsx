import React, { useState, useEffect } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../config/baseUrl";
import { TextField, CircularProgress, MenuItem } from "@mui/material";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel, Button } from "@material-ui/core";

const Register = () => {
  const CloudinaryCredentials = {
    cloudName: "ded6s1sof",
    uploadPreset: "pcq731ml",
    apiKey: "348193329193946",
    apiSecret: "lNTKKbJe9sf3AQb7sZqgftF9H5w",
  };

  const handleImageUpload = async (image) => {
    try {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CloudinaryCredentials.uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CloudinaryCredentials.cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Image upload failed");
    }
  };

  const navigate = useNavigate();
  const auth = () => {
    navigate("/home");
  };
  const register = () => {
    navigate("/register");
  };
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [reg, setReg] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    password: "",
    access_level: "mentor",
    profilePicture: null,
    province: 0,
    district: 0,
    sector: 0,
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/location/province`);
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/location/district/${provinceId}`
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchSectors = async (districtId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/location/sector/${districtId}`
      );
      setSectors(response.data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setReg({ ...reg, [name]: value });

    if (name === "province") {
      setReg({ ...reg, [name]: value, district: 0, sector: 0 });
      fetchDistricts(value);
    } else if (name === "district") {
      setReg({ ...reg, [name]: value, sector: 0 });
      fetchSectors(value);
    }
  };

  const validateDob = (value) => {
    const currentDate = new Date().toISOString().split("T")[0];
    return value <= currentDate
      ? undefined
      : "Date of birth cannot be in the future";
  };

  const validatePhoneNumber = (value) => {
    const phoneNumberRegex = /(2507[8,2,3,9])[0-9]{7}/;
    return phoneNumberRegex.test(value)
      ? undefined
      : "Phone number should match the pattern (2507[8,2,3,9])[0-9]{7}";
  };

  // Get the current date in the format YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Pad the month and day with leading zeros if needed
    month = month.toString().padStart(2, "0");
    day = day.toString().padStart(2, "0");

    return `${today.getFullYear()}-${month}-${day}`;
  };

  const handleNext = () => {
    const { firstName, lastName, phoneNumber, dob, password } = reg;

    if (firstName && lastName && phoneNumber && dob && password) {
      if (activeStep === 1) {
        setActiveStep(2);
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      let errorMessage = "Please fill in all the required fields: ";
      let missingFields = [];

      if (!firstName) {
        missingFields.push("First Name");
      }
      if (!lastName) {
        missingFields.push("Last Name");
      }
      if (!phoneNumber) {
        missingFields.push("Phone Number");
      }
      if (!dob) {
        missingFields.push("Date of Birth");
      }
      if (!password) {
        missingFields.push("Password");
      }

      errorMessage += missingFields.join(", ");

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reg.profilePicture && reg.province && reg.district && reg.sector) {
      setIsLoading(true);

      try {
        const profilePictureUrl = await handleImageUpload(reg.profilePicture);

        const requestBody = {
          firstName: reg.firstName,
          lastName: reg.lastName,
          phoneNumber: reg.phoneNumber,
          dob: reg.dob,
          password: reg.password,
          access_level: "mentor",
          profilePicture: profilePictureUrl,
          province: reg.province,
          district: reg.district,
          sector: reg.sector,
        };

        const response = await axios.post(
          `${BASE_URL}/user/createMentor`,
          requestBody
        );

        toast.success("Account was successfully created", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          setIsLoading(false);
          navigate("/");
        }, 3000);
      } catch (error) {
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

        setIsLoading(false);
      }
    } else {
      let errorMessage = "Please upload all the required files: ";
      let missingFields = [];

      if (!reg.profilePicture) {
        missingFields.push("Profile Picture");
      }
      if (!reg.province) {
        missingFields.push("Province");
      }
      if (!reg.district) {
        missingFields.push("District");
      }
      if (!reg.sector) {
        missingFields.push("Sector");
      }

      errorMessage += missingFields.join(", ");

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="login-section">
      <ToastContainer />
      <div style={{ border: "", height: "600px" }} className="login-page">
        <div className="login-header">
          <div className="login-item"></div>
          <div className="login-item">
            <h5 style={{ paddingTop: "50px" }}>Create Account</h5>
          </div>
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Step 1</StepLabel>
            </Step>
            <Step>
              <StepLabel>Step 2</StepLabel>
            </Step>
            <Step>
              <StepLabel>Step 3</StepLabel>
            </Step>
          </Stepper>
          <form className="form-group" onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <div>
                <div className="form-input">
                  <input
                    type="text"
                    name="firstName"
                    onChange={handleInputs}
                    value={reg.firstName}
                    className=""
                    placeholder="First Name"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    name="lastName"
                    onChange={handleInputs}
                    value={reg.lastName}
                    className=""
                    placeholder="Last Name"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="text"
                    name="phoneNumber"
                    onChange={handleInputs}
                    value={reg.phoneNumber}
                    className=""
                    placeholder="Phone"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="date"
                    name="dob"
                    onChange={handleInputs}
                    value={reg.dob}
                    className=""
                    placeholder="Date of Birth"
                    max={getCurrentDate()} // Set the max attribute to the current date
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div className="form-input">
                  <input
                    type="password"
                    name="password"
                    onChange={handleInputs}
                    value={reg.password}
                    className=""
                    placeholder="Password"
                    style={{ width: "100%" }}
                    required
                  />
                </div>
                <div style={{ paddingBottom: "30px" }} className="form-input">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {activeStep === 1 && (
              <div>
                <div className="form-inpu">
                  <label>Provide profile picture</label>
                  <input
                    type="file"
                    accept=".jpg, .png"
                    onChange={(e) =>
                      handleInputs({
                        target: {
                          name: "profilePicture",
                          value: e.target.files[0],
                        },
                      })
                    }
                    required
                  />
                </div>

                <div style={{ paddingBottom: "30px" }} className="form-input">
                  <Button
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    style={{
                      marginTop: "10px",
                      marginBottom: "20px",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {activeStep === 2 && (
              <div>
                <div className="form-input">
                  <TextField
                    select
                    name="province"
                    value={reg.province}
                    onChange={handleInputs}
                    variant="outlined"
                    required
                    style={{ width: "100%" }}
                  >
                    <MenuItem value={0} disabled>
                      Select your province
                    </MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province.id} value={province.id}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                {reg.province !== 0 && (
                  <div className="form-input">
                    <TextField
                      select
                      name="district"
                      value={reg.district}
                      onChange={handleInputs}
                      variant="outlined"
                      required
                      style={{ width: "100%" }}
                    >
                      <MenuItem value={0} disabled>
                        Select your district
                      </MenuItem>
                      {districts.map((district) => (
                        <MenuItem key={district.id} value={district.id}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
                {reg.district !== 0 && (
                  <div className="form-input">
                    <TextField
                      select
                      name="sector"
                      value={reg.sector}
                      onChange={handleInputs}
                      variant="outlined"
                      required
                      style={{ width: "100%" }}
                    >
                      <MenuItem value={0} disabled>
                        Select your sector
                      </MenuItem>
                      {sectors.map((sector) => (
                        <MenuItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                )}
                <div style={{ paddingBottom: "30px" }} className="form-input">
                  <Button
                    style={{ marginTop: "10px", marginBottom: "20px" }}
                    variant="contained"
                    color="primary"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  {isLoading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        backgroundColor: "#00778b",
                        border: "solid #00778b 2px",
                        color: "white",
                        borderRadius: "5px",
                        height: "40px",
                      }}
                    >
                      <CircularProgress
                        size={20}
                        style={{ marginRight: "10px", color: "white" }}
                      />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    <button type="submit">Create Account</button>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
