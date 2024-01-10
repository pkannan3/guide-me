import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";
import { UserContext } from "../context";



function SettingsForm() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");


    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user && user.username) {
            fetchAccountData(user.username);
        }
    }, [user]);


    const fetchAccountData = async (username) => {
        try {
            const response = await fetch(`http://localhost:8000/api/accounts/${username}/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);

        } catch (error) {

            console.error('Error fetching account data:', error);
        }
    };


    return (
        <>
            <div className="background font">
                <div className="container">
                    <div className="grid-container">
                        <h1 className="font">Account</h1>
                        <form id="Settings-form" className="form">
                            <div className="form-floating mb-3">
                                <input type="text" id="name" placeholder="Name" className="font"/>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" id="email" placeholder="Email" className="font"/>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" id="username" placeholder="Username" className="font"/>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="text" id="current password" placeholder="Current password" className="font"/>
                            </div>
                             <div className="form-floating mb-3">
                                <input type="text" id="new password" placeholder="New password" className="font"/>
                            </div>
                            <button type="button" className="accounts-button font">
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
