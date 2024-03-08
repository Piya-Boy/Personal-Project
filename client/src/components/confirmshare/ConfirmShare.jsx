import "./confirmshare.scss";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import moment from "moment";
import { useQuery } from "react-query";
import axios from "../../config/axios";


export default function ConfirmShare({ postId, handleCloseConfirmShare, handleShare }) {
  const { isLoading, error, data } = useQuery(["shares", postId], async () => {
    const res = await axios.get("/shares?postId=" + postId);
    return res.data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="confirm-share" onClick={handleCloseConfirmShare}>
      <div className="wrapper">
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <Link
                to={`/profile/${data.user.id}`}
                style={{ textDecoration: "none" }}
              >
                <Avatar
                  alt={data.user.name}
                  src={`/upload/${data.user.profilePic}`}
                />
              </Link>
              <div className="details">
                <Link
                  to={`/profile/${data.user.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="name">{data.user.name}</span>
                </Link>
                <span className="date">
                  {moment(data.createdAt).fromNow()}
                </span>
              </div>
            </div>
          </div>
          <div className="content">
            <p>{data.desc}</p>
            <img src={`/upload/${data.img}`} alt="" />
          </div>
        </div>
      <button onClick={handleShare}>Share</button>
      <CloseIcon className="close" onClick={handleCloseConfirmShare} />
      </div>
    </div>
  );
}
