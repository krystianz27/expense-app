import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import LeftNavbar from "./LeftNavbar";

const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div>
      <Navbar onToggleMenu={toggleMenu} />
      <div className="flex">
        {isMenuOpen && <LeftNavbar onClose={closeMenu} />}

        <div
          className={`flex-1 px-2 my-2 mt-18 transition-all duration-300 ${
            isMenuOpen ? "ml-72" : "ml-0"
          }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
