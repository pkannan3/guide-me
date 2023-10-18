import React, { useEffect, useState } from 'react';

function SignupForm(){
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  };

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  // const handleChangeConfirmPassword = (event) => {
  //   setConfirmPassword(event.target.value);
  // };

  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !username || !password || !email) {
      setError('Please fill in all fields');
      return;
    }

    const data = {}; //This was the bug."You’re sending back a field called “firstName” but your backend is expecting a field called “first_name”" I just went head an change all of the data for consistency.

      data.first_name = firstName;
      data.username = username;
      data.password = password;
      data.email = email;


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
        setError('');
      } else {
        const errorData = await response.json();
        setError('Registration failed: ' + errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError('An error occurred while registering');
    }
  };


  // const fetchData = async () => {
  //   const authenticationURL = "http://localhost:8000/authentication/";
  //   const authenticationModelResponse = await fetch(authenticationURL);

  //   if (authenticationModelResponse.ok) {
  //     const data = await authenticationModelResponse.json();
  //     // setModels(data.models);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <div className="row">
      <div className="offset-3 col-6">
        <div className="shadow p-4 mt-4">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} id="sign-up-form">
            <div className="form-floating mb-3">
              <input
                onChange={handleChangeFirstName}
                value={firstName}
                placeholder="First Name"
                required name="first_name"
                type="text" id="first_name"
                className="form-control"
              />
              <label htmlFor="first name">First Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleChangeUsername}
                value={username}
                placeholder="Username"
                required name="username"
                type="text" id="username"
                className="form-control"
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="form-floating mb-3">
              <input
                onChange={handleChangePassword}
                value={password}
                placeholder="Password"
                required name="password"
                type="text" id="password"
                className="form-control"
              />
              <label htmlFor="password">Password</label>
            </div>
            {/* <div className="form-floating mb-3">
              <input
                onChange={handleChangeConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm Password"
                required name="confirm_password"
                type="text" id="confirm_password"
                className="form-control"
              />
              <label htmlFor="confirm password">Confirm Password</label>
            </div> */}
            <div className="form-floating mb-3">
              <input
                onChange={handleChangeEmail}
                value={email}
                placeholder="Email"
                required name="email"
                type="text" id="email"
                className="form-control"
              />
              <label htmlFor="email">Email</label>
            </div>
            <div className="mb-3 text-danger">{error}</div>
            <button className="btn btn-primary">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignupForm;
