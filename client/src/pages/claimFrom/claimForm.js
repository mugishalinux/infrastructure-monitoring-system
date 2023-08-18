import React, { useState, useEffect } from "react";
import "./claimForm.css";
import logo from "./user.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../../config/baseUrl";
import { CircularProgress } from "@mui/material";
import { useSignIn } from "react-auth-kit";
import { TextField, MenuItem } from "@mui/material";

const ClaimForm = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const auth = () => {
    navigate("/home");
  };
  const backHome = () => {
    navigate("/");
  };
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [institution, setInstitution] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);
  const [key, setKey] = useState("");
  const [errors, setErrors] = useState({});
  if (success == true) {
    navigate("/home");
    localStorage.setItem("auth", key);
  }

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
  const fetchCells = async (sectorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/location/cell/${sectorId}`);
      setCells(response.data);
    } catch (error) {
      console.error("Error fetching cells:", error);
    }
  };
  const fetchVillages = async (cellId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/location/village/${cellId}`
      );
      setVillages(response.data);
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  console.log(key);

  const [phoneNumber, setPhoneNumber] = useState("");

  const [password, setPassWords] = useState("");

  const [loading, setLoading] = useState(false);

  const [token, setToken] = useState("");

  const [data, setData] = useState({
    description: "",
    institution: 0,
    image: "",
    province: 0,
    district: 0,
    sector: 0,
    cell: 0,
    village: 0,
  });

  const handleEmail = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePassword = (e) => {
    setPassWords(e.target.value);
  };

  const handleIn = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    if (name === "province") {
      setData({
        ...data,
        [name]: value,
        district: 0,
        sector: 0,
        cell: 0,
        village: 0,
      });
      fetchDistricts(value);
    } else if (name === "district") {
      setData({ ...data, [name]: value, sector: 0 });
      fetchSectors(value);
    } else if (name === "sector") {
      setData({ ...data, [name]: value, cell: 0 });
      fetchCells(value);
    } else if (name === "cell") {
      setData({ ...data, [name]: value, village: 0 });
      fetchVillages(value);
    }

    // Reset errors when user updates input
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
  };

  const submitClaim = async (e) => {
    setIsLoading(true); // Show the loader
    const newErrors = {};

    // Check for empty required fields
    if (data.description === "") {
      newErrors.description = true;
    }
    if (data.image === "") {
      newErrors.image = true;
    }
    if (data.institution === 0) {
      newErrors.institution = true;
    }
    if (data.province === 0) {
      newErrors.province = true;
    }
    // Check for other required fields...

    // If there are errors, set the state and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    }
    e.preventDefault();
    const image = await handleImageUpload(data.image);
    data.image = image;

    axios
      .post(`${BASE_URL}/claims/creation`, data)
      .then((response) => {
        if (response.status == 201) {
          setIsLoading(false); // Show the loader
          toast.success("Claim successfully reported", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => {
            navigate("/"); // Redirect to "/home" for non-admin
          }, 3000);
        }
      })
      .catch((error) => {
        let message = String(error.response.data.message);
        if (error.response.data.statusCode == 400) {
          toast.error(message, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading(false); // Show the loader
        }
      });
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <ToastContainer />
        <div className="login-page">
          <div className="login-header">
            <div className="login-item" style={{ padding: "30px" }}>
              <h4 style={{ marginTop: "20px", fontWeight: "bold" }}>
                Reporting Damage Form
              </h4>
            </div>
            <form onSubmit={submitClaim} className="form-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: " space-between",

                  padding: "10px",
                }}
              >
                <div
                  style={{
                    width: "80%" /* Adjust the width as needed */,

                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="form-input">
                    <textarea
                      required
                      type="description"
                      name="description"
                      value={data.description}
                      onChange={handleIn}
                      className=""
                      placeholder="enter descriptin of damage "
                    />
                  </div>

                  <label style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    please upload image proof damage
                  </label>
                  <div className="">
                    <input
                      accept=".jpg, .png"
                      onChange={(e) =>
                        handleIn({
                          target: {
                            name: "image",
                            value: e.target.files[0],
                          },
                        })
                      }
                      required
                      type="file"
                      name="image"
                      className=""
                      placeholder=""
                    />
                  </div>
                  <div className="form-input">
                    <TextField
                      required
                      select
                      style={{
                        width: "100%",
                      }}
                      name="institution"
                      value={data.institution}
                      onChange={handleIn}
                      variant="outlined"
                      error={errors.institution}
                      helperText={
                        errors.institution ? "This field is required" : ""
                      }
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
                </div>

                <div
                  style={{
                    width: "80%" /* Adjust the width as needed */,

                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="form-input">
                    <TextField
                      required
                      select
                      name="province"
                      value={data.province}
                      onChange={handleIn}
                      variant="outlined"
                      style={{ width: "100%" }}
                      error={errors.province}
                      helperText={
                        errors.province ? "This field is required" : ""
                      }
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

                  {data.province !== 0 && (
                    <div className="form-input">
                      <TextField
                        select
                        name="district"
                        value={data.district}
                        onChange={handleIn}
                        variant="outlined"
                        required
                        style={{ width: "100%" }}
                        error={errors.district}
                        helperText={
                          errors.district ? "This field is required" : ""
                        }
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

                  {data.district !== 0 && (
                    <div className="form-input">
                      <TextField
                        select
                        name="sector"
                        value={data.sector}
                        onChange={handleIn}
                        variant="outlined"
                        required
                        error={errors.sector}
                        helperText={
                          errors.sector ? "This field is required" : ""
                        }
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

                  {data.sector !== 0 && (
                    <div className="form-input">
                      <TextField
                        select
                        name="cell"
                        value={data.cell}
                        onChange={handleIn}
                        variant="outlined"
                        required
                        style={{ width: "100%" }}
                        error={errors.cell}
                        helperText={errors.cell ? "This field is required" : ""}
                      >
                        <MenuItem value={0} disabled>
                          Select your cell
                        </MenuItem>
                        {cells.map((cell) => (
                          <MenuItem key={cell.id} value={cell.id}>
                            {cell.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  )}

                  {data.cell !== 0 && (
                    <div className="form-input">
                      <TextField
                        select
                        name="village"
                        value={data.village}
                        onChange={handleIn}
                        variant="outlined"
                        required
                        style={{ width: "100%" }}
                        error={errors.village}
                        helperText={
                          errors.village ? "This field is required" : ""
                        }
                      >
                        <MenuItem value={0} disabled>
                          Select your village
                        </MenuItem>
                        {villages.map((village) => (
                          <MenuItem key={village.id} value={village.id}>
                            {village.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",

                  justifyContent: "center",
                }}
              >
                <div style={{ paddingBottom: "0px" }} className="form-input">
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
                    <button style={{ width: "200px" }} type="submit">
                      Submit{" "}
                    </button>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",

                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    width: "200px",
                    backgroundColor: "white",
                    border: "solid #00778b 2px",
                    color: " #00778b",
                    borderRadius: "5px",
                    height: "40px",
                    marginTop: "10px",
                  }}
                  onClick={backHome}
                >
                  Back Home
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimForm;
