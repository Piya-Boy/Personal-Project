import "./profile.scss";
import * as React from "react";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "../../config/axios";
import Update from "../../components/update/Update";
import Share from "../../components/share/Share";
export default function Profile() {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user", userId], async () => {
    const res = await axios.get("/users/find/" + userId);
    return res.data;
  });


  // title
  useEffect(() => {
    document.title = data?.name || "...Loading";
  }, [data?.name]);


  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship", userId],
    async () => {
      const res = await axios.get("/relationships?followedUserId=" + userId);
      return res.data;
    }
  );



  const queryClient = useQueryClient();

 const mutation = useMutation(
   (following) => {
     if (following) {
       return axios.delete(`/relationships?userId=${userId}`);
     }
     return axios.post("/relationships", { userId });
   },
   {
     onSuccess: () => {
       // Invalidate and refetch
       queryClient.invalidateQueries(["relationship", userId]);
     },
   }
 );


  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        <Typography
          variant="body3"
          display="flex"
          justifyContent="center"
          alignItems={"center"}
          sx={{ height: "100vh" }}
        >
          <Box>
            <CircularProgress />
          </Box>
        </Typography>
      ) : error ? (
        <ErrorOutlineOutlinedIcon
          style={{ display: "block", margin: "auto" }}
          sx={{ fontSize: 50, height: "100vh" }}
        />
      ) : (
        <>
          <div className="images">
            <img src={"/upload/" + data.coverPic} alt="" className="cover" />
            <Avatar
              alt={data.name}
              src={`/upload/${data.profilePic}`}
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <span>{data.username}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  <CircularProgress />
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            {isLoading ? <CircularProgress/> : userId === currentUser.id && <Share />}
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
}
