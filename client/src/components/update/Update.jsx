import "./update.scss";
import { useMutation, useQueryClient } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Avatar from "@mui/material/Avatar";
import axios from "../../config/axios";
import { useState } from "react";

export default function Update({ setOpenUpdate, user }) {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
    const [texts, setTexts] = useState({
    username: user.username,
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });


const upload = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post("/upload", formData);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
  // console.log(data);
  
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

    // console.log(texts.password);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return axios.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
    );
    
  const handleClick = async (e) => {
    e.preventDefault();

    //TODO: find a better way to get image UR

    let coverUrl;
    let profileUrl;
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts,  coverPic: coverUrl, profilePic: profileUrl });
    setOpenUpdate(false);
    setCover(null);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h2>Update Your Profile</h2>
        <form>
          <div className="files">
            <label htmlFor="cover">
              {/* <span>Cover Picture</span> */}
              <div className=" cover">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              {/* <span>Profile Picture</span> */}
              <div className="profilePic">
                <Avatar
                  alt={texts.name}
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  className="img"
                />

                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={texts.username}
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="email"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="password"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <CloseIcon className="close" onClick={() => setOpenUpdate(false)} />
      </div>
    </div>
  );
}
