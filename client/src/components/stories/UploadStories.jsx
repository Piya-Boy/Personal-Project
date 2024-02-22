import "./uploadstories.scss";
import CloseIcon from "@mui/icons-material/Close";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { useState } from "react";

export default function UploadStories({ setOpenUpload }) {
    const [file, setFile] = useState(null);
    
    const isFileSelected = file == null;

  return (
    <div className="upload-container">
      <div className="wrapper">
        <label htmlFor="upload">
          <div className="content">
            <img src={file ? URL.createObjectURL(file) : ""}   />
            <BrokenImageOutlinedIcon className="icon" />
            <input
              type="file"
              id="upload"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </label>

        <button disabled={isFileSelected}>Upload</button>

        <CloseIcon className="close" onClick={() => setOpenUpload(false)} />
      </div>
    </div>
  );
}
