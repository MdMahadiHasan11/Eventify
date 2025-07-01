// Hooks/useAllEvent.js
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";

const useAllEvent = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: events = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events/all");
      return res.data;
    },
  });

  return [events, loading, refetch];
};

export default useAllEvent;
