import React from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { toast } from "react-toastify";

interface ProfileUpdateFormProps {
  currentUser: User | null;
}

interface ProfileFormData {
  displayName: string;
  email: string;
  password: string;
}

const ProfileUpdateForm: React.FC<ProfileUpdateFormProps> = ({
  currentUser,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>();

  React.useEffect(() => {
    if (currentUser) {
      setValue("displayName", currentUser.displayName || "");
      setValue("email", currentUser.email || "");
    }
  }, [currentUser, setValue]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!currentUser) return;

    try {
      // Update displayName
      if (data.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: data.displayName,
        });
        toast.success("Display name updated.");
      }

      if (data.email !== currentUser.email) {
        await updateEmail(currentUser, data.email);
        toast.success("Email updated.");
      }

      if (data.password) {
        await updatePassword(currentUser, data.password);
        toast.success("Password updated.");
      }

      reset({ ...data, password: "" });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase Error:", error.code, error.message);
        toast.error("Update failed: " + error.message);
      } else {
        console.error("Unknown Error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Display Name
        </label>
        <input
          {...register("displayName", {
            required: "Display name is required",
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.displayName && (
          <p className="text-red-500">
            {(errors.displayName as FieldError).message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.email && (
          <p className="text-red-500">{(errors.email as FieldError).message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          {...register("password", {
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="Leave blank to keep current password"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {errors.password && (
          <p className="text-red-500">
            {(errors.password as FieldError).message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        {isSubmitting ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileUpdateForm;
