import "./preloader.scss";
import logo from "../../assets/logo.png";
export default function Preloader() {
  return (
    <div className="preloader">
      <div className="loader">
        <img src={logo} alt="logo" />
      </div>
      <span>DEVBOOK</span>
    </div>
  );
}
