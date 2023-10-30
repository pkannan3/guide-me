import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";
import { UserContext } from "../context";

function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful", data);
        localStorage.setItem("access_token", data.access_token);
        setUser(data.access_token);
        navigate("/trips");
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.log("Login failed", errorData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="background font">
      <div className="container">
        <div className="grid-container">
          <h1 className="font">Login</h1>
          <form id="Signup-form" className="form">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                className="font"
              />
            </div>
            <div className="form-right mb-3">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="form-control font"
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="accounts-button font"
            >
              Login
            </button>
            <p className="font">
              Don't have an account?{" "}
              <Link to="/register" className="font">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
      <div>
        <table align="right" style={{ paddingRight: "10px" }}>
          <tr>
            <td style={{ paddingRight: "15px" }}>Privacy Policy</td>
            <td>©2023</td>
          </tr>
        </table>
      </div>
    </div>
  );
}

export default LoginForm;
