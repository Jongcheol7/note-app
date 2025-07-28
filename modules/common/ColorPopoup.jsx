import { SketchPicker } from "react-color";
import { useColorStore } from "@/store/useColorStore";
import { useColorMutation } from "@/hooks/notes/useColorMutation";

export default function ColorPopup({
  setShow,
  noteNo,
  setSelectedColor,
  setButtonAction,
}) {
  console.log("컬러 팝업창 진입");
  const { mutate, isPending } = useColorMutation();
  const { color, setColor } = useColorStore();

  const handleAdaptColor = (color) => {
    if (!color) return;

    // 새글이라면 zustand 에 컬러추가로 컬러 미리셋팅,
    // 그리고 부모 상태 변경
    if (!noteNo) {
      setColor(color);
      setSelectedColor(color);
      setShow(false);
      return;
    }

    // 새글이 아니라면 그 자리에서 컬러 db 저장
    mutate(
      {
        color: color,
        noteNo: noteNo,
      },
      {
        onSuccess: () => {
          setShow(false);
        },
      }
    );
  };

  return (
    <div>
      <div
        className="fixed bg-white left-1/2 -translate-x-1/2 
                top-1/2 -translate-y-1/2 rounded-xl z-50 pb-2"
      >
        <SketchPicker
          color={color}
          onChangeComplete={(color) => {
            setColor(color.hex);
            setSelectedColor(color.hex);
          }}
        />
        <div className="flex gap-3 justify-end mr-3">
          <button
            className="text-gray-600 font-bold"
            onClick={() => {
              setShow(false);
              setButtonAction(false);
            }}
            disabled={isPending}
          >
            취소
          </button>
          <button
            className="text-gray-600 font-bold"
            onClick={() => {
              handleAdaptColor(color);
              setButtonAction(false);
            }}
            disabled={isPending}
          >
            {false ? "적용중" : "적용"}
          </button>
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-20 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />
    </div>
  );
}
