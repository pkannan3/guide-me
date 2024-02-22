import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";
import { UserContext } from "../context";



function SettingsForm() {
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");


    const { user, userInfo } = useContext(UserContext);

    useEffect(() => {
        console.log("userinfo", userInfo)
        if (user) {
            setId(user.id);
            fetchAccountData();
        }
    }, [user]);


    const fetchAccountData = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/accounts/${userInfo}/`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("test", data)
            setId(data.id);
            setName(data.name);
            setUsername(data.username);
            setEmail(data.email);
     } catch (error) {
        console.error("Error fetching account data:", error);
     }
   };

    const handleSubmit = async (e) => {
        e.preventDefault();


        try {
                if(user && user.id){
            const response = await fetch(
                `http://localhost:8000/api/accounts/${user.id}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    newPassword,
                }),
                }
            );

        if (response.ok) {
            alert("Account information updated successfully");

        } else {
            alert("Error updating account information");
        }
        }else{
            console.error("user data or user id is missing");
            alert("error updating account information");
        }
        } catch (error) {
        console.error("Error updating account:", error);
        alert("Error updating account information");
        }
  };


    return (
        <>
            <div className="background font">
                <div className="container">
                    <div className="grid-container">
                        <h1 className="font">Account</h1>
                        <form id="Settings-form" className="form" onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input type="text" id="name" placeholder="Name" className="font" value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" id="email" placeholder="Email" className="font" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" id="username" placeholder="Username" className="font"value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            {/* <div className="form-floating mb-3">
                                <input type="text" id="current password" placeholder="Current password" className="font"value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div> */}
                             <div className="form-floating mb-3">
                                <input type="text" id="new password" placeholder="New password" className="font" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <button type="button" className="accounts-button font" onClick={handleSubmit}>
                                Save
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingsForm;
