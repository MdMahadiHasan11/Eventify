import { useContext } from "react";
// import { AuthContext } from "../../../Layout/AuthProvider/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../../Layout/AuthProvider/AuthContext";

const Profile = () => {
  const { user, logOut } = useContext(AuthContext);

  console.log(user);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(`Failed to sign up: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-10">Please log in to view your profile.</p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-center text-3xl font-bold text-indigo-600">
          Profile
        </h2>
        <div className="mt-6 space-y-4">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Profile;
