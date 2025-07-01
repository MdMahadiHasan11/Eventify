import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Root from "./Root";
import Home from "../Pages/AllUser/HomePage/Home";
import Register from "../Pages/AllUser/Register/Register";
import Login from "../Pages/AllUser/Login/Login";
import PrivateRoute from "./PrivateRoute/PrivateRoute";
import AllEvent from "../Pages/AllUser/Event/AllEvent";
import AddEvent from "../Pages/AllUser/Event/AddEvent";
import MyEvent from "../Pages/AllUser/Event/MyEvent";
import Profile from "../Pages/AllUser/Profile/Profile";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Main layout component
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/events",
        element: (
          <PrivateRoute>
            <AllEvent />
          </PrivateRoute>
        ),
      },

      {
        path: "/my event",
        element: (
          <PrivateRoute>
            <MyEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/add event",
        element: (
          <PrivateRoute>
            <AddEvent />
          </PrivateRoute>
        ),
      },
      {
        path: "/signUp",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/profile",

        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "/about",
      //   element: (
      //     <PrivateRoute>
      //       <About />
      //     </PrivateRoute>
      //   ),
      // },
      // {
      //     path: "/messages",
      //     element: <Message></Message>
      // },
    ],
  },
]);

export default Router;
