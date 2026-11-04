import React from "react";
import { Check, Leaf } from "lucide-react";
import type { Dish } from "@/types/menu";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400";

interface DishCardProps {
  dish: Dish;
  isSelected: boolean;
  onToggle: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  isSelected,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isSelected}
    className={`group w-full text-left bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
      isSelected
        ? "border-green-500 ring-4 ring-green-200"
        : "border-gray-200 hover:border-orange-400"
    }`}
  >
    <div className="relative aspect-square overflow-hidden">
      <img
        src={dish.image}
        alt={dish.name_en}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(event) => {
          (event.target as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />

      {isSelected && (
        <span className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
          <span className="bg-green-500 text-white rounded-full p-3 shadow-2xl">
            <Check className="h-6 w-6 stroke-[3]" />
          </span>
        </span>
      )}


      {dish.isVegetarian && (
        <span
          title="Vegetarian"
          className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg"
        >
          <Leaf className="h-3.5 w-3.5" />
        </span>
      )}
    </div>

    <div className="p-3 bg-gradient-to-b from-white to-gray-50">
      <h3 className="font-bold text-sm line-clamp-2 text-gray-900 mb-1 min-h-[2.5rem]">
        {dish.name_en}
      </h3>
      <p className="text-xs text-pink-600 line-clamp-1 font-medium">
        {dish.name_ta}
      </p>
    </div>
  </button>
);
