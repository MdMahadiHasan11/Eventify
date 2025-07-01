import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://eventify-engine.vercel.app", // Added /api prefix
  withCredentials: true, // Include cookies in requests
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
