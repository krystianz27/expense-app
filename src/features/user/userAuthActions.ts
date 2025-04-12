import { loginSuccess, logout } from "./userSlice";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { AppDispatch } from "../../redux/store";

// Notification Token

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };

      dispatch(loginSuccess(userData));
      // await getUserToken(user.uid);
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        let errorMessage = "An unexpected error occurred.";

        switch (errorCode) {
          case "auth/invalid-credential":
            errorMessage = "Invalid credentials provided.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email address.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password.";
            break;
          case "auth/user-not-found":
            errorMessage = "No user found with this email.";
            break;
          case "auth/too-many-requests":
            errorMessage =
              "Too many failed login attempts. Please try again later.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "This email is already in use.";
            break;
          default:
            errorMessage = error.message || errorMessage;
            break;
        }

        throw new Error(errorMessage);
      } else {
        throw new Error("An unexpected error occurred.");
      }
    }
  };

export const loginWithProvider =
  (user: User) => async (dispatch: AppDispatch) => {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    dispatch(loginSuccess(userData));
    // await getUserToken(user.uid);
  };

export const logoutUser = () => async (dispatch: AppDispatch) => {
  try {
    await signOut(auth);
    dispatch(logout());
    // localStorage.removeItem("persist:root");
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        user: '{"user":null}',
      }),
    );
  } catch (error: unknown) {
    console.error("Logout Error:", error);
  }
};
