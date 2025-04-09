import React, { useEffect, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase/config";
import { loginSuccess, logout } from "@features/user/userSlice";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface PersistAuthProps {
  children: ReactNode;
}

const PersistAuth: React.FC<PersistAuthProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user: FirebaseUser | null) => {
        if (user) {
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
          dispatch(loginSuccess(userData));
        } else {
          dispatch(logout());
        }
      },
    );

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default PersistAuth;
