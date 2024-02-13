import './comments.scss'
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import ueserProfile from '../../assets/user.png';
import SendIcon from "@mui/icons-material/Send";
export default function Comments() {
  const [comment, setComment] = useState({})

  const handleChange = (e) => {
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const isInputEmpty = Object.values(comment).every((value) => value === "");

  const { currentUser } = useContext(AuthContext);
  const profilePic = currentUser.profilePic || ueserProfile

  const comments = [
    {
      id: 1,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
      name: "John Doe",
      userId: 1,
      profilePicture:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    {
      id: 2,
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
      name: "Jane Doe",
      userId: 2,
      profilePicture:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    },
  ];


  return (
    <div className="comments">
      <div className="write">
        <img src={profilePic} alt="" />
        <input type="text" name="comment" onChange={handleChange} autoComplete="off" placeholder="write a comment" />
        <button disabled={isInputEmpty}><SendIcon/></button>
      </div>
      {comments.map((comment) => (
        <div className="comment">
          <img src={comment.profilePicture} alt="" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">1 hour ago</span>
        </div>
      ))}
    </div>
  );
};
