import { useEffect, useState, useRef, useCallback } from 'react';
import { CATEGORIES } from '@/constants/tests/categories';
import { tests } from '@/constants/tests/egen-teto';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';

const PAGE_SIZE = 6;

export default function FavoritesPage() {
    const { favoriteIds, toggleFavorite, loading } = useFavorites();
    const [visible, setVisible] = useState(PAGE_SIZE);
    const [selectedCategory, setSelectedCategory] = useState<'전체' | number>('전체');
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const allFavorites = tests.filter((test) => favoriteIds.includes(test.id));
    const filteredTests = selectedCategory === '전체' ? allFavorites : allFavorites.filter((t) => t.category === selectedCategory);

    useEffect(() => {
        if (selectedCategory !== '전체' && filteredTests.length === 0) {
            setSelectedCategory('전체');
        }
    }, [selectedCategory, filteredTests.length]);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                setVisible((prev) => Math.min(prev + PAGE_SIZE, filteredTests.length));
            }
        },
        [filteredTests.length]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    const visibleTests = filteredTests.slice(0, visible);
    const favoriteCategories = Array.from(new Set(allFavorites.map((test) => test.category)));

    const EmptyState = () => (
        <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">찜한 테스트가 없어요</h3>
                <p className="text-gray-500">마음에 드는 테스트를 찜하고 여기서 빠르게 접근해보세요!</p>
            </div>
            <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
                <Search size={16} /> 테스트 둘러보기
            </Link>
        </div>
    );

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
                <div className="flex flex-wrap gap-2 items-center">
                    {['전체', ...favoriteCategories].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category as number)}
                            className={`px-4 py-2 text-sm rounded-full transition ${
                                selectedCategory === category ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {category === '전체' ? '전체' : CATEGORIES[category as keyof typeof CATEGORIES]}
                        </button>
                    ))}
                </div>
            )}

            {visibleTests.length === 0 ? (
                <EmptyState />
            ) : (
                <ul className="space-y-4">
                    {visibleTests.map((test) => (
                        <li key={test.id}>
                            <div className="flex items-start bg-white border rounded-xl p-3 shadow-sm transition-all">
                                <Link to={`/tests/${test.id}`} className="flex-grow flex items-center">
                                    <img
                                        src={test.image}
                                        alt={test.title}
                                        className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm flex-shrink-0"
                                    />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs bg-pink-100 text-pink-600 font-medium px-2 py-0.5 rounded-full">
                                                #{CATEGORIES[test.category as keyof typeof CATEGORIES]}
                                            </span>
                                            {test.tags?.slice(0, 1).map((tag) => (
                                                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{test.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">{test.description}</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => toggleFavorite(test.id)}
                                    className="ml-4 text-pink-500 hover:text-pink-600 transition-colors"
                                >
                                    <Heart className="w-5 h-5" fill="currentColor" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {visible < filteredTests.length && <div ref={loadMoreRef} className="h-6" />}
        </div>
    );
}
