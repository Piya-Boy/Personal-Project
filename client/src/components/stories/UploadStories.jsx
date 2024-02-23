import "./uploadstories.scss";
import CloseIcon from "@mui/icons-material/Close";
import BrokenImageOutlinedIcon from "@mui/icons-material/BrokenImageOutlined";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "../../config/axios";

export default function UploadStories({ setOpenUpload }) {
  const [file, setFile] = useState(null);
  const isFileSelected = file == null;

  const queryClient = useQueryClient();

  
  const mutation = useMutation(
    async (newStory) => {
      try {
        const res = await axios.post("/stories", newStory);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("stories");
      },
    }
  );

  // Function to resize the image
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions to maintain aspect ratio
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          }, file.type);
        };
      };
    });
  };

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

const handleClick = async (e) => {
  e.preventDefault();
  if (!file) return;

  try {
    const resizedFile = await resizeImage(file, 500, 700);
    const imgUrl = await upload(resizedFile);
    console.log(imgUrl);
    mutation.mutate({ img: imgUrl }); 
  } catch (error) {
    console.error("Error uploading image:", error);
  }

  setFile(null);
  setOpenUpload(false);
};

  return (
    <div className="upload-container">
      <div className="wrapper">
        <h2>Story</h2>
        <form>
          <label htmlFor="upload">
            <div className="content">
              {file && <img src={URL.createObjectURL(file)} alt="Preview" />}
              {file ? "" : <BrokenImageOutlinedIcon className="icon" />}
              <input
                type="file"
                id="upload"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </label>

          {file && (
            <button disabled={isFileSelected} onClick={handleClick}>
              Upload
            </button>
          )}
        </form>
        {file && <CloseIcon className="cancel" onClick={() => setFile(null)} />}
        <CloseIcon className="close" onClick={() => setOpenUpload(false)} />
      </div>
    </div>
  );
}
