import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Account.css";


function SettingsForm() {

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
