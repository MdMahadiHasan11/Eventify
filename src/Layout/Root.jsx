import { Outlet } from "react-router-dom";
import Navbar from "../Component/Share/Navbar/Navbar";
import Footer from "../Component/Share/Footer/Footer";

const Root = () => {
  return (
    <div>
      <div className="min-h-screen px-10">
        <Navbar></Navbar>
        <Outlet></Outlet>
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Root;
