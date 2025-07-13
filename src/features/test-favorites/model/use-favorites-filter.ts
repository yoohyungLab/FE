import { useEffect, useState } from 'react';
import { useFavorites } from '@/shared/hooks/use-favorites';
import { tests } from '@/shared/constants/tests/egen-teto';

export function useFavoritesFilter() {
    const { favoriteIds, toggleFavorite, loading } = useFavorites();
    const [selectedCategory, setSelectedCategory] = useState<'전체' | number>('전체');

    const allFavorites = tests.filter((test) => favoriteIds.includes(test.id));
    const filteredTests = selectedCategory === '전체' ? allFavorites : allFavorites.filter((t) => t.category === selectedCategory);

    useEffect(() => {
        if (selectedCategory !== '전체' && filteredTests.length === 0) {
            setSelectedCategory('전체');
        }
    }, [selectedCategory, filteredTests.length]);

    const favoriteCategories = Array.from(new Set(allFavorites.map((test) => test.category)));

    return {
        favoriteIds,
        toggleFavorite,
        loading,
        allFavorites,
        filteredTests,
        selectedCategory,
        setSelectedCategory,
        favoriteCategories,
    };
} 