import { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Search, X, Filter } from "lucide-react";
import { isValid } from "date-fns";
// import useMyEvent from "../../../Hooks/useMyEvent";
import useAllEvent from "../../../Hooks/useAllEvent";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";

export default function EventsPage() {
  const axiosPublic = useAxiosPublic();
  const [events, loading, refetch] = useAllEvent();
  const [searchTitle, setSearchTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const user = {
    name: "Hasan",
    email: "hasan@gmain.com",
    user_id: "userXX",
  };

  const handleUpdateSubmit = async (e, event) => {
    e.preventDefault();
    // Check if the user has already joined
    if (event.attendees && event.attendees.includes(user.user_id)) {
      Swal.fire({
        title: "Already Joined!",
        text: "You have already joined this event.",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const response = await axiosPublic.patch(`/events/all/${event._id}`, {
        user_id: user.user_id,
      });
      if (response.status === 200) {
        refetch();
        Swal.fire({
          title: "Success!",
          text: "You have joined the event!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error joining event:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while joining the event.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Debugging logs
  console.log("Raw events from useMyEvent:", events);

  const getDateRanges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    currentWeekStart.setDate(today.getDate() - daysToMonday);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(currentWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    return {
      today,
      currentWeek: { start: currentWeekStart, end: currentWeekEnd },
      lastWeek: { start: lastWeekStart, end: lastWeekEnd },
      currentMonth: { start: currentMonthStart, end: currentMonthEnd },
      lastMonth: { start: lastMonthStart, end: lastMonthEnd },
    };
  };

  const isValidDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return isValid(date);
  };

  const isDateInRange = (dateTimeString, range) => {
    const date = new Date(dateTimeString);
    return isValid(date) && date >= range.start && date <= range.end;
  };

  const isSameDate = (dateTimeString, date2) => {
    const d1 = new Date(dateTimeString);
    return (
      isValid(d1) &&
      isValid(date2) &&
      d1.toDateString() === date2.toDateString()
    );
  };

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = Array.isArray(events) ? [...events] : [];
    console.log("Initial events count:", filtered.length);

    // Log invalid events for debugging
    const invalidEvents = filtered.filter(
      (event) =>
        !event ||
        !event.title ||
        typeof event.title !== "string" ||
        !event.dateTime ||
        !isValidDateTime(event.dateTime)
    );
    if (invalidEvents.length > 0) {
      console.warn("Invalid events filtered out:", invalidEvents);
    }

    // Filter events: require title and valid dateTime
    filtered = filtered.filter(
      (event) =>
        event &&
        event.title &&
        typeof event.title === "string" &&
        isValidDateTime(event.dateTime)
    );
    console.log("After basic filtering:", filtered.length);

    // Apply search filter
    if (searchTitle.trim()) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      console.log("After search filter:", filtered.length);
    }

    // Apply date filter
    const ranges = getDateRanges();
    if (selectedDate) {
      filtered = filtered.filter((event) =>
        isSameDate(event.dateTime, selectedDate)
      );
      console.log("After selectedDate filter:", filtered.length);
    } else if (dateRange) {
      switch (dateRange) {
        case "today":
          filtered = filtered.filter((event) =>
            isSameDate(event.dateTime, ranges.today)
          );
          break;
        case "currentWeek":
          filtered = filtered.filter((event) =>
            isDateInRange(event.dateTime, ranges.currentWeek)
          );
          break;
        case "lastWeek":
          filtered = filtered.filter((event) =>
            isDateInRange(event.dateTime, ranges.lastWeek)
          );
          break;
        case "currentMonth":
          filtered = filtered.filter((event) =>
            isDateInRange(event.dateTime, ranges.currentMonth)
          );
          break;
        case "lastMonth":
          filtered = filtered.filter((event) =>
            isDateInRange(event.dateTime, ranges.lastMonth)
          );
          break;
      }
      console.log("After dateRange filter:", filtered.length);
    }

    // Sort events by dateTime (descending)
    filtered.sort((a, b) => {
      const dateTimeA = new Date(a.dateTime);
      const dateTimeB = new Date(b.dateTime);
      return dateTimeB.getTime() - dateTimeA.getTime();
    });

    console.log("Final filteredAndSortedEvents:", filtered);
    return filtered;
  }, [events, searchTitle, selectedDate, dateRange]);

  const clearFilters = () => {
    setSearchTitle("");
    setSelectedDate(null);
    setDateRange("");
  };

  const hasActiveFilters = searchTitle.trim() || selectedDate || dateRange;

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
        <p className="text-gray-600 mb-6">
          Browse and search through all events
        </p>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" /> Search & Filter Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  if (date) setDateRange("");
                }}
                placeholderText="Select a date"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                dateFormat="MM/dd/yyyy"
              />
            </div>

            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                if (e.target.value) setSelectedDate(null);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select date range</option>
              <option value="today">Today</option>
              <option value="currentWeek">Current Week</option>
              <option value="lastWeek">Last Week</option>
              <option value="currentMonth">Current Month</option>
              <option value="lastMonth">Last Month</option>
            </select>

            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="inline w-4 h-4 mr-1" /> Clear Filters
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Showing {filteredAndSortedEvents.length} of{" "}
          {Array.isArray(events) ? events.length : 0} events
          {hasActiveFilters && " (filtered)"}
        </p>

        <div className="space-y-4">
          {filteredAndSortedEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters
                  ? "Try adjusting your search criteria or clear the filters."
                  : "There are no events to display at the moment. Check the console for invalid events."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 m-4 transform hover:-translate-y-2 hover:shadow-xl transition-all duration-300 ease-in-out max-w-sm w-full"
                >
                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 truncate bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <p className="text-sm text-gray-700 flex items-center">
                      <span className="font-semibold text-indigo-700 mr-2">
                        Posted by:
                      </span>
                      {event.name}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <span className="font-semibold text-indigo-700 mr-2">
                        Date & Time:
                      </span>
                      {new Date(event.dateTime).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <span className="font-semibold text-indigo-700 mr-2">
                        Location:
                      </span>
                      {event.location}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center">
                      <span className="font-semibold text-indigo-700 mr-2">
                        Attendees:
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {event.attendeeCount || 0}
                      </span>
                    </p>
                  </div>

                  {/* Join Button */}
                  <button
                    onClick={(e) => handleUpdateSubmit(e, event)}
                    className={`mt-5 w-full py-2.5 rounded-lg font-semibold text-white transition-all duration-200 ${
                      event.attendees && event.attendees.includes(user.user_id)
                        ? "bg-blue-200 text-black cursor-not-allowed opacity-75"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 shadow-md"
                    }`}
                    disabled={
                      event.attendees && event.attendees.includes(user.user_id)
                    }
                  >
                    {event.attendees && event.attendees.includes(user.user_id)
                      ? "Already Joined"
                      : "Join Event"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
