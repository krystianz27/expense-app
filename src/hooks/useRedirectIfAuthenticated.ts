import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";

export const useRedirectIfAuthenticated = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("Redirect check - user:", user);
    if (user && user.uid) {
      navigate("/");
    }
  }, [user, navigate]);
};
