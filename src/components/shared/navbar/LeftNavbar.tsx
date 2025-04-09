import { Link } from "react-router-dom";
import { FaHome, FaUserAlt, FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { UserState } from "@features/user/userTypes";
import { logoutUser } from "@features/user/userAuthActions";
import { AppDispatch } from "redux/store";

const LeftNavbar = ({
  onClose,
  className,
}: {
  onClose: () => void;
  className?: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: { user: UserState }) => state.user.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <div
      className={`top-15 left-0 fixed z-50 transition-all duration-300 ease-in-out ${
        className ?? ""
      } bg-gray-800 p-6 w-72 min-h-screen overflow-auto rounded-br-3xl shadow-lg border-t border-zinc-400 flex flex-col`}>
      <ul className="space-y-6 text-white flex-grow">
        <li>
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-600 transition-all duration-300">
            <FaHome className="text-xl" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-600 transition-all duration-300">
            <FaUserAlt className="text-xl" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-600 transition-all duration-300">
            <FaCog className="text-xl" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>

      <div className="my-auto space-y-4 pb-18">
        {!user ? (
          <>
            <Link
              to="/register"
              onClick={onClose}
              className="flex items-center justify-center space-x-3 p-3 rounded-md bg-blue-800 text-white hover:bg-blue-700 transition-all duration-300">
              <span>Register</span>
            </Link>
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center space-x-3 p-3 rounded-md bg-blue-800 text-white hover:bg-green-700 transition-all duration-300">
              <span>Login</span>
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 rounded-md bg-red-800 text-white hover:bg-red-700 transition-all duration-300">
            <span>Logout</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LeftNavbar;
