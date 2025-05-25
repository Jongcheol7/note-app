"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export default function AudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const formatTime = (t) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(
      Math.floor(t % 60)
    ).padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between p-3 border rounded bg-white shadow w-full">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button onClick={togglePlay}>
        {playing ? (
          <Pause className="w-6 h-6 text-red-500" />
        ) : (
          <Play className="w-6 h-6 text-blue-500" />
        )}
      </button>
      <div className="flex-1 mx-3 h-[6px] bg-gray-200 rounded overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-200"
          style={{
            width: `${
              ((audioRef.current?.currentTime || 0) /
                (audioRef.current?.duration || 1)) *
              100
            }%`,
          }}
        ></div>
      </div>
      <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
    </div>
  );
}
