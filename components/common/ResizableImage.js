// components/common/ResizableImage.js

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
          return {
            src: element.getAttribute("src"),
            width: element.style.width || "auto",
            height: element.style.height || "auto",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "resizable-image" }),
      [
        "img",
        {
          src: HTMLAttributes.src,
          style: `width: ${HTMLAttributes.width}; height: ${HTMLAttributes.height};`,
        },
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
