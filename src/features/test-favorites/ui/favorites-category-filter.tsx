import { CATEGORIES } from '@/shared/constants/tests/categories';

interface FavoritesCategoryFilterProps {
    favoriteCategories: number[];
    selectedCategory: '전체' | number;
    onCategoryChange: (category: '전체' | number) => void;
}

export function FavoritesCategoryFilter({ favoriteCategories, selectedCategory, onCategoryChange }: FavoritesCategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            {['전체', ...favoriteCategories].map((category) => (
                <button
                    key={category}
                    onClick={() => onCategoryChange(category as number)}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                        selectedCategory === category ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {category === '전체' ? '전체' : CATEGORIES[category as keyof typeof CATEGORIES]}
                </button>
            ))}
        </div>
    );
} 