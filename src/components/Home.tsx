import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      {/* Hero section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 text-center bg-white shadow-sm">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Expense Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your expenses, manage your budget, and take control of your
            finances — all in one place.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow">
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-xl shadow">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why use Expense Tracker?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Simple Tracking</h3>
            <p className="text-gray-600">
              Quickly add your daily expenses and keep everything organized
              effortlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Visual Insights</h3>
            <p className="text-gray-600">
              Get charts and statistics that help you understand your spending
              habits.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
            <p className="text-gray-600">
              Your data is securely stored and only accessible to you.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Expense Tracker. All rights reserved.
      </footer>
    </main>
  );
};

export default Home;
