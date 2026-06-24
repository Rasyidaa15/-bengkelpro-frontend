import React from 'react';
import { Wrench, Circle, Droplet, Cog, Box } from 'lucide-react';

const CategoryCard = ({ category, onClick }) => {
  const icons = {
    'Perkakas': <Wrench className="w-8 h-8" />,
    'Ban': <Circle className="w-8 h-8" />,
    'Oli': <Droplet className="w-8 h-8" />,
    'Sparepart': <Cog className="w-8 h-8" />,
  };
  return (
    <div
      onClick={() => onClick?.(category)}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-soft border border-gray-100 dark:border-gray-700 card-hover cursor-pointer"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
        {icons[category.name] || <Box className="w-8 h-8" />}
      </div>
      <h4 className="font-semibold text-gray-800 dark:text-white">{category.name}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{category.productCount || 0} produk</p>
    </div>
  );
};

export default CategoryCard;