"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

// Create axios instances directly to avoid circular dependency
const axiosPublic = axios.create({
  baseURL: "https://eventify-engine.vercel.app",
});

const axiosSecure = axios.create({
  baseURL: "https://eventify-engine.vercel.app",
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Parse stored user data
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Set user immediately to avoid UI flicker

        // Add token to request headers
        const token = localStorage.getItem("access-token");
        if (token) {
          axiosSecure.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        }

        // Verify token with the server
        const response = await axiosSecure.get("/verify-token", {
          withCredentials: true,
        });

        if (response.data.valid) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          // Try refreshing the token
          const refreshResponse = await axiosPublic.post(
            "/refresh-token",
            {},
            { withCredentials: true }
          );

          if (refreshResponse.data.user && refreshResponse.data.token) {
            setUser(refreshResponse.data.user);
            localStorage.setItem(
              "user",
              JSON.stringify(refreshResponse.data.user)
            );
            localStorage.setItem("access-token", refreshResponse.data.token);
          } else {
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("access-token");
          }
        }
      } catch (error) {
        console.error("Token verification error:", error);
        // Only clear user if the error explicitly indicates an invalid token
        if (
          error.response?.status === 401 ||
          error.response?.data?.message === "Invalid or expired token"
        ) {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("access-token");
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const createUser = async (username, email, password, photoURL) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post("/register", {
        username,
        email,
        password,
        photoURL,
      });

      if (response.status === 201) {
        const user = response.data.user;
        const token = response.data.token;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        if (token) {
          localStorage.setItem("access-token", token);
        }
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const user = response.data.user;
        const token = response.data.token;

        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        if (token) {
          localStorage.setItem("access-token", token);
        }
        return { success: true };
      } else {
        throw new Error(response.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access-token");
      if (token) {
        axiosSecure.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
        await axiosSecure.post("/logout", {}, { withCredentials: true });
      }

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access-token");
      delete axiosSecure.defaults.headers.common["Authorization"];
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local data even if server request fails
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("access-token");
      delete axiosSecure.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    signIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
