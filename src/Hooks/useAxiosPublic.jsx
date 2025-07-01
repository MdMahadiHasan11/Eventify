import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://eventify-engine.vercel.app",
  withCredentials: true, // Include cookies in requests
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
