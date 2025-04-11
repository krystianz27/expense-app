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
      <div className="fixed left-0 right-0 z-50">
        <Navbar onToggleMenu={toggleMenu} />
      </div>
      {isMenuOpen && (
        <div className="overflow-y-scroll top-15 left-0 z-50">
          <LeftNavbar onClose={closeMenu} />
        </div>
      )}

      <div
        className={`fixed top-15 flex-1 px-2 my-2 mt-18 transition-all duration-300 ${
          isMenuOpen ? "ml-72 overflow-auto" : "ml-0 overflow-auto"
        } h-full`}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
