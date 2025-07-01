import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosPublic();

  // Check token validity on every render
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosSecure.get("/verify-token");
        if (response.data.valid) {
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [axiosSecure]);

  // Create user (register)
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

  // Sign in with email & password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post("/login", {
        email,
        password,
      });

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

  // Logout function
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
