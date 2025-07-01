import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

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

        // Verify token with the server
        const response = await axiosSecure.get("/verify-token", {
          withCredentials: true, // Ensure cookies are sent
        });

        if (response.data.valid) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          // Try refreshing the token
          const refreshResponse = await axiosPublic.post(
            "/refresh-token",
            {},
            { withCredentials: true } // Ensure cookies are sent
          );

          if (refreshResponse.data.user && refreshResponse.data.token) {
            setUser(refreshResponse.data.user);
            localStorage.setItem(
              "user",
              JSON.stringify(refreshResponse.data.user)
            );
          } else {
            setUser(null);
            localStorage.removeItem("user");
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
        }
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [axiosSecure, axiosPublic]);

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
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      } else {
        throw new Error(response.data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message };
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
        { withCredentials: true } // Ensure cookies are sent
      );

      if (response.status === 200) {
        const user = response.data.user;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      } else {
        throw new Error(response.data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await axiosSecure.post("/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
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
