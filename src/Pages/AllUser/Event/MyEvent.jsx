import React from "react";
import useMyEvent from "../../../Hooks/useMyEvent";
import Swal from "sweetalert2";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
const MyEvent = () => {
  const [myEvents, loading, refetch] = useMyEvent();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const axiosPublic = useAxiosPublic();
  const [formData, setFormData] = React.useState({
    title: "",
    dateTime: "",
    location: "",
    description: "",
  });

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
          const response = await axiosPublic.delete(`/events/${eventId}`);
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
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the event.",
            icon: "error",
            timer: 1500,
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
    try {
      const response = await axiosPublic.put(
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
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the event.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-2xl font-semibold text-gray-700 animate-pulse">
          Loading Events...
        </div>
      </div>
    );
  }
  console.log(myEvents);
  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight">
        Upcoming Events
      </h2>
      {myEvents.length === 0 ? (
        <p className="text-center text-gray-500 text-lg font-medium bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          No events found at this time.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myEvents.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100"
              role="article"
              aria-labelledby={`event-title-${event._id}`}
            >
              <h3
                id={`event-title-${event._id}`}
                className="text-xl font-semibold text-gray-900 mb-4 truncate"
              >
                {event.title}
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Posted by:</span>{" "}
                  {event.name}
                </p>
                <p>
                  <span className="font-medium text-gray-800">
                    Date & Time:
                  </span>{" "}
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
                <p>
                  <span className="font-medium text-gray-800">Location:</span>{" "}
                  {event.location}
                </p>
                <p className="text-gray-700 line-clamp-3">
                  {event.description}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Attendees:</span>{" "}
                  {event.attendeeCount}
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
      )}
      <div className="flex justify-center mt-12">
        <button
          onClick={refetch}
          className="bg-gray-800 text-white py-3 px-8 rounded-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-colors duration-200"
          aria-label="Refresh events"
        >
          Refresh Events
        </button>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg transform scale-95 animate-modal-enter">
            <h3
              id="modal-title"
              className="text-2xl font-bold text-gray-900 mb-6"
            >
              Update Event
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="dateTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all duration-200"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3 transition-all duration-200"
                  rows="4"
                  required
                  aria-required="true"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                  aria-label="Cancel event update"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
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
