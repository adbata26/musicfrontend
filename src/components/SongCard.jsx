import React from "react";
import { Link } from "react-router-dom";

export default function SongCard({ song }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        {/* Thumbnail image if available */}
        {song.thumbnail ? (
          <img
            src={`http://localhost:3000${song.thumbnail}`}
            alt={song.title}
            className="w-16 h-16 object-cover rounded"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}

        {/* Song details */}
        <div>
          <p className="font-semibold text-lg text-gray-800 dark:text-white">
            {song.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {song.artist_name || "Unknown Artist"}
          </p>
          <p className="text-xs text-gray-400">{song.play_count} plays</p>
        </div>
      </div>

      <Link
        to={`/song/${song.id}`}
        className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
      >
        Play
      </Link>
    </div>
  );
}
