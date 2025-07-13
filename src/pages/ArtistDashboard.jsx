import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import SongCard from "../components/SongCard";

export default function ArtistDashboard() {
  const { secureFetch, user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [totalPlays, setTotalPlays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSongs = async () => {
      try {
        const res = await secureFetch(
          `http://localhost:3000/api/songs/artist-songs`,
          {
            method: "GET",
          }
        );
        // We will not pass any id anymore for the user, because we will based it from JWT token
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch songs");

        setSongs(data.songs);

        const total = data.songs.reduce(
          (acc, song) => acc + song.play_count,
          0
        );
        setTotalPlays(total);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [user]);


  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">🎤 Artist Dashboard</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Welcome, {user?.name}! Here's your song performance summary.
      </p>

      {loading ? (
        <p>Loading songs...</p>
      ) : (
        <>
          <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-800 rounded">
            <p className="text-lg font-semibold">
              📈 Total Plays:{" "}
              <span className="text-blue-700 dark:text-white">
                {totalPlays}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            {songs.length === 0 ? (
              <p>You haven't uploaded any songs yet.</p>
            ) : (
              songs.map((song) => <SongCard key={song.id} song={song} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
