import "./comments.scss";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import SendIcon from "@mui/icons-material/Send";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../../config/axios";
import moment from "moment";

export default function Comments({ postId }) {
  const [inputs, setInputs] = useState({ desc: "" });
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="Write a comment"
          name="desc"
          autoComplete="off"
          value={inputs.desc}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          <SendIcon />
        </button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div className="comment" key={comment.id}>
              <img src={"/upload/" + comment.profilePic} alt="" />
              <div className="info">
                <span>{comment.user.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
}
