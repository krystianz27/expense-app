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
    <div className="flex">
      <div className="absolute left-0 right-0 z-50">
        <Navbar onToggleMenu={toggleMenu} />

        {isMenuOpen && (
          <div className="top-15 fixed left-0 z-50 overflow-y-auto w-72 bg-gray-800 shadow-lg h-full rounded-br-3xl">
            <LeftNavbar onClose={closeMenu} />
          </div>
        )}
      </div>

      <div
        className={`mt-18 flex-1 px-2 mb-10 transition-all duration-300 ${
          isMenuOpen ? "ml-72" : "ml-0"
        } h-full overflow-auto`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
