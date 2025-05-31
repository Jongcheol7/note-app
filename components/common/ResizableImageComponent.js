// components/common/ResizableImageComponent.jsx

import React, { useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function ResizableImageComponent({
  node,
  updateAttributes,
  selected,
}) {
  const { src, width, height } = node.attrs;
  const imgRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const startResize = (e) => {
    e.preventDefault();

    const isTouch = e.type === "touchstart";
    const startX = isTouch ? e.touches[0].clientX : e.clientX;

    const startWidth = imgRef.current.offsetWidth;

    const doResize = (moveEvent) => {
      const clientX =
        moveEvent.type === "touchmove"
          ? moveEvent.touches[0].clientX
          : moveEvent.clientX;

      const newWidth = startWidth + (clientX - startX);
      updateAttributes({ width: `${newWidth}px` });
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchmove", doResize);
      window.removeEventListener("touchend", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchmove", doResize);
    window.addEventListener("touchend", stopResize);
  };

  return (
    <NodeViewWrapper
      as="div"
      data-type="resizable-image"
      className="relative inline-block"
    >
      <img
        ref={imgRef}
        src={src}
        alt="resizable"
        style={{
          width: width || "auto",
          height: height || "auto",
          display: "block",
        }}
      />
      {selected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={startResize}
          onTouchStart={startResize}
        ></div>
      )}
    </NodeViewWrapper>
  );
}
