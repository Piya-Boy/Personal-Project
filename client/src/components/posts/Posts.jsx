import "./posts.scss";
import Post from "../post/Post";
import { useQuery } from "react-query";
import axios from "../../config/axios";
// import { useContext } from "react";
// import { AuthContext } from "../../context/authContext";
import PostSkeleton from "../Skeleton/PostSkeleton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
export default function Posts({ userId }) {
  // const { currentUser } = useContext(AuthContext);
  // const userId = currentUser.id

  const { isLoading, error, data } = useQuery(["posts", userId], async () => {
    const res = await axios.get("/posts?userId=" + userId);
    return res.data;
  });

  // console.log(data);

  return (
    <div className="posts">
      {error
        ? <ErrorOutlineOutlinedIcon style={{display: "block", margin: "auto"}}/>
        : isLoading
        ? [...Array(5)].map((_, i) => <PostSkeleton key={i} />)
        : data.map((post) => <Post key={post.id} post={post} />)}
          
    </div>
  );
}
