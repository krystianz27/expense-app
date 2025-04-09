import React, { useState, useEffect, useRef } from "react";
import {
  updateProfile,
  sendEmailVerification,
  deleteUser,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth } from "@fbconfig/config";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@fbconfig/config";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";

interface ProfileFormData {
  displayName: string;
  photoURL: string;
}

const UserProfile: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isCamera, setIsCamera] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Preview of the captured photo
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setValue("displayName", user.displayName || "");
        setValue("photoURL", user.photoURL || "");
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setValue]);

  useEffect(() => {
    if (isCamera && videoRef.current) {
      // Umożliwiamy dostęp do kamery
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          console.error("Failed to access camera: ", err);
          toast.error("Failed to access camera.");
        });

      // Zatrzymanie strumienia wideo po zakończeniu pracy z kamerą
      return () => {
        stream?.getTracks().forEach((track) => track.stop());
      };
    }
  }, [isCamera]);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (!currentUser) {
    return (
      <p className="text-center mt-8">Please log in to see your profile.</p>
    );
  }

  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out successfully.");
  };

  const handleUpdateProfile: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      if (photoFile) {
        const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
        const snapshot = await uploadBytes(storageRef, photoFile);
        const url = await getDownloadURL(snapshot.ref);
        await updateProfile(currentUser, {
          displayName: data.displayName,
          photoURL: url,
        });
        setValue("photoURL", url);
      } else {
        await updateProfile(currentUser, {
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
      }
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleCameraOption = () => {
    setIsCamera(!isCamera);
    stopCameraStream();
  };

  const handleCaptureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context && videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        // Konwersja do pliku
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            setPhotoFile(file); // Ustawienie pliku w stanie
            const imageUrl = URL.createObjectURL(file); // Tworzymy URL dla podglądu
            setImagePreview(imageUrl); // Ustawiamy podgląd zdjęcia
            // Stop the video stream after capturing the photo
            stopCameraStream();
          }
        });
      }
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
      setStream(null); // Set stream to null
    }
  };

  const handleRetakeImage = () => {
    setImagePreview(null); // Usuwamy podgląd zdjęcia
    setIsCamera(true); // Wznowienie kamery

    // Ponownie uruchamiamy kamerę, jeśli została zatrzymana
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream); // Zaktualizowanie stanu strumienia
        }
      })
      .catch((err) => {
        console.error("Failed to access camera: ", err);
        toast.error("Failed to access camera.");
      });
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, currentUser.email!);
      toast.success("Password reset email sent.");
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
    <div className="max-w-lg mx-auto p-6 bg-zinc-50 rounded-lg shadow-md mt-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 text-center">
        User Profile
      </h2>

      {/* Avatar */}
      <div className="flex justify-center mt-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Display Name */}
      <div className="text-center mt-2 text-lg font-semibold text-gray-800">
        {currentUser.displayName}
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          {...register("displayName", { required: "Display name is required" })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.displayName && (
          <p className="text-red-500">
            {(errors.displayName as FieldError).message}
          </p>
        )}

        {/* Camera Option and File Input */}
        <div className="flex justify-between items-center mt-4 space-x-2">
          {/* File Input (Always visible) */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {/* Camera Option */}
          <button
            type="button"
            onClick={handleCameraOption}
            className="py-3 px-4 bg-blue-500 text-white rounded flex items-center justify-center space-x-2 min-w-[48px] h-full">
            <FaCamera />
          </button>
        </div>

        {/* Camera UI */}
        {isCamera && (
          <div className="mt-2">
            {imagePreview ? (
              <div>
                <img
                  src={imagePreview}
                  alt="Captured"
                  className="w-full h-auto rounded shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRetakeImage}
                  className="w-full mt-2 py-2 px-4 bg-yellow-500 text-white rounded">
                  Retake Photo
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-auto"
                style={{ borderRadius: "8px" }}
              />
            )}
            {!imagePreview && (
              <button
                type="button"
                onClick={handleCaptureImage}
                className="w-full mt-2 py-2 px-4 bg-green-500 text-white rounded">
                Capture Photo
              </button>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>
        )}

        <button
          type="submit"
          className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
          Update Profile
        </button>
      </form>

      {/* User Info and Actions */}
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
      </div>

      <button
        onClick={handleLogout}
        className="w-full mt-6 py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800 transition">
        Log Out
      </button>
    </div>
  );
};

export default UserProfile;
