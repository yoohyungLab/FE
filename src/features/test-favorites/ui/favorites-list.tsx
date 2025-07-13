import { useRef, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { CATEGORIES } from '@/shared/constants/tests/categories';

const PAGE_SIZE = 6;

interface FavoritesListProps {
    tests: Array<{
        id: string;
        title: string;
        description: string;
        image: string;
        category: number;
        tags?: string[];
    }>;
    onToggleFavorite: (id: string) => void;
}

export function FavoritesList({ tests, onToggleFavorite }: FavoritesListProps) {
    const [visible, setVisible] = useState(PAGE_SIZE);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting) {
                setVisible((prev) => Math.min(prev + PAGE_SIZE, tests.length));
            }
        },
        [tests.length]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
        if (loadMoreRef.current) observer.observe(loadMoreRef.current);
        return () => observer.disconnect();
    }, [handleObserver]);

    const visibleTests = tests.slice(0, visible);

    return (
        <>
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
                                onClick={() => onToggleFavorite(test.id)}
                                className="ml-4 text-pink-500 hover:text-pink-600 transition-colors"
                            >
                                <Heart className="w-5 h-5" fill="currentColor" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            {visible < tests.length && <div ref={loadMoreRef} className="h-6" />}
        </>
    );
} 