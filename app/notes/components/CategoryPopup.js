import { useRef } from "react";

export default function CategoryPopup({ onCancel, onAdd }) {
  const sampleList = ["쇼핑", "개인적인", "일기", "학교"];
  const inputRef = useRef();
  return (
    <div
      className="fixed bg-white left-1/2 -translate-x-1/2 
                top-1/2 -translate-y-1/4 pt-8 pb-5 rounded-xl z-50 shadow-lg"
    >
      <p className="text-2xl font-bold text-center">새 카테고리 추가</p>
      <input
        className="bg-gray-200 px-3 py-3 mx-5 w-[300px] rounded-lg my-3"
        placeholder="새 카테고리를 위한 이름"
        ref={inputRef}
      />
      <ul className="flex flex-wrap gap-2 mb-5 px-3">
        {sampleList.map((sample) => (
          <li
            key={sample}
            className="bg-gray-200 rounded-2xl px-2 py-1 cursor-pointer"
            onClick={(e) => (inputRef.current.value = sample)}
          >
            {sample}
          </li>
        ))}
      </ul>
      <div className="flex gap-5 justify-end mr-6">
        <button className="text-blue-500 font-bold" onClick={onCancel}>
          취소
        </button>
        <button
          className="text-blue-500 font-bold"
          onClick={() => {
            //oncancel();
            console.log(inputRef.current.value);
            return onAdd(inputRef.current.value);
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}
