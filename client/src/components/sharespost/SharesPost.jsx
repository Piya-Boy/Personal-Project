import "./sharespost.scss";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import ConfirmShare from "../confirmshare/ConfirmShare";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "../../config/axios";
import { AuthContext } from "../../context/authContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAlert } from "react-alert";

export default function SharesPost({ originalPost, sharedata }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [showConfirmShare, setShowConfirmShare] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const alert = useAlert();

  const { isLoading: likesLoading, data: likesData } = useQuery(
    ["likes", originalPost.id],
    async () => {
      const res = await axios.get(`/likes?postId=${originalPost.id}`);
      return res.data;
    }
  );

  const { data: commentData } = useQuery(
    ["comments", originalPost.id],
    async () => {
      const res = await axios.get(`/comments?postId=${originalPost.id}`);
      return res.data;
    }
  );

  const mutation = useMutation(
    (liked) => {
      if (liked) return axios.delete(`/likes/${originalPost.id}`);
      return axios.post("/likes", { postId: originalPost.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const deleteMutation = useMutation(
    (shareId) => {
      return axios.delete(`/shares/${shareId}`);
    },

    {
      onSuccess: () => {
        alert.success("Share deleted successfully!");
        queryClient.invalidateQueries(["posts"]);
        setShowConfirmShare(false);
      },
    }
  );

  const shareMutation = useMutation(
    () => axios.post("/shares", { postId: originalPost.id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        setShowConfirmShare(false);
        alert.success("Post shared successfully!");
      },
    }
  );

  const handleShare = () => {
    shareMutation.mutate();
  };

  const handleLike = () => {
    mutation.mutate(likesData.includes(currentUser.id));
  };

   const handleShowConfirmShare = () => {
     setShowConfirmShare(true);
   };

  const handleDelete = ({ shareId }) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this share?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteMutation.mutate(shareId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div>
      {sharedata.map((share) => (
        <div key={share.id} className="SharesPost">
          <div className="container">
            <div className="user">
              <div className="userInfo">
                <Avatar src={`/upload/${share.user.profilePic}`} alt="" />
                <div className="details">
                  <Link
                    to={`/profile/${share.user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span className="name">{share.user.name}</span>
                  </Link>
                  <span className="date">
                    {moment(share.createdAt).fromNow()}
                  </span>
                </div>
              </div>
              {currentUser.id === share.user.id && (
                <LongMenu handleDelete={handleDelete} shareId={share.id} />
              )}
            </div>
            <div className="container">
              <div className="user">
                <div className="userInfo">
                  <Avatar
                    src={`/upload/${originalPost.user.profilePic}`}
                    alt=""
                  />
                  <div className="details">
                    <Link
                      to={`/profile/${originalPost.user.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <span className="name">{originalPost.user.name}</span>
                    </Link>
                    <span className="date">
                      {moment(originalPost.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="content">
                <p>{share.post.desc}</p>
                <img src={`/upload/${share.post.img}`} alt="" />
              </div>
            </div>
            <div className="info">
              <div className="item">
                {likesLoading ? (
                  "Loading..."
                ) : likesData.includes(currentUser.id) ? (
                  <ThumbUpRoundedIcon onClick={handleLike} />
                ) : (
                  <ThumbUpOffAltIcon onClick={handleLike} />
                )}
                {likesData?.length} Likes
              </div>
              <div
                className="item"
                onClick={() => setCommentOpen(!commentOpen)}
              >
                <TextsmsOutlinedIcon />
                {commentData?.length} Comments
              </div>
              <div className="item" onClick={handleShowConfirmShare}>
                <ShareOutlinedIcon />
                {originalPost.shares?.length} Share
              </div>
              {showConfirmShare && (
                <ConfirmShare
                  handleShare={handleShare}
                  postId={originalPost.id}
                  handleCloseConfirmShare={() => setShowConfirmShare(false)}
                />
              )}
            </div>
            {commentOpen && <Comments postId={originalPost.id} />}
          </div>
        </div>
      ))}
    </div>
  );
}

function LongMenu({ handleDelete, shareId }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="postMenu">
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon className="MoreVert" />
      </IconButton>
      <div className="itemMenu">
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            style: {
              left: 40 + "px",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleDelete({ shareId });
              handleClose();
            }}
          >
            <DeleteIcon /> Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
