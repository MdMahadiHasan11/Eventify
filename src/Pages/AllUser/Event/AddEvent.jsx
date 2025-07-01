import { useForm } from "react-hook-form";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const AddEvent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      attendeeCount: 0,
    };

    try {
      const response = await axiosPublic.post("/events", payload);
      reset(); // Clear form after successful submission
      window.location.href = "/my event";
      Swal.fire({
        icon: "success",
        title: "Event Added!",
        text: `Event "${response.data.title}" has been successfully added.`,
        confirmButtonColor: "#4F46E5",
        confirmButtonText: "Great!",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add event. Please try again.",
        confirmButtonColor: "#EF4444",
        confirmButtonText: "Try Again",
      });
    }
  };
  const getCurrentDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all duration-300">
        <div>
          <h2 className="text-center text-4xl font-bold text-gray-900 tracking-tight">
            Create New Event
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fill in the details to schedule your event
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Event Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Event title is required" })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm p-3 border transition-colors duration-200"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Date and Time */}
            <div>
              <label
                htmlFor="dateTime"
                className="block text-sm font-medium text-gray-700"
              >
                Date and Time
              </label>
              <input
                id="dateTime"
                type="datetime-local"
                min={getCurrentDateTimeLocal()}
                {...register("dateTime", {
                  required: "Date and time are required",
                })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm p-3 border transition-colors duration-200"
              />

              {errors.dateTime && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.dateTime.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                {...register("location", { required: "Location is required" })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm p-3 border transition-colors duration-200"
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 sm:text-sm p-3 border transition-colors duration-200"
                placeholder="Enter event description"
                rows="5"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
