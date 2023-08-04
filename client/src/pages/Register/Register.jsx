import React, { useEffect, useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../config/baseUrl";
import { TextField, CircularProgress, MenuItem } from "@mui/material";
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
    // ... (The rest of the code remains unchanged)
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
    institution: 0,
  });

  const [institution, setInstitution] = useState([]);

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

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/institution`);
        setInstitution(response.data);
      } catch (error) {
        console.error("Error fetching institution:", error);
      }
    };

    fetchInstitution();
  }, []);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setReg({ ...reg, [name]: value });
  };

  const validateDob = (value) => {
    // ... (The rest of the code remains unchanged)
  };

  const validatePhoneNumber = (value) => {
    // ... (The rest of the code remains unchanged)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      reg.firstName &&
      reg.lastName &&
      reg.phoneNumber &&
      reg.dob &&
      reg.password &&
      reg.institution
    ) {
      setIsLoading(true);

      try {
        const requestBody = {
          firstName: reg.firstName,
          lastName: reg.lastName,
          phoneNumber: reg.phoneNumber,
          dob: reg.dob,
          access_level: "string", // You can set the access level here
          password: reg.password,
          institution: reg.institution,
        };

        const response = await axios.post(
          `${BASE_URL}/user/createUser`,
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
      let errorMessage = "Please fill in all the required fields: ";
      let missingFields = [];

      if (!reg.firstName) {
        missingFields.push("First Name");
      }
      if (!reg.lastName) {
        missingFields.push("Last Name");
      }
      if (!reg.phoneNumber) {
        missingFields.push("Phone Number");
      }
      if (!reg.dob) {
        missingFields.push("Date of Birth");
      }
      if (!reg.password) {
        missingFields.push("Password");
      }
      if (!reg.institution) {
        missingFields.push("Institution");
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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="login-section">
      <ToastContainer />
      <div
        style={{ border: "", height: activeStep === 0 ? "500px" : "350px" }}
        className="login-page"
      >
        <div className="login-header">
          <Stepper activeStep={activeStep} alternativeLabel>
            <Step>
              <StepLabel>Step 1</StepLabel>
            </Step>
            <Step>
              <StepLabel>Step 2</StepLabel>
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
                  {activeStep !== 0 && (
                    <Button
                      style={{ marginTop: "10px", marginBottom: "20px" }}
                      variant="contained"
                      color="primary"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
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
            {activeStep === 1 && (
              <div>
                <div className="form-input">
                  <TextField
                    select
                    name="institution"
                    value={reg.institution}
                    onChange={handleInputs}
                    variant="outlined"
                    required
                    style={{ width: "100%" }}
                  >
                    <MenuItem value={0} disabled>
                      Select your institution
                    </MenuItem>
                    {institution.map((institution) => (
                      <MenuItem key={institution.id} value={institution.id}>
                        {institution.institutionName}
                      </MenuItem>
                    ))}
                  </TextField>
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
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
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
