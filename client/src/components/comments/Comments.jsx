import "./comments.scss";
// import { CommentsEdit } from "./CommentsEdit";
import  { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../config/axios";
import moment from "moment";
import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import CommentsEdit from './CommentsEdit';


export default function Comments({ postId }) {
  const [inputs, setInputs] = useState({ desc: "" });
  const [editedDesc, setEditedDesc] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isInputEmpty = Object.values(inputs).every((value) => value === "");

  const mutation = useMutation(
    async (newComment) => {
      const res = await axios.post("/comments", newComment);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
        setInputs({ desc: "" });
      },
      onError: (error) => {
        console.error("Error adding comment:", error);
        // Handle error feedback to the user
      },
    }
  );

  const deleteMutation = useMutation(
    (commentId) => {
      return axios.delete(`/comments/${commentId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
      },
      onError: (error) => {
        console.error("Error deleting comment:", error);
        // Handle error feedback to the user
      },
    }
  );

  const handleDelete = (commentId) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this comment?",
      buttons: [
        {
          label: "Yes",
          onClick: () => deleteMutation.mutate(commentId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  }; 

  const handleEdit = (commentId, initialDesc) => {
    setEditedDesc(initialDesc);
    setEditCommentId(commentId);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditedDesc("");
    setEditCommentId(null);
  };
  // Comments.jsx
  const editMutation = useMutation(
    async ({ commentId, desc }) => {
      const res = await axios.put(`/comments/${commentId}`, { desc });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
        handleEditDialogClose();
      },
      onError: (error) => {
        console.error("Error editing comment:", error);
        // Handle error feedback to the user
      },
    }
  );

  const handleEditSubmit = () => {
    if (!editedDesc) return; // Prevent empty submissions
    editMutation.mutate({ commentId: editCommentId, desc: editedDesc });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInputEmpty) return; // Prevent empty submissions
    mutation.mutate({ desc: inputs.desc, postId });
  };

  const { isLoading, error, data } = useQuery(
    ["comments", postId],
    async () => {
      const res = await axios.get(`/comments?postId=${postId}`);
      return res.data;
    }
  );

  return (
    <div className="comments">
      <div className="write">
        <Avatar
          alt={currentUser.name}
          src={`/upload/${currentUser.profilePic}`}
        />

        <input
          type="text"
          placeholder="Write a comment"
          name="desc"
          autoComplete="off"
          value={inputs.desc}
          onChange={handleChange}
        />
        <button disabled={isInputEmpty} onClick={handleSubmit}>
          <SendIcon />
        </button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <Avatar
                alt={comment.user.name}
                src={`/upload/${comment.user.profilePic}`}
              />

              <div className="info">
                <span>{comment.user.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
              {currentUser.id === comment.usersid && (
                <LongMenu
                  handleDelete={() => handleDelete(comment.id)}
                  handleEdit={() => handleEdit(comment.id, comment.desc)}
                />
              )}
            </div>
          ))}
      {editDialogOpen && (
        <CommentsEdit
          handleEditDialogClose={handleEditDialogClose}
          currentUser={currentUser}
          editedDesc={editedDesc}
          setEditedDesc={setEditedDesc}
          handleEditSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

function LongMenu({ handleDelete, handleEdit }) {
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
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon /> Edit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <DeleteIcon /> Delete
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
