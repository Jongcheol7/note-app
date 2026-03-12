import { useColorStore } from "@/store/useColorStore";
import { useEffect, useState } from "react";

interface NoteFormInitialData {
  title?: string;
  categoryNo?: number;
  color?: string;
  alarmDatetime?: string | null;
  isPublic?: boolean;
  likes?: { id: string }[];
  isSecret?: boolean;
}

export function useNoteForm(initialData: NoteFormInitialData | undefined) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [selectedCategoryNo, setSelectedCategoryNo] = useState(
    initialData?.categoryNo ?? -1
  );
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color ?? "#FEF3C7"
  );
  const [alarmDatetime, setAlarmDatetime] = useState(
    initialData?.alarmDatetime
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic ?? false);
  const [isLike, setIsLike] = useState((initialData?.likes?.length ?? 0) > 0);
  const [isSecret, setIsSecret] = useState(initialData?.isSecret ?? false);

  const togglePublic = () => setIsPublic((prev) => !prev);
  const toggleLike = () => setIsLike((prev) => !prev);
  const toggleSecret = () => setIsSecret((prev) => !prev);

  const { setColor } = useColorStore();
  useEffect(() => {
    if (initialData?.color) {
      setColor(initialData.color);
    }
  }, [initialData, setColor]);

  return {
    title,
    setTitle,
    selectedCategoryNo,
    setSelectedCategoryNo,
    selectedColor,
    setSelectedColor,
    isPublic,
    alarmDatetime,
    setAlarmDatetime,
    togglePublic,
    isLike,
    toggleLike,
    isSecret,
    toggleSecret,
  };
}
