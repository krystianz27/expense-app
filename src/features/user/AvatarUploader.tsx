import React, { useState, useRef, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { storage } from "@fbconfig/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { User, updateProfile } from "firebase/auth";

interface AvatarUploaderProps {
  currentUser: User | null;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ currentUser }) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isCamera, setIsCamera] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    currentUser?.photoURL || null,
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      stopCameraStream();
      setIsCamera(false);
    }
  };

  const handleCameraOption = () => {
    if (!isCamera) {
      setImagePreview(null);
      setPhotoFile(null);
      setIsCamera(true);
    } else {
      stopCameraStream();
      setIsCamera(false);
    }
  };

  const handleCaptureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context && videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            setPhotoFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            stopCameraStream();
          }
        });
      }
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleRetakeImage = () => {
    setImagePreview(null);
    setPhotoFile(null);
    stopCameraStream();
    setIsCamera(true); // Ustawiamy kamerę na true, aby ją ponownie uruchomić
  };

  const handleUploadPhoto = async () => {
    if (!currentUser || !photoFile) return;

    try {
      const storageRef = ref(storage, `profile_pictures/${currentUser.uid}`);
      const snapshot = await uploadBytes(storageRef, photoFile);
      const url = await getDownloadURL(snapshot.ref);

      await updateProfile(currentUser, {
        photoURL: url,
      });

      setImagePreview(url);
      setPhotoFile(null);
      toast.success("Photo updated successfully!");
    } catch (err) {
      console.error("Failed to update profile photo:", err);
      toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    if (isCamera && videoRef.current && !stream) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          if (isMounted && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
          }
        })
        .catch((err) => {
          console.error("Failed to access camera: ", err);
          toast.error("Failed to access camera.");
          setIsCamera(false); // Jeśli nie uda się otworzyć kamery, zatrzymujemy ją
        });
    } else if (!isCamera && stream) {
      stopCameraStream(); // Jeśli kamera jest wyłączona, zatrzymujemy strumień
    }

    return () => {
      isMounted = false;
      stopCameraStream(); // Gwarantujemy, że strumień zostanie zatrzymany przy demontażu
    };
  }, [isCamera, stream, stopCameraStream]);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setImagePreview(currentUser.photoURL);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center mt-4 space-y-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow">
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        )}
      </div>

      {currentUser.displayName && (
        <div className="mt-2 text-center text-gray-800 font-semibold">
          {currentUser.displayName}
        </div>
      )}

      <div className="flex space-x-4 w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={handleCameraOption}
          className="py-3 px-4 bg-blue-500 text-white rounded flex items-center justify-center">
          <FaCamera />
        </button>
      </div>

      {isCamera && (
        <div className="mt-2 w-full">
          {!imagePreview ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                className="w-full h-auto rounded"
              />
              <button
                type="button"
                onClick={handleCaptureImage}
                className="w-full mt-2 py-2 px-4 bg-green-500 text-white rounded">
                Capture Photo
              </button>
            </>
          ) : (
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
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      <button
        onClick={handleUploadPhoto}
        className="w-full mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Upload Photo
      </button>
    </div>
  );
};

export default AvatarUploader;
