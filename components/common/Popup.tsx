import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PopupProps {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  /** true면 바텀시트, false면 중앙 팝업 (기본: false) */
  bottomSheet?: boolean;
}

export default function Popup({ children, onClose, className, bottomSheet = false }: PopupProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const firstInput = contentRef.current?.querySelector<HTMLElement>(
      "input, button, [tabindex]"
    );
    firstInput?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (bottomSheet) {
    return (
      <div className="fixed inset-0 z-40" onClick={onClose}>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div
            ref={contentRef}
            className={cn(
              "relative z-50 bg-card rounded-t-3xl shadow-float w-full max-w-lg p-5 pb-8 animate-slide-up",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" />
      <div
        ref={contentRef}
        className={cn(
          "relative z-50 bg-card rounded-2xl shadow-float animate-fade-in",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
