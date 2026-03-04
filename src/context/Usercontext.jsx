import React, { useState } from "react";
import { AuthContext } from "./AuthContext";


export const UserContext = ({children}) => {
    // try to read the current login state from storage so the user
    // doesn't get logged out on refresh
    const [isLogin, setIsLogin] = useState(() => {
        return !!localStorage.getItem('token');
    });

    // store the user's role if the backend provides it
    const [role, setRole] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'))?.role || "";
        } catch {
            return "";
        }
    });


    return(
        <AuthContext.Provider value={{isLogin, setIsLogin, setRole, role}}>
            {children}
        </AuthContext.Provider>
        
    )
}