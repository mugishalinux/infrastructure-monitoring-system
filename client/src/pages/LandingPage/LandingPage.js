import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthUser } from "react-auth-kit";
import "./design.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import { BASE_URL } from "../../config/baseUrl";

import { Card, CardContent, CardActionArea, Modal, Grid } from "@mui/material";

const drawerWidth = 240;
const navItems = ["Home", "Claiming", "Admin Login"];

const LandingPage = (props) => {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthUser();
  const navigate = useNavigate();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const openModal = (claim) => {
    setSelectedClaim(claim);
  };

  const closeModal = () => {
    setSelectedClaim(null);
  };
  const handleReportClaim = () => {
    navigate("/claimForm");
  };
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        setIsLoading(true);
        //fetch christians users
        const fetchClaiming = await axios.get(`${BASE_URL}/public`);
        setClaims(fetchClaiming.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
        setIsLoading(false);
      }
    };

    fetchUserInformation();
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />

      <List>
        <ListItem component={Link} to="/login">
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            IFCMS
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              onClick={() => {
                navigate("/");
              }}
              key={1}
              sx={{ color: "#fff" }}
            >
              Home
            </Button>
            <Button
              onClick={() => {
                navigate("/claimForm");
              }}
              key={1}
              sx={{ color: "#fff" }}
            >
              Claiming
            </Button>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              key={1}
              sx={{ color: "#fff" }}
            >
              Admin Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}></Box>
      <div className="list">
        <div
          className="listContainer"
          style={{
            position: "relative",
            width: "100%",
            height: "500px",
            backgroundColor: "back",
            //   backgroundImage: `url("./banner.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#1e0979",
              opacity: 0.7,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "100px",
              transform: "translateY(-50%)",
              color: "#fff",
            }}
          >
            <h1 style={{ width: "800px", color: "white", fontWeight: "900	" }}>
              INFRASTRUCTURE CONDITION MONITORING SYSTEM
            </h1>
            <p
              style={{
                color: "white",
                width: "1000px",
                textTransform: "lowercase",
              }}
            >
              INFRASTRUCTURE CONDITION MONITORING SYSTEM Allows citizens to
              easily report any damage or potential damage to public
              infrastructure. Instead of having to physically visit public
              offices or rely on media outlets such as radio or social media to
              report such issues, citizens can now use our platform to provide
              necessary information.
            </p>
            <button
              onClick={handleReportClaim}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#1e0979",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Report Claim
            </button>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            padding: "30px",
            width: "80%",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginBottom:"30px"
            }}
          >
            <div >
              <h1 style={{fontWeight:"bold"}}>All Reported Claims</h1>
            </div>
          </div>
          <Grid container spacing={3}>
            {claims.map((claim) => (
              <Grid item xs={12} sm={6} md={4} key={claim.id}>
                <Card>
                  <CardActionArea onClick={() => openModal(claim)}>
                    <img
                      src={claim.images.split(",")[0]}
                      alt="Claim"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <CardContent>
                      <Typography variant="h6">
                        {claim.institution.institutionName}
                      </Typography>
                      <Typography variant="body2">
                        {claim.description.substring(0, 50) + "....."}{" "}
                        <span>read more</span>
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Modal open={Boolean(selectedClaim)} onClose={closeModal}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                maxWidth: 600,
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
              }}
            >
              <img
                src={selectedClaim?.images.split(",")[0]}
                alt="Claim"
                style={{ width: "60%", height: "auto" }}
              />
              <Typography style={{ padding: "0px" }} variant="h6">
                {selectedClaim?.institution.institutionName}
              </Typography>
              <Typography
                style={{ paddingTop: "10px", paddingBottom: "10px" }}
                variant="body1"
              >
                Location : {selectedClaim?.province.name}{" "}
                {selectedClaim?.district.name} {selectedClaim?.sector.name}{" "}
                {selectedClaim?.cell.name} {selectedClaim?.village.name}
              </Typography>
              <Typography
                style={{
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  color: selectedClaim?.isResolved ? "green" : "red",
                }}
                variant="body1"
              >
                <span style={{ color: "black" }}>Infrastructure Status:</span>{" "}
                {selectedClaim?.isResolved ? "Fixed" : "Unfixed"}
              </Typography>

              <Typography variant="body1">
                {selectedClaim?.description}
              </Typography>

              <Button
                style={{
                  backgroundColor: "red",
                  marginTop: "20px",
                  color: "white",
                }}
                onClick={closeModal}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
