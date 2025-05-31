"use client";

import {
  Bold,
  List,
  Smile,
  ImagePlus,
  Mic,
  X,
  Pause,
  Check,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import useVolumeAnalyser from "@/components/common/RecordAnalyseVolume";

export default function NoteToolbar({ editor }) {
  const fileInputRef = useRef(null);
  const [isRecordClick, setIsRecordClick] = useState(false);
  const [recording, setRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const intervalRef = useRef(null);
  const { volumeHistory, startAnalyzingVolume, stopAnalyzingVolume } =
    useVolumeAnalyser();
  const recorderRef = useRef(null);

  // 녹음 시작시 감지해서 실행됨
  useEffect(() => {
    if (recording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [recording, isPaused]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorderRef.current = new MediaRecorder(stream);
    recorderRef.current.start();
    startAnalyzingVolume(stream);
    setRecording(true);
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    stopAnalyzingVolume();
    setRecording(false);
    setIsPaused(false);
    setRecordTime(0); // 필요시 초기화
    setIsRecordClick(false);
  };

  if (!editor) return null;

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleRecordClick = () => {
    if (!recorderRef.current) return;

    recorderRef.current.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);

      editor
        .chain()
        .focus()
        .insertContent(`<div data-audio="${audioUrl}"></div>`)
        // .insertContent(`<audio controls src="${audioUrl}"></audio>`)
        .run();
    };

    recorderRef.current.stop(); // 여기에 stop 있어야 함
  };

  // 사진 파일 첨부 메서드
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;

      editor.commands.insertContent({
        type: "resizableImage",
        attrs: {
          src: base64,
          width: "300px", // 원하는 기본 사이즈
          height: "auto",
        },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* 녹음버튼 슬라이스 */}
      <div
        className={`
                fixed bottom-0 left-1/2 -translate-x-1/2 max-w-2xl mx-auto flex flex-col gap-5 py-4 px-10 h-45 w-full bg-white z-40 font-bold
                transform transition-transform duration-300
                ${isRecordClick ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <span className="w-full text-center">{formatTime(recordTime)}</span>
        <div className="w-full flex items-end h-8 overflow-hidden gap-[1px]">
          {volumeHistory.map((val, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gray-400 rounded min-w-[1px]"
              style={{
                height: `${(val / 255) * 100 * 3}%`,
                transition: "height 0.1s linear",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setIsRecordClick(false)}
            className="flex flex-col items-center gap-1"
          >
            <X className="w-6 h-6 text-gray-600" />
            <p className="text-xs text-gray-700">취소</p>
          </button>
          <button
            onClick={() => {
              if (!recording) {
                startRecording();
              } else if (!isPaused) {
                recorderRef.current?.pause();
                stopAnalyzingVolume();
                setIsPaused(true);
              } else {
                recorderRef.current?.resume();
                startAnalyzingVolume(recorderRef.current.stream); // resume 시 다시 분석 시작
                setIsPaused(false);
              }
            }}
            className="flex flex-col items-center gap-1"
          >
            {recording ? (
              <Pause className="w-6 h-6 text-red-500" />
            ) : (
              <Mic className="w-6 h-6 text-red-500" />
            )}
            <p className="text-xs text-gray-700">녹음</p>
          </button>
          <button
            onClick={() => {
              handleRecordClick();
              stopRecording();
            }}
            className="flex flex-col items-center gap-1"
          >
            {" "}
            <Check className="w-6 h-6 text-blue-600" />
            <p className="text-xs text-gray-700">끝</p>
          </button>
        </div>
      </div>

      {/* 기본 툴바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto bg-white border-t px-4 py-2  flex justify-around">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-5 h-5" />
        </button>
        {/* 이미지 업로드 */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <button onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="w-5 h-5" />
        </button>
        <button onClick={() => setIsRecordClick(true)}>
          <Mic className="w-5 h-5" />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent("📝").run()}
        >
          <Smile className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
