import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformPlayer({ src, title, songID }) {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasCountedPlay, setHasCountedPlay] = useState(false);

  const incrementPlayCount = async () => {
    try {
      await fetch(`http://localhost:3000/api/songs/${songID}/play`, {
        method: "PATCH",
      });
    } catch (err) {
      console.error("Failed to increment play count:", err.message);
    }
  };

  useEffect(() => {
    // Create instance
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#a0aec0", // light gray
      progressColor: "#2563EB", // blue-600
      height: 80,
      responsive: true,
      normalize: true,
    });

    wavesurferRef.current.load(`http://localhost:3000${src}`);

    /* 
      
       Update duration
      ✅ What it does:
      This event fires when the audio file has been fully loaded and is ready to be played.

      🎯 Why it's used:
      Once ready, we can safely get the total duration of the audio track and display it in the player.

      🧠 Analogy: Like waiting for a video to finish buffering before showing the total length (e.g., “3:42”).
    */
    wavesurferRef.current.on("ready", () => {
      setDuration(wavesurferRef.current.getDuration());
    });

    /*
        ✅ What it does:
        This runs continuously while the audio is playing, kind of like a timer.

        🎯 Why it's used:
        It updates currentTime so your progress bar and current time display reflect the exact position of the audio.

        🧠 Analogy: Like a stopwatch that ticks every second while a song plays.
    */

    // Update current time
    wavesurferRef.current.on("audioprocess", () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    });

    /* 
      ✅ What it does:
      Fires once the audio track finishes playing completely.

      🎯 Why it's used:
      We set isPlaying to false so the play/pause button UI resets and reflects the "stopped" state.

      🧠 Analogy: Like when Spotify’s play button returns after the song ends.
    */

    // On finish
    wavesurferRef.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => wavesurferRef.current.destroy();
  }, [src]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);

      // Increment play count only the first time playback starts
      if (!hasCountedPlay && !isPlaying) {
        incrementPlayCount();
        setHasCountedPlay(true);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded shadow-md">
      <p className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
        {title || "Now Playing"}
      </p>

      <div ref={waveformRef} className="mb-3" />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <span className="text-xs text-gray-700 dark:text-gray-300">
          {formatTime(currentTime)}
        </span>

        <span className="text-xs text-gray-700 dark:text-gray-300 ml-auto">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
