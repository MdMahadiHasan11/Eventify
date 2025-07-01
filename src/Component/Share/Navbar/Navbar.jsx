import { useContext, useState, useEffect, useRef } from "react";
// import { AuthContext } from '../../../Layout/AuthProvider/AuthProvider';
import { NavLink } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "../../../Layout/AuthProvider/AuthContext";

const Navbar = () => {
  const authContext = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  // Handle case where context might be null

  const handleSignOut = () => {
    logOut().catch((err) => console.error(err));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  if (!authContext) {
    return <div>Loading...</div>; // or some loading component
  }
  const { user, logOut, loading } = authContext;
  if (loading) {
    return <div>Loading...</div>; // or your loading component
  }
  console.log(user);
  return (
    <nav className="bg-indigo-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side - Mobile Menu Button */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Brand Name */}
        <NavLink
          to="/"
          className="flex gap-2 font-bold tracking-wide md:mr-auto"
        >
          <img src="/i.png" alt="Logo" className="w-6" />
          <p>Eventify</p>
        </NavLink>

        {/* Middle - Navigation Links (Large Screens) */}
        <div className="hidden md:flex gap-6 items-center justify-center flex-1">
          {["Home", "Events", "Add Event", "My Event"].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              className="hover:text-blue-400 transition"
            >
              {item}
            </NavLink>
          ))}
        </div>

        {/* Right Side - Profile/Login */}
        <div className="relative" ref={profileRef}>
          {user ? (
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
            >
              <img
                src={user.photoURL || "https://i.ibb.co/qW320MT/images.jpg"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <NavLink
              to="/login"
              className="hover:text-blue-400 flex items-center gap-1 transition"
            >
              Login <IoIosLogIn className="text-xl" />
            </NavLink>
          )}

          {/* Profile Dropdown */}
          {profileOpen && user && (
            <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-white shadow-lg rounded-md p-2 transition-all duration-300">
              <div className="block px-4 py-2 hover:bg-gray-700 rounded transition">
                {user?.username || user?.email}
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setProfileOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`md:hidden fixed top-16 left-0 w-1/2 bg-gray-900 text-white p-4 rounded-b-lg transition-all duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {["Home", "Events", "Add Event", "My Event"].map((item) => (
          <NavLink
            key={item}
            to={`/${item.toLowerCase()}`}
            className="block py-2 w-full text-center hover:scale-105 hover:bg-gray-700 transition-all duration-300"
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
