import axios from "axios";

const axiosPublic = axios.create({
  // baseURL: "https://eventify-engine.vercel.app",
  baseURL: "http://localhost:5000",
  // withCredentials: true, // Include cookies in requests
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
