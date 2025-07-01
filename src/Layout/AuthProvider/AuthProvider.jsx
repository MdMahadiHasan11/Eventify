// AuthProvider.js
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext"; // Import the context
import useAxiosPublic from "../../Hooks/useAxiosPublic";
// import useAxiosPublic from "../../hooks/useAxiosPublic";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  // Sign in with email & password
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const response = await axiosPublic.post("/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        console.log("Login successful:", response.data);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser(response.data.user);
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
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
    signIn,
    logOut,
  };

  console.log(user);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
