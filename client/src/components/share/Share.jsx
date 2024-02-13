import './share.scss'
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import userProfile from "../../assets/user.png";
import NearMeIcon from "@mui/icons-material/NearMe";

export default function Share() {
  
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  }

  const { currentUser } = useContext(AuthContext);
  const profilePic = currentUser.profilePic ?? userProfile;
  
  const isInputEmpty = Object.values(inputs).every((value) => value === "");

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={profilePic} alt="" />
          <input
            type="text"
            name="desc"
            onChange={handleChange}
            placeholder={`What's on your mind ${currentUser.name}?`}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{ display: "none" }} />
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
            <button disabled={isInputEmpty}><NearMeIcon/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

