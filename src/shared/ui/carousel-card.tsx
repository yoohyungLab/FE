import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/shared/constants/tests/categories';

interface CarouselCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    category?: number;
    tag?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
    showFavoriteButton?: boolean;
}

export function CarouselCard({
    id,
    title,
    description,
    image,
    category,
    tag,
    isFavorite = false,
    onToggleFavorite,
    showFavoriteButton = true,
}: CarouselCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggleFavorite?.(id);
    };

    return (
        <Link
            to={`/tests/${id}`}
            className="relative bg-white rounded-2xl overflow-hidden shadow-sm  transition-all border border-gray-100 block"
        >
            <img src={image} alt={title} className="w-full h-36 object-cover" />

            {tag && (
                <div className="absolute top-2 left-2 bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">#{tag}</div>
            )}

            {showFavoriteButton && onToggleFavorite && (
                <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-white/80  rounded-full p-1 shadow">
                    {isFavorite ? <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> : <Heart className="w-4 h-4 text-gray-400" />}
                </button>
            )}

            <div className="p-4 space-y-1">
                {!tag && category && CATEGORIES[category as keyof typeof CATEGORIES] && (
                    <div className="text-xs text-pink-500 font-medium mb-1">#{CATEGORIES[category as keyof typeof CATEGORIES]}</div>
                )}
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{title}</h3>
                <p className="text-sm text-gray-500 truncate">{description}</p>
            </div>
        </Link>
    );
}
