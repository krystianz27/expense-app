import { FaBars, FaUserAlt } from "react-icons/fa";

const Navbar = ({ onToggleMenu }: { onToggleMenu: () => void }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleMenu} className="text-white">
          <FaBars size={24} />
        </button>
        <h1 className="text-xl">Expense Tracker</h1>
      </div>

      <div>
        <button className="text-white">
          <FaUserAlt size={24} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
