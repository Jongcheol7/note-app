"use client";
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import { useCategoryStore } from "@/store/useCategoryStore";

export default function MainCategory() {
  const { categoryName, setCategoryName } = useCategoryStore();
  const { data: categoryData } = useCategoryLists();

  return (
    <div className="flex gap-3 pb-2 overflow-x-auto whitespace-nowrap scrollbar-none">
      <button
        key="all"
        onClick={() => setCategoryName("")}
        className={`px-3 py-1 rounded-lg shrink-0 border transition ${
          categoryName === ""
            ? "bg-gray-500 text-white border-gray-500 font-semibold"
            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
        }`}
      >
        전체
      </button>
      {categoryData &&
        categoryData.map((cat) => (
          <button
            key={cat.categoryNo}
            className={`px-2 py-1 rounded-lg shrink-0 border transition duration-200 ${
              categoryName === cat.name
                ? "bg-gray-500 text-white border-gray-500 font-semibold"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => {
              setCategoryName(cat.name);
            }}
          >
            {cat.name}
          </button>
        ))}
    </div>
  );
}
