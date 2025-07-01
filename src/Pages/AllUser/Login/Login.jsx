import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { getAuth } from "firebase/auth";
// import app from "../../../../firebase.config";
// import { AuthContext } from "../../../Layout/AuthProvider/AuthProvider";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { AuthContext } from "../../../Layout/AuthProvider/AuthContext";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  // const auth = getAuth(app);
  // const captchaRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    const result = await signIn(email, password);

    if (result.success) {
      toast.success("Successfully Logged In");
      navigate(location?.state || "/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white shadow-2xl rounded-xl w-full max-w-md"
      >
        <h2 className="text-center text-4xl font-extrabold text-indigo-600">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            className={`w-full py-2 rounded-md text-white font-bold ${"bg-indigo-600 hover:bg-indigo-700"}`}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Do not have an account?{" "}
          <Link
            to="/signUp"
            className="text-indigo-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          pauseOnHover
          theme="light"
        />
      </motion.div>
    </div>
  );
};
export default Login;
