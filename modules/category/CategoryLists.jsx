"use client"; // ✅ Next.js에서 브라우저 전용 기능 (예: 드래그) 쓸 땐 꼭 필요!

// ✅ 드래그 기능을 제공하는 라이브러리에서 필요한 요소 가져옴
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

// ✅ 서버나 DB에서 카테고리 리스트를 불러오는 커스텀 훅 (너가 만든거)
import { useCategoryLists } from "../hooks/useCategoryLists";
import { useCategoryDelete } from "../hooks/useCategoryDelete";
import { useState } from "react";
import CategoryPopup from "./CategoryPopup";
import { useCategoryReorder } from "../hooks/useCategoryReorder";

export default function CategoryLists() {
  // ✅ 카테고리 목록을 서버에서 불러오는 중인지 확인 + 불러온 데이터
  // 👉 useCategoryLists 안에서 React Query를 쓰든 Axios를 쓰든 관계없음
  const {
    data: categories = [],
    isLoading,
    refetch,
    isError,
    error,
  } = useCategoryLists();
  const { mutate: delCategoryMutate, isPending: isDeleting } =
    useCategoryDelete();
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const { mutate: reorderCategoryMutate, isPending: isReordering } =
    useCategoryReorder();

  // ✅ 데이터 로딩 중이면 간단한 메시지 보여줌
  if (isLoading) {
    return <div>로딩중입니다...</div>;
  }
  if (isError) {
    return <div>{error.message ?? "알 수 없는 오류입니다."}</div>;
  }

  /**
   * 🧠 드래그가 끝났을 때 실행되는 함수
   * 예: "운동"을 3번째 → 1번째로 옮겼다면, 그 순서를 반영해주는 로직이 여기에 들어감
   * result는 드래그의 출발 위치, 도착 위치 정보를 가지고 있음
   */
  const dragEnded = async (result) => {
    if (!result.destination) return; // ❗ 드래그 하다가 놓지 않고 취소한 경우는 무시

    // ✅ 현재 상태의 categories 배열을 복사해서 정렬 작업할 준비
    const reordered = [...categories];

    // ✅ 드래그로 옮긴 항목을 잘라냄
    const [moved] = reordered.splice(result.source.index, 1);

    // ✅ 새로운 위치에 끼워넣음
    reordered.splice(result.destination.index, 0, moved);

    // ✅ 순서가 바뀌었으니 각 항목의 sortOrder(순서값)를 0부터 재설정
    const updated = reordered.map((item, idx) => ({
      ...item,
      sortOrder: idx, // 인덱스를 sortOrder로 설정
    }));

    reorderCategoryMutate(updated);
  };

  return (
    <div className="container py-5">
      {showCategoryPopup && (
        <CategoryPopup
          show={showCategoryPopup}
          setShow={setShowCategoryPopup}
          refetch={refetch}
        />
      )}
      <div className="flex">
        <h1 className="flex-1 text-xl font-bold mb-2">📁 카테고리</h1>
        <button
          className="py-1 px-2 border-gray-300 border rounded-md bg-green-400 hover:bg-green-600 transition-all"
          onClick={() => setShowCategoryPopup((prev) => !prev)}
        >
          Add
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        드래그로 순서를 변경할 수 있습니다.
      </p>

      <div className="col-sm-12 col-md-5">
        {/* ✅ 드래그 기능을 시작하는 컨테이너. 드래그 관련 이벤트를 감지함 */}
        <DragDropContext onDragEnd={dragEnded}>
          {/* ✅ 드롭 가능한 영역 정의 (카테고리 리스트 전체) */}
          <Droppable droppableId="category-list">
            {(provided) => (
              <ul
                ref={provided.innerRef} // ✅ 라이브러리가 DOM을 추적할 수 있도록 ref 연결
                {...provided.droppableProps} // ✅ 드래그 동작에 필요한 속성들을 넣어줌
                className="flex flex-col gap-2"
              >
                {/* ✅ 드래그 가능한 항목 반복 */}
                {categories.map((cat, index) => (
                  <Draggable
                    key={`category-${cat.categoryNo}`} // ✅ React key → 꼭 고유해야 함
                    draggableId={`category-${cat.categoryNo}`} // ✅ 드래그 식별용 ID (문자열만 가능)
                    index={index} // ✅ 현재 순서 정보 (필수)
                  >
                    {(provided) => (
                      <div className="flex w-full">
                        <li
                          ref={provided.innerRef} // ✅ 드래그 위치 계산을 위해 DOM 연결
                          {...provided.draggableProps} // ✅ 드래그 관련 속성들 (스타일, 위치 등)
                          {...provided.dragHandleProps} // ✅ 마우스로 "잡고 끄는 부분" 지정
                          className="p-3 bg-white shadow rounded cursor-move flex-1"
                        >
                          {/* ✅ 실제 보여줄 카테고리 이름 */}
                          {cat.name}
                        </li>
                        <button
                          className="px-2 hover:text-red-500"
                          onClick={() => {
                            delCategoryMutate(cat.categoryNo);
                          }}
                        >
                          🗙
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}

                {/* ✅ 드래그 도중 생기는 빈 공간을 위한 필수 요소 */}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
