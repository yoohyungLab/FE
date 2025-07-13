import { useFavoritesFilter, FavoritesCategoryFilter, FavoritesList } from '@/features/test-favorites';
import { EmptyFavorites } from '@/widgets/empty-state';

export default function FavoritesPage() {
    const { favoriteIds, toggleFavorite, loading, filteredTests, selectedCategory, setSelectedCategory, favoriteCategories } =
        useFavoritesFilter();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="w-10 h-10 border-t-transparent border-b-transparent border-r-transparent border-l-transparent border-pink-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {favoriteIds.length > 0 && (
                <FavoritesCategoryFilter
                    favoriteCategories={favoriteCategories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
            )}

            {filteredTests.length === 0 ? <EmptyFavorites /> : <FavoritesList tests={filteredTests} onToggleFavorite={toggleFavorite} />}
        </div>
    );
}
