"use client";

import React from "react";
import useMyEvent from "../../../Hooks/useMyEvent";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const MyEvent = () => {
  const [myEvents, loading, refetch] = useMyEvent();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const axiosSecure = useAxiosSecure(); // Changed from useAxiosPublic to useAxiosSecure

  const [formData, setFormData] = React.useState({
    title: "",
    dateTime: "",
    location: "",
    description: "",
  });

  const [currentPage, setCurrentPage] = React.useState(1);
  const eventsPerPage = 8;

  const handleDelete = async (eventId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#2563eb",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Using axiosSecure instead of axiosPublic
          const response = await axiosSecure.delete(`/events/${eventId}`);
          if (response.status === 200) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Event has been deleted successfully.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (error) {
          console.error("Error deleting event:", error);

          // Better error handling
          let errorMessage = "An error occurred while deleting the event.";
          if (error.response?.status === 401) {
            errorMessage = "You are not authorized to delete this event.";
          } else if (error.response?.status === 403) {
            errorMessage = "You don't have permission to delete this event.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          Swal.fire({
            title: "Error!",
            text: errorMessage,
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    });
  };

  const handleUpdateClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
      location: event.location,
      description: event.description,
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (
      !formData.title.trim() ||
      !formData.dateTime ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fill in all required fields.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      // Using axiosSecure instead of axiosPublic
      const response = await axiosSecure.put(
        `/events/${selectedEvent._id}`,
        formData
      );

      if (response.status === 200) {
        setIsModalOpen(false);
        refetch();
        Swal.fire({
          title: "Success!",
          text: "Event updated successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);

      // Better error handling
      let errorMessage = "An error occurred while updating the event.";
      if (error.response?.status === 401) {
        errorMessage = "You are not authorized to update this event.";
      } else if (error.response?.status === 403) {
        errorMessage = "You don't have permission to update this event.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Close modal on Escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = myEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(myEvents.length / eventsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-gray-100">
        <div className="text-2xl font-semibold text-indigo-700 animate-pulse flex items-center gap-2">
          <svg
            className="animate-spin h-8 w-8 text-indigo-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading Events...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-gray-100 min-h-screen">
      <h2 className="text-4xl font-extrabold text-indigo-900 text-center mb-12 tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
        My Events
      </h2>

      {myEvents.length === 0 ? (
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <p className="text-gray-600 text-lg font-medium">
            No events found at this time.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-indigo-100 group"
                role="article"
                aria-labelledby={`event-title-${event._id}`}
              >
                <h3
                  id={`event-title-${event._id}`}
                  className="text-xl font-semibold text-indigo-900 mb-4 truncate group-hover:text-indigo-600 transition-colors"
                >
                  {event.title}
                </h3>

                <div className="space-y-3 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-indigo-800">
                      Posted by:
                    </span>
                    <span className="truncate">{event.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-indigo-800">
                      Date & Time:
                    </span>
                    <span>
                      {new Date(event.dateTime).toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-indigo-800">
                      Location:
                    </span>
                    <span className="truncate">{event.location}</span>
                  </p>
                  <p className="text-gray-700 line-clamp-3">
                    {event.description}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium text-indigo-800">
                      Attendees:
                    </span>
                    <span>{event.attendeeCount || 0}</span>
                  </p>
                </div>

                <div className="mt-5 flex space-x-4">
                  <button
                    onClick={() => handleUpdateClick(event)}
                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label={`Update event ${event.title}`}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                    aria-label={`Delete event ${event.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                aria-label="Previous page"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={refetch}
          className="bg-indigo-800 text-white py-3 px-8 rounded-lg font-medium hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Refresh events"
        >
          Refresh Events
        </button>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg transform scale-95 animate-modal-enter shadow-2xl">
            <h3
              id="modal-title"
              className="text-2xl font-bold text-indigo-900 mb-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text"
            >
              Update Event
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2.5 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="dateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2.5 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2.5 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2.5 px-3 transition-all duration-200"
                  rows="4"
                  required
                  aria-required="true"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 py-2.5 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Cancel event update"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2.5 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Save event changes"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvent;
