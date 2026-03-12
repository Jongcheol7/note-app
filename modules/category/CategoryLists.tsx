"use client";

import { useCategoryDelete } from "@/hooks/category/useCategoryDelete";
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import { useCategoryReorder } from "@/hooks/category/useCategoryReorder";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import CategoryPopup from "./CategoryPopup";

export default function CategoryLists() {
  const {
    data: categories = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useCategoryLists();
  const { mutate: delCategoryMutate } = useCategoryDelete();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { mutate: reorderCategoryMutate } = useCategoryReorder();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">{error.message ?? "알 수 없는 오류입니다."}</p>
      </div>
    );
  }

  const dragEnded = async (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...categories];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    const updated = reordered.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));
    reorderCategoryMutate(updated);
  };

  return (
    <div className="pt-2">
      {showCategoryPopup && (
        <CategoryPopup
          show={showCategoryPopup}
          setShow={setShowCategoryPopup}
          refetch={refetch}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          드래그로 순서를 변경할 수 있습니다
        </p>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
          onClick={() => setShowCategoryPopup((prev) => !prev)}
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      </div>

      <DragDropContext onDragEnd={dragEnded}>
        <Droppable droppableId="category-list">
          {(provided) => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-2"
            >
              {categories.map((cat, index) => (
                <Draggable
                  key={`category-${cat.categoryNo}`}
                  draggableId={`category-${cat.categoryNo}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex items-center gap-3 p-3 bg-card rounded-2xl border border-border transition-shadow ${
                        snapshot.isDragging ? "shadow-float" : "shadow-card"
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 font-medium text-sm">{cat.name}</span>
                      <button
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`${cat.name} 삭제`}
                        onClick={() => delCategoryMutate({ categoryNo: cat.categoryNo })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">카테고리가 없습니다</p>
          <p className="text-xs mt-1">위의 추가 버튼으로 만들어보세요</p>
        </div>
      )}
    </div>
  );
}
