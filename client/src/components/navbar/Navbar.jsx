import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Link } from "react-router-dom";
import { useContext , useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import Avatar from "@mui/material/Avatar";
import {
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import axios from "../../config/axios";
import SeachResult from "./SearchResult";

export default function Navbar() {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [Input, setInput] = useState("");
  const [Result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (value) => {
   try {
     setLoading(true);
     const response = await axios.get("/users");
     const data = response.data;

     const filteredData = data.filter((user) => {
       return (
         value &&
         user &&
         (user.name.toLowerCase().includes(value.toLowerCase()) ||
           user.username.toLowerCase().includes(value.toLowerCase()))
       );
     });

     setResult(filteredData);
     setLoading(false);
   } catch (error) {
     console.error("Error fetching data:", error);
     setLoading(false); 
   }
 };


  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    fetchData(value);
  };

  const handleListItemClick = () => {
    setInput(""); 
    setResult([]);
    setLoading(false);

  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const logout = async () => {
    console.log("Logging out...");
    try {
      localStorage.clear();
       await axios.post("/auth/logout");
       window.location.reload();
     } catch (err) {
       console.log(err);
     }
  };
  

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>{"<DEVBOOK/>"}</span>
        </Link>

        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>

        <div style={{ cursor: "pointer" }}>
          {darkMode ? (
            <WbSunnyOutlinedIcon onClick={toggle} />
          ) : (
            <DarkModeOutlinedIcon onClick={toggle} />
          )}
        </div>

        <GridViewOutlinedIcon className="icon" />
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search..."
            onChange={handleInput}
            value={Input}
          />
          {Input && (
            <CloseOutlinedIcon
              onClick={handleListItemClick}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
        <div className="search-result">
          {Input.length > 0 && (
            <SeachResult
              users={Result}
              loading={loading}
              handleListItemClick={handleListItemClick}
            />
          )}
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon className="icon" />
        <EmailOutlinedIcon className="icon" />
        <NotificationsOutlinedIcon className="icon" />
        <div className="user" onClick={handleOpenUserMenu}>
          <Avatar
            alt={currentUser.name}
            src={`/upload/${currentUser.profilePic}`}
          />
          <span>{currentUser.name}</span>
        </div>
        <Menu
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem onClose={handleCloseUserMenu}>
            <Typography>
              <Link
                to={`/profile/${currentUser.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  alignItems: "center",
                  display: "flex",
                  gap: "5px",
                }}
              >
                <AccountCircleOutlinedIcon /> Profile
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem onClose={handleCloseUserMenu} onClick={logout}>
            <Typography
              textAlign="center"
              alignItems="center"
              display="flex"
              gap="5px"
              color="red"
            >
              <ExitToAppIcon /> Logout
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
