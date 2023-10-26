import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";

function SignupForm({ onRegister }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
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

    if (!firstName || !username || !password || !email) {
      setError("Please fill in all fields");
      return;
    }

    const data = {
      first_name: firstName,
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
        console.log("Registration successful");
        setError("");
        onRegister();
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
      <div className="grid-container">
        <div className="left-container">
          <img src="Girl2.jpg" alt="Traveling Girl" className="cropped-image" />
        </div>
        <div className="right-container">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} id="Signup-form" className="form">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="First Name"
                value={firstName}
                onChange={handleChangeFirstName}
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
                className="form-control"
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
              />
            </div>
            <div className="mb-3 text-danger">{error}</div>
            <button type="submit" className="account-button font">
              Create
            </button>
            <div>
              <p>
                Already have an account? <Link to="/login">Login</Link>
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
