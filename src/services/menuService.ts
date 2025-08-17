import { MenuItem, MenuCategory } from '../types/eventTypes';
import { menuData } from '../data/menuData';

// Convert menuData to MenuCategory format
export const menuCategories: MenuCategory[] = Object.entries(menuData).map(([categoryName, items]) => ({
  name: categoryName,
  name_ta: categoryName, // Using English name for now, can be updated with Tamil translations
  items: items.map(item => ({
    ...item,
    category: categoryName,
    isAvailable: true,
    cuisineType: 'south-indian' as const,
    price: undefined,
    description: undefined,
    allergens: undefined
  })),
  icon: '🍽️' // Default icon
}));

export const getAllMenuItems = (): MenuItem[] => {
  return Object.entries(menuData).flatMap(([categoryName, items]) => 
    items.map(item => ({
      ...item,
      category: categoryName,
      isAvailable: true,
      cuisineType: 'south-indian' as const,
      price: undefined,
      description: undefined,
      allergens: undefined
    }))
  );
};

export const getMenuItemsByCategory = (categoryName: string): MenuItem[] => {
  const items = menuData[categoryName as keyof typeof menuData];
  if (!items) return [];
  
  return items.map(item => ({
    ...item,
    category: categoryName,
    isAvailable: true,
    cuisineType: 'south-indian' as const,
    price: undefined,
    description: undefined,
    allergens: undefined
  }));
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return getAllMenuItems().find(item => item.id === id);
};
