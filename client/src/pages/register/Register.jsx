import './register.scss'
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import { useState } from 'react';
export default function Register() {

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

 const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
     await axios.post("/auth/register", input);
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  };

    console.log(err);

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
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              autoComplete="off"
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
