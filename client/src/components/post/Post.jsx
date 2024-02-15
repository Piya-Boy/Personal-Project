// Post.js

import "./post.scss";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "../../config/axios";
import { AuthContext } from "../../context/authContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Post({ post }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const { isLoading: likesLoading, data: likesData } = useQuery(
    ["likes", post.id],
    async () => {
      const res = await axios.get(`/likes?postId=${post.id}`);
      return res.data;
    }
  );

  const { data: commentData } = useQuery(["comments", post.id], async () => {
    const res = await axios.get(`/comments?postId=${post.id}`);
    return res.data;
  });

  const mutation = useMutation(
    (liked) => {
      if (liked) return axios.delete(`/likes/${post.id}`);
      return axios.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const deleteMutation = useMutation(
    (postId) => {
      return axios.delete("/posts/" + post.id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {
    mutation.mutate(likesData.includes(currentUser.id));
  };

  const handleDelete = () => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this post?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteMutation.mutate(post.id),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.user.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.user.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <LongMenu handleDelete={handleDelete} />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
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
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentData?.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
}

function LongMenu({ handleDelete }) {
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
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleDelete();
            handleClose();
          }}
        >
          <DeleteIcon /> Delete
        </MenuItem>
      </Menu>
    </div>
  );
}
