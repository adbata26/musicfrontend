import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AudioPlayer from "../components/AudioPlayer";

export default function SongDetails() {
  const { id } = useParams(); // song ID from URL
  const [song, setSong] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/songs/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load song");
        setSong(data.song);
      } catch (err) {
        console.error(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  if (loading) return <p className="p-4">Loading song...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!song) return <p className="p-4">Song not found.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{song.title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
        by {song.artist_name || "Unknown Artist"} · {song.play_count} plays
      </p>

      {song.thumbnail && (
        <img
          src={`https://musicbackend-b7il.onrender.com/${song.thumbnail}`}
          alt={song.title}
          className="mb-6 w-full max-h-64 object-cover rounded"
        />
      )}

      <AudioPlayer src={song.audio_url} title={song.title} songID={song.id} />
    </div>
  );
}
