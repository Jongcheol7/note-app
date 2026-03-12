import { useCategoryMutation } from "@/hooks/category/useCategoryMutation";
import { useRef } from "react";
import Popup from "@/components/common/Popup";

interface CategoryPopupProps {
  show?: boolean;
  setShow: (v: boolean) => void;
  refetch: () => void;
}

export default function CategoryPopup({ setShow, refetch }: CategoryPopupProps) {
  const sampleList = ["쇼핑", "개인적인", "일기", "학교"];
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useCategoryMutation();

  const handleAddCategory = (categoryName: string | undefined) => {
    if (!categoryName) return;
    mutate(
      {
        categoryName: categoryName,
      },
      {
        onSuccess: () => {
          setShow(false);
          refetch();
        },
      }
    );
  };

  return (
    <Popup onClose={() => setShow(false)} className="pt-8 pb-5">
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
            onClick={() => { if (inputRef.current) inputRef.current.value = sample; }}
          >
            {sample}
          </li>
        ))}
      </ul>
      <div className="flex gap-5 justify-end mr-6">
        <button
          className="text-blue-500 font-bold"
          onClick={() => setShow(false)}
          disabled={isPending}
        >
          취소
        </button>
        <button
          className="text-blue-500 font-bold"
          onClick={() => handleAddCategory(inputRef.current?.value)}
          disabled={isPending}
        >
          {isPending ? "추가중" : "추가"}
        </button>
      </div>
    </Popup>
  );
}
