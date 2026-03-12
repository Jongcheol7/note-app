"use client";
import { useCategoryLists } from "@/hooks/category/useCategoryLists";
import { useCategoryStore } from "@/store/useCategoryStore";

export default function MainCategory() {
  const { categoryName, setCategoryName } = useCategoryStore();
  const { data: categoryData } = useCategoryLists();

  return (
    <div className="flex gap-1.5 pb-3 overflow-x-auto whitespace-nowrap scrollbar-none -mx-1 px-1">
      <button
        key="all"
        onClick={() => setCategoryName("")}
        className={`px-3.5 py-1 rounded-full text-[13px] font-medium shrink-0 transition-all border ${
          categoryName === ""
            ? "bg-foreground text-background border-foreground"
            : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
        }`}
      >
        전체
      </button>
      {categoryData?.map((cat) => (
        <button
          key={cat.categoryNo}
          className={`px-3.5 py-1 rounded-full text-[13px] font-medium shrink-0 transition-all border ${
            categoryName === cat.name
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
          }`}
          onClick={() => setCategoryName(cat.name)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
