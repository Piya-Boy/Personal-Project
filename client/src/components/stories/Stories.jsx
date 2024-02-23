import "./stories.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "../../config/axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import UploadStories from "./UploadStories";
export default function Stories() {
  const { currentUser } = useContext(AuthContext);
 const [openUpload, setOpenUpload] = useState(false);
  const { isLoading, error, data } = useQuery(["stories"], async () =>{
    const res = await axios.get("/stories");
    return res.data;
  });

  // console.log(data);

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <button onClick={() => setOpenUpload(true)}>+</button>
      </div>
      {/* <UploadStories /> */}
      {openUpload && <UploadStories setOpenUpload={setOpenUpload} />}
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={"/upload/" + story.img} alt="" />
              <Link to={`profile/${story.user.id}`}>
                <span>{story.user.name}</span>
              </Link>
            </div>
          ))}
    </div>
  );
};
