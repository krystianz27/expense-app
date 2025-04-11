import { FaBars, FaUserAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaReceipt, FaMoneyBillTrendUp } from "react-icons/fa6";
import { MdAddBox, MdCategory } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";

const Navbar = ({ onToggleMenu }: { onToggleMenu: () => void }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center space-x-4">
        <button onClick={onToggleMenu} className="text-white">
          <FaBars size={24} />
        </button>
        <Link
          to="/"
          className="items-center space-x-2 rounded-md hover:text-gray-400 transition-all duration-300">
          <span>
            <h1 className="text-xl">Expense Tracker</h1>
          </span>
        </Link>
      </div>

      <div className="hidden sm:flex items-center space-x-3">
        <Link
          to="/dashboard"
          className="hidden md:flex items-center space-x-2 rounded-md hover:bg-gray-600 transition-all duration-300">
          <AiFillDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/expenses"
          className="flex items-center space-x-2 hover:text-gray-400 transition-all duration-300">
          <FaReceipt size={20} />
          <span>Expenses</span>
        </Link>
        <Link
          to="/expense/add"
          className="flex items-center space-x-2 hover:text-gray-400 transition-all duration-300">
          <FaMoneyBillTrendUp className="text-xl" />
          <span>Add Expense</span>
        </Link>
        <Link
          to="/categories"
          className="flex items-center space-x-2 hover:text-gray-400 transition-all duration-300">
          <MdCategory size={20} />
          <span>Categories</span>
        </Link>
        <Link
          to="/category/add"
          className="hidden xl:flex items-center space-x-2 rounded-md hover:bg-gray-600 transition-all duration-300">
          <MdAddBox size={20} />
          <span>Add Category</span>
        </Link>
        <Link
          to="/budgets"
          className="flex items-center space-x-2 hover:text-gray-400 transition-all duration-300">
          <FaMoneyBillTrendUp size={20} />
          <span>Budgets</span>
        </Link>
      </div>

      <div>
        <Link
          to="/profile"
          className="flex items-center rounded-md hover:bg-gray-600 transition-all duration-300">
          <FaUserAlt className="text-xl" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
