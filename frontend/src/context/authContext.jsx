/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        const storedToken = localStorage.getItem("token")
        if (!storedToken) {
            setUser(null);
            setToken(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await axiosInstance.get("/auth/session")
            // Backend response shape: { success: true, session: { userId, role, email } }
            setUser(data?.session || null)
        } catch (err) {
            // Token is invalid or expired → clean up
            console.error(err);
            localStorage.removeItem("token")
            setUser(null)
            setToken(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshSession();
    }, [])

    const login = async (email, password, role_type) => {
        const { data } = await axiosInstance.post("/auth/login", { email, password, role_type });
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success("Login Successful");
    }

    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        refreshSession
    }
    return (
        < AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export default AuthContext;