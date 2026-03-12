import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  inline: false,
  draggable: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      width: { default: "auto" },
      height: { default: "auto" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (dom) => {
          const element = dom;

          // style 속성 문자열 직접 추출해서 정규식으로 파싱
          const style = element.getAttribute("style") || "";
          const widthMatch = style.match(/width:\s*([^;]+);?/);
          const heightMatch = style.match(/height:\s*([^;]+);?/);

          return {
            src: element.getAttribute("src"),
            width: widthMatch ? widthMatch[1] : "auto",
            height: heightMatch ? heightMatch[1] : "auto",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      {
        src: HTMLAttributes.src,
        style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`,
        "data-type": "resizable-image",
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
