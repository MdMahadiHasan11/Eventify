import { useCallback, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const useMyEvent = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosSecure.get("/events");
      setMyEvents(response.data);
    } catch (error) {
      console.error("Error fetching my events:", error);
      setMyEvents([]);
    } finally {
      setLoading(false);
    }
  }, [axiosSecure, setMyEvents, setLoading]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return [myEvents, loading, fetchEvents];
};
export default useMyEvent;
