import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/config";
import { loginWithProvider } from "../../features/user/userAuthActions";
import { FirebaseError } from "firebase/app";
import { AppDispatch } from "@src/redux/store";
import { FaGithub } from "react-icons/fa";

const GithubLoginButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await dispatch(loginWithProvider(user));
        toast.success("Successfully logged in with GitHub!");
        navigate("/");
      } else {
        toast.error("No email found for this user.");
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        toast.error("GitHub login failed!");
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
      onClick={handleGithubLogin}
      className="w-full p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2">
      <FaGithub className="text-lg" />
      Log In with GitHub
    </button>
  );
};

export default GithubLoginButton;
