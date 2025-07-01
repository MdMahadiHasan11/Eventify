import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useMyEvent = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: myEvents = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["myEvents"], // Corrected to match the endpoint
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  return [myEvents, loading, refetch];
};

export default useMyEvent;
