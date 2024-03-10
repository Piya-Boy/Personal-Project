import "./posts.scss";
import Post from "../post/Post";
import SharesPost from "../sharespost/SharesPost";
import { useQuery } from "react-query";
import axios from "../../config/axios";
import PostSkeleton from "../Skeleton/PostSkeleton";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

export default function Posts({ userId }) {
  const { isLoading, error, data } = useQuery(["posts", userId], async () => {
    const res = await axios.get("/posts?userId=" + userId);
    return res.data;
  });

  // console.log(data);
  return (
    <div className="posts">
      {error ? (
        <ErrorOutlineOutlinedIcon
          style={{ display: "block", margin: "auto" }} sx={{ fontSize: 50 }}
        />
      ) : isLoading ? (
        [...Array(5)].map((_, i) => <PostSkeleton key={i} />)
      ) : (
        data.map((post) => (
          <div key={post.id}>
            <Post post={post} />
            {post.shares && post.shares.length > 0 && (
              <SharesPost originalPost={post} sharedata={post.shares} />
              )}
          </div>
        ))
      )}
    </div>
  );
}
