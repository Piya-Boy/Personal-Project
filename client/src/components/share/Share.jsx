import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Avatar from "@mui/material/Avatar";
import NearMeIcon from "@mui/icons-material/NearMe";
import { useMutation, useQueryClient } from "react-query";
import axios from "../../config/axios";

 
export default function Share() {
  const [inputs, setInputs] = useState({ desc: "" }); // Assuming you have a "desc" field
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  const isInputEmpty = Object.values(inputs).every((value) => value === "");
  const isFileSelected = file !== null;

  const isPostButtonDisabled = isInputEmpty && !isFileSelected;

  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newPost) => {
      try {
        const res = await axios.post("/posts", newPost);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc: inputs.desc, userId: currentUser.id, img: imgUrl });
    setInputs({ desc: "" });
    setFile(null);
  };
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <Avatar
              alt={currentUser.name}
              src={`/upload/${currentUser.profilePic}`}
            />
            <input
              type="text"
              name="desc"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={handleChange}
              value={inputs.desc}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="preview">
          {file && (
            <div className="image">
              <img src={URL.createObjectURL(file)} alt="" />
            </div>
          )}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              accept=".png,.jpeg,.jpg"
              name="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            {mutation.isLoading ? (
              "Posting..."
            ) : (
              <button disabled={isPostButtonDisabled} onClick={handleClick}>
                <NearMeIcon />{" "}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
