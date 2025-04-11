/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

interface UploadPhotoProps {
  currentUserUid: string;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  photoFile: File | null;
  setValue: (name: string, value: any) => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({
  setPhotoFile,
  setImagePreview,
}) => {
  const [isCamera, setIsCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imagePreview, setImagePreviewState] = useState<string | null>(null); // Added state for imagePreview
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isCamera && videoRef.current) {
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

      return () => {
        stream?.getTracks().forEach((track) => track.stop());
      };
    }
  }, [isCamera, stream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleCameraOption = () => setIsCamera(!isCamera);

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
            setImagePreviewState(imageUrl);
            setImagePreview(imageUrl);
          }
        });
      }
    }
  };

  const handleRetakeImage = () => {
    setImagePreviewState(null);
    setIsCamera(true);
  };

  return (
    <div className="flex justify-between items-center mt-4 space-x-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <button
        type="button"
        onClick={handleCameraOption}
        className="py-3 px-4 bg-blue-500 text-white rounded flex items-center justify-center space-x-2 min-w-[48px] h-full">
        <FaCamera />
      </button>

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
            <video ref={videoRef} autoPlay className="w-full h-auto" />
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
    </div>
  );
};

export default UploadPhoto;
