"use client";

import { ResizeImageIfNeeded } from "@/components/common/ResizeImageIfNeeded";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  List,
  Smile,
  ImagePlus,
  Mic,
  X,
  Pause,
  Check,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SquareCheckBig,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

const FONT_SIZES = ["14px", "16px", "20px", "24px", "28px", "32px"];

export default function NoteToolbar({ editor }) {
  const fileInputRef = useRef(null);
  const [isRecordClick, setIsRecordClick] = useState(false); //녹음 창 올릴지 정하기
  const [recording, setRecording] = useState(false); //녹음 시작버튼을 눌렀는지지
  const [isPaused, setIsPaused] = useState(false); //일시시정지 버튼을 눌렀는지
  const [recordTime, setRecordTime] = useState(0);
  const intervalRef = useRef(null);
  const recorderRef = useRef(null);
  const [isShowColor, setIsShowColor] = useState(false);

  const { data: session, status } = useSession();
  //console.log("session email : ", session?.user.email);

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
    setRecording(true);
  };

  const stopRecording = () => {
    const tracks = recorderRef.current?.stream?.getTracks?.();
    tracks?.forEach((track) => track.stop()); // 마이크 해제
    recorderRef.current?.stop();
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

  // 녹음 파일 메서드
  const handleRecordClick = () => {
    if (!recorderRef.current) return;

    recorderRef.current.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(blob);

      // editor
      //   .chain()
      //   .focus()
      //   .insertContent(`<div data-audio="${audioUrl}"></div>`)
      //   .run();
      editor.commands.insertContent({
        type: "audioBlock",
        attrs: {
          src: audioUrl,
        },
      });
    };

    recorderRef.current.stop(); // 여기에 stop 있어야 함
  };

  // 사진 파일 첨부 메서드
  const MAX_IMAGES = 20; //글당 최대 이미지 갯수 제한 2개
  const MAX_FILE_SIZE_MB = 2; // 개별 이미지 최대 허용 파일 크기 (MB) - 이 용량을 넘으면 경고 후 처리 중단
  const MAX_IMAGE_WIDTH = 1200; // 최대 이미지 너비 (픽셀) - 이 너비를 넘으면 리사이징
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    //if (session?.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    //  alert("관리자만 이미지를 업로드할 수 있습니다.");
    //  fileInputRef.current.value = "";
    //  return;
    //}

    // 1. 파일 크기 검사
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`이미지 크기는 ${MAX_FILE_SIZE_MB}MB 이하만 가능합니다.`);
      fileInputRef.current.value = "";
      return;
    }

    // 2. 현재 에디터에 삽입된 base64 이미지 개수 세기
    const currentImageCount = (
      editor.getHTML().match(/<img[^>]*src="data:image\/[^;]*;base64[^>]*>/g) ||
      []
    ).length;

    if (currentImageCount >= MAX_IMAGES) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지만 첨부할 수 있습니다.`);
      fileInputRef.current.value = "";
      return;
    }

    // 3. FileReader로 base64 변환 → 에디터 삽입
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = reader.result;

      // ⛔ 너무 큰 경우 → 리사이징
      const resizedBase64 = await ResizeImageIfNeeded(base64, MAX_IMAGE_WIDTH);

      // ✅ 에디터에 base64 이미지 삽입
      editor.commands.insertContent({
        type: "resizableImage",
        attrs: {
          src: resizedBase64,
        },
      });
    };

    reader.readAsDataURL(file);
    console.log("editor.getHTML() : ", editor.getHTML());
  };

  return (
    <>
      {/* 녹음버튼 슬라이스 */}
      <div
        className={`
                fixed bottom-0 left-1/2 -translate-x-1/2 sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col gap-5 py-4 px-10 h-45 w-full bg-white z-40 font-bold
                transform transition-transform duration-300
                ${isRecordClick ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <span className="w-full text-center">{formatTime(recordTime)}</span>

        <div className="flex justify-between px-36">
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
                setIsPaused(true);
              } else {
                recorderRef.current?.resume();
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
      <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl  mx-auto bg-amber-100 border border-gray-300 rounded-xl px-4 py-2  flex justify-around items-center">
        {/* 글자크기 버튼 */}
        <select
          onChange={(e) => {
            editor.chain().focus().setFontSize(e.target.value).run();
          }}
          defaultValue=""
          className="w-20 h-8 px-2 bg-transparent text-sm border border-gray-300 rounded-md  shadow-sm focus:outline-none focus:ring-2 focus:ring-red-700"
        >
          <option value="" disabled>
            크기
          </option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size.replace("px", "")}
            </option>
          ))}
        </select>

        {/* 두껍게 버튼 */}
        <Bold
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleBold().run()}
        />

        {/* 정렬 버튼 */}
        <AlignLeft
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        />
        <AlignCenter
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        />
        <AlignRight
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        />

        {/* 이미지 업로드 버튼 */}
        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageSelect}
        />
        <ImagePlus
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => fileInputRef.current?.click()}
        />

        {/* 녹은 버튼 */}
        <Mic
          className="w-5 h-5 cursor-pointer hover:text-red-700"
          onClick={() => {
            alert("관리자만 사용가능");
            return false;
            //setIsRecordClick(true);
          }}
        />
        {/* 리스트 버튼 */}
        <List
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />

        {/* To-Do 버튼 */}
        <SquareCheckBig
          className="w-5 h-5  cursor-pointer hover:text-red-700"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        />

        {/* 이모티콘 버튼 */}
        <Smile
          className={`w-5 h-5 cursor-pointer hover:text-red-700`}
          onClick={() => editor.chain().focus().insertContent("📝").run()}
        />

        {/* 글자색 버튼 */}
        <Paintbrush
          className={`cursor-pointer hover:text-red-700 ${
            isShowColor ? "text-red-700" : ""
          }`}
          onClick={() => setIsShowColor(!isShowColor)}
        />
      </div>

      {isShowColor && (
        <div className="absolute bottom-0 right-0">
          <HexColorPicker
            onChange={(newColor) => {
              editor.chain().focus().setColor(newColor).run();
            }}
          />
        </div>
      )}
    </>
  );
}
