import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "@fbconfig/config";

import AvatarUploader from "./AvatarUploader";
import ProfileUpdateForm from "./ProfileUpdateForm";
import UserActions from "./UserActions";

const UserProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (!currentUser) {
    return (
      <p className="text-center mt-8">Please log in to see your profile.</p>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-zinc-50 rounded-lg shadow-md mt-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 text-center">
        User Profile
      </h2>

      <AvatarUploader currentUser={currentUser} />
      <ProfileUpdateForm currentUser={currentUser} />
      <UserActions currentUser={currentUser} />
    </div>
  );
};

export default UserProfile;
