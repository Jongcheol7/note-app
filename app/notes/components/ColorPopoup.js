import { useState } from "react";
import { SketchPicker } from "react-color";
import { useColorMutation } from "../hooks/useColorMutation";

export default function ColorPopup({ show, setShow, refetch, noteNo }) {
  const [selectedColor, setSelectedColor] = useState("#FEF3C7");
  const { mutate, isPending } = useColorMutation();

  const handleAdaptColor = (color) => {
    if (!color) return;
    mutate(
      {
        color: color,
        noteNo: noteNo,
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
    <>
      {show && (
        <div>
          <div
            className="fixed bg-white left-1/2 -translate-x-1/2 
                top-1/2 -translate-y-1/2 rounded-xl z-50 pb-2"
          >
            <SketchPicker
              color={selectedColor}
              onChangeComplete={(color) => setSelectedColor(color.hex)}
            />
            <div className="flex gap-3 justify-end mr-3">
              <button
                className="text-gray-600 font-bold"
                onClick={() => setShow(false)}
                disabled={isPending}
              >
                취소
              </button>
              <button
                className="text-gray-600 font-bold"
                onClick={() => handleAdaptColor(selectedColor)}
                disabled={isPending}
              >
                {false ? "적용중" : "적용"}
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-20"
            onClick={() => setShow(false)}
          />
        </div>
      )}
    </>
  );
}
