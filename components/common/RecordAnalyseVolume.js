"use client";
import { useRef, useState } from "react";

export default function useVolumeAnalyser() {
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const [volumeHistory, setVolumeHistory] = useState([]);

  const startAnalyzingVolume = async (stream) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 64;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    source.connect(analyser);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    const update = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      const avg =
        dataArrayRef.current.reduce((a, b) => a + b, 0) /
        dataArrayRef.current.length;

      setVolumeHistory((prev) => {
        const next = [...prev, avg];
        return next.length > 80 ? next.slice(-80) : next;
      });

      animationRef.current = requestAnimationFrame(update);
    };

    update();
  };

  const stopAnalyzingVolume = () => {
    cancelAnimationFrame(animationRef.current);
    analyserRef.current = null;
  };

  return { volumeHistory, startAnalyzingVolume, stopAnalyzingVolume };
}
