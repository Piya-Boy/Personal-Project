import SendIcon from "@mui/icons-material/Send";
import Avatar from "@mui/material/Avatar";
export default function CommentsEdit({
  handleEditDialogClose,
  currentUser,
  editedDesc,
  setEditedDesc,
  handleEditSubmit,
}) {
  const handleChange = (e) => {
    setEditedDesc(e.target.value);
  };

  const isInputEmpty = !editedDesc;

  return (
    <div className="comments">
      <div className="write">
        <Avatar
          alt={currentUser.name}
          src={`/upload/${currentUser.profilePic}`}
        />
        <input type="text" value={editedDesc} onChange={handleChange} />
        <button
          disabled={isInputEmpty}
          onClick={handleEditSubmit}
          variant="contained"
          color="primary"
        >
          <SendIcon />
        </button>
        <div className="cancel-btn">
          <small onClick={handleEditDialogClose}>Cancel</small>
        </div>
      </div>
    </div>
  );
}
