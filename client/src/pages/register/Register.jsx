import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { useState } from "react";

export default function Register() {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
 const handleChange = (e) => {
   const { name, value } = e.target;
   setInput((prev) => ({ ...prev, [name]: value }));
   setErrors((prev) => ({ ...prev, [name]: "" }));
 };

  const handleClick = async (e) => {
    e.preventDefault();

    if (!input.username.trim()) {
      setErrors((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!input.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }
    if (!input.password.trim()) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      return;
    }
    if (!input.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    

    try {
      await axios.post("/auth/register", input);
      navigate("/login");
    } catch (err) {
      setErrors({ general: err.response.data });
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>DEV BOOK.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={input.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={input.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={input.name}
              onChange={handleChange}
              autoComplete="off"
            />
            {errors.name && <p className="error">{errors.name}</p>}
            {errors.general && <p className="error">{errors.general}</p>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
