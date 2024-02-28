import { useContext,createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [isUserLoggedIn, setUserLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(localStorage.getItem("access_token"));
  const [userInfo, setUserinfo] = useState(localStorage.getItem("username"))

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserLoggedIn(false);
    window.location.reload();
  };

  const handleLogin = () => {
    setUserLoggedIn(true);
  };



    const updateUser = (userData) => {
        setUser(userData);
    };


    console.log('User:', user);
    console.log('User ID:', user ? user.id : null);

    return (
        <UserContext.Provider value={{ setUserinfo, userInfo, setUser,isUserLoggedIn, handleLogout, handleLogin, user, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};
