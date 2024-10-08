// src/hooks/userContext.js
import React, { createContext, useContext, useState, useEffect,useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [email, setEmail] = useState(null);
    const [userIn,setUserIn] = useState(false);
    const [isLoginPopupVisible, setIsLoginPopupVisible] = useState(false);
    const [isRegisterPopupVisible, setIsRegisterPopupVisible] = useState(false);
    const loginPopupRef = useRef(null); // Reference for the login section


    useEffect(() => {
        const UserToken = localStorage.getItem('UserToken');
        if (UserToken) {
            const decodedToken = jwtDecode(UserToken);
            setEmail(decodedToken.email);
            setUserIn(true);
            console.log("By jwt decode", decodedToken.email);
        } else {
            setEmail(null); // Set to null if no token is found
            setUserIn(false);
        }
    }, []); // Run only once on mount
    const toggleLoginPopup = () => {
        if (loginPopupRef.current) {
            loginPopupRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        setIsLoginPopupVisible(true); // Open login popup
        setIsRegisterPopupVisible(false); // Close register popup
      };
    
      const toggleRegisterPopup = () => {
        setIsLoginPopupVisible(false); // Open login popup
        setIsRegisterPopupVisible(true); // Close register popup
      }

    const login = (token) => {
         // Store token in localStorage
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email); // Update email state
        setUserIn(true);
    };

    const logout = () => {
        localStorage.removeItem('UserToken'); // Remove token from localStorage
        setEmail(null); // Clear email state
        setUserIn(false);
    };

    return (
        <UserContext.Provider value={{ email,userIn,isLoginPopupVisible,loginPopupRef,setIsLoginPopupVisible,isRegisterPopupVisible,setIsRegisterPopupVisible,toggleLoginPopup,toggleRegisterPopup, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
