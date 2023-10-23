import React, { useState } from "react";



function LoginForm(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
     };

    const handleLogin = async() => {
        try {
            const formData = new FormData()
            formData.append("username", username)
            formData.append("password", password)

            const response = await fetch("http://localhost:8000/token",{
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData

            });
            if (response.ok) {
                const data = await response.json();
                console.log("Login successful", data)

                localStorage.setItem("access_token", data.access_token);
            } else {
                const errorData = await response.json();
                console.log("Login failed", errorData);
              }
            } catch (error) {
                console.error("An error occurred:", error);
            }
    };

    return(

     <>
            <h1>Login</h1>
            <form  id="Signup-form">
                <div className="form-floating mb-3">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={username} onChange={handleUsernameChange}/>
                </div>
                <div className="form-floating mb-3">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} className='form-control' />

                </div>
                <button type="button" onClick={handleLogin} className="btn btn-primary">Login</button>
            </form>
        </>
    )

}

export default LoginForm;
