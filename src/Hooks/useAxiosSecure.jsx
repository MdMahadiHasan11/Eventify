"use client";

import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Layout/AuthProvider/AuthContext";

const axiosSecure = axios.create({
  baseURL: "https://eventify-engine.vercel.app", // Added /api prefix
  withCredentials: true, // Include cookies in requests
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const logOut = authContext?.logOut || (() => {});

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await logOut();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
