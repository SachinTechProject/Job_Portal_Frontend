import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = ({children}) => {
    const navigate = useNavigate();

    // Function to check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (error) {
            return true; // Invalid token
        }
    };

    // try to read the current login state from storage so the user
    // doesn't get logged out on refresh
    const [isLogin, setIsLogin] = useState(() => {
        const token = localStorage.getItem('token');
        return token && !isTokenExpired(token);
    });

    // store the user's role if the backend provides it
    const [role, setRole] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'))?.role || "";
        } catch {
            return "";
        }
    });

    // Effect to check token expiration periodically or on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            // Token expired, log out
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsLogin(false);
            setRole("");
            navigate('/login');
        }

        // Axios interceptor to handle 401 responses
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid, log out
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setIsLogin(false);
                    setRole("");
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return(
        <AuthContext.Provider value={{isLogin, setIsLogin, setRole, role}}>
            {children}
        </AuthContext.Provider>
        
    )
}