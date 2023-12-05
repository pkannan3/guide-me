import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";
import { UserContext } from "../context";

function SignupForm({ onRegister }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useContext(UserContext);

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !username || !password || !email) {
      setError("Please fill in all fields");
      return;
    }

    const data = {
      name: name,
      username: username,
      password: password,
      email: email,
    };

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful");
        setError("");
        onRegister();
        localStorage.setItem("access_token", result.access_token);
        setUser(result.access_token);
        navigate("/trips");
      } else {
        const errorData = await response.json();
        setError("Registration failed: " + errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred while registering");
    }
  };

  return (
    <div className="background font">
      <div className="container">
        <div className="grid-container">
          <h1 className="font">Sign Up</h1>
          <form onSubmit={handleSubmit} id="Signup-form" className="form">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Name"
                value={name}
                onChange={handleChangeName}
                className="font"
              />
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleChangeUsername}
                className="font"
              />
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChangePassword}
                className="form-control font"
              />
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleChangeEmail}
                className="font"
              />
            </div>
            <div className="mb-3 text-danger">{error}</div>
            <button type="submit" className="accounts-button font">
              Create
            </button>
            <div>
              <p className="font">
                Already have an account?{" "}
                <Link to="/login" className="font">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <div>
        <table align="right" style={{ paddingRight: "10px" }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: "15px" }}>Privacy Policy</td>
              <td>© 2023</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SignupForm;
