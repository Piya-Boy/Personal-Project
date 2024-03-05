import "./genqrcode.scss";
import QRCode from "qrcode.react";
import {Link} from "react-router-dom";

export default function GenQRCode({ user, handleCloseGenQRCode }) {
    const url = `${window.location.origin}/${user.id}`;
    
  const options = {
    value: url,
    level: "M",
    size: 250,
    includeMargin: true,
    imageSettings: {
      src: "https://img2.pic.in.th/pic/logodb4f680ff0b155d6.png",
      height: 40,
      width: 40,
      excavate: true,
    },
  };

  return (
    <div className="genqrcode" onClick={handleCloseGenQRCode}>
      <div className="wrapper">
              <QRCode {...options} />
              <Link to={`/profile/${user.id}`} >
                  <h3 onClick={handleCloseGenQRCode}>{user.name}</h3>
              </Link>
      </div>
    </div>
  );
}
