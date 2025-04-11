import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";
import { loginUser } from "../../features/user/userAuthActions";
import { FirebaseError } from "firebase/app";
import { AppDispatch } from "@src/redux/store";
import { FaGoogle } from "react-icons/fa";

const GoogleLoginButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email) {
        await dispatch(loginUser(user.email, user.uid));
        toast.success("Successfully logged in with Google!");
        navigate("/");
      } else {
        toast.error("No email found for this user.");
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        toast.error("Google login failed!");
        console.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
        console.error(error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2 mt-4">
      <FaGoogle className="text-lg" />
      Log In with Google
    </button>
  );
};

export default GoogleLoginButton;
