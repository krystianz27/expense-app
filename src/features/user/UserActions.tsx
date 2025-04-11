/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { auth } from "@fbconfig/config";
import {
  sendEmailVerification,
  deleteUser,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface UserActionsProps {
  currentUser: User | null;
}

const UserActions: React.FC<UserActionsProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  if (!currentUser) {
    return <p>Please log in to view actions.</p>;
  }

  const handleLogout = () => {
    auth.signOut();

    toast.success("Logged out successfully.");
    navigate("/");
  };

  const handleResetPassword = async () => {
    try {
      if (currentUser?.email) {
        await sendPasswordResetEmail(auth, currentUser.email);
        toast.success("Password reset email sent.");
      }
    } catch (error) {
      toast.error("Failed to send reset email.");
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(currentUser);
      toast.success("Verification email sent.");
    } catch (error) {
      toast.error("Failed to send verification email.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );

    if (confirmation) {
      try {
        await deleteUser(currentUser);
        toast.success("Account deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete account.");
      }
    }
  };

  return (
    <div className="space-y-2 mt-6">
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>User ID:</strong> {currentUser.uid}
      </p>

      {!currentUser.emailVerified && (
        <button
          onClick={handleSendVerification}
          className="w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
          Send Email Verification
        </button>
      )}

      <button
        onClick={handleResetPassword}
        className="w-full py-2 px-4 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
        Send Password Reset Email
      </button>

      <button
        onClick={handleDeleteAccount}
        className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition">
        Delete Account
      </button>

      <button
        onClick={handleLogout}
        className="w-full mt-6 py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
        Log Out
      </button>
    </div>
  );
};

export default UserActions;
