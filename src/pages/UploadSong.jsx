import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../auth/AuthProvider";

export default function UploadSong() {
  const { user, secureFetch } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("audio", data.audio[0]);
    if (data.thumbnail && data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    formData.append("artist_id", user.id);

    try {
      const res = await secureFetch("http://localhost:3000/api/songs/upload", {
        method: "POST",
        body: formData,
        // 👇 DO NOT manually set Content-Type here!
        // Headers will be auto-handled by FormData
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Upload failed");

      setSuccess("Song uploaded successfully!");
      reset();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🎵 Upload New Song
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Audio File (.mp3)</label>
          <input
            type="file"
            accept="audio/mp3"
            className="w-full"
            {...register("audio", { required: "Audio file is required" })}
          />
          {errors.audio && (
            <p className="text-red-500 text-sm">{errors.audio.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Thumbnail Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            {...register("thumbnail")}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Upload Song
        </button>
      </form>
    </div>
  );
}
