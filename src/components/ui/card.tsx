import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
    id: string;
    title: string;
    image: string;
    tag: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

export function Card({ id, title, image, tag, isFavorite = false, onToggleFavorite }: CardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggleFavorite?.(id);
    };

    return (
        <Link to={`/tests/${id}`} className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border transition-all">
            <img src={image} alt={title} className="w-full h-36 object-cover" />

            {/* 태그 - 기존 스타일 그대로 유지 */}
            <div className="absolute top-2 left-2 bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">#{tag}</div>

            {/* 찜 아이콘 */}
            {onToggleFavorite && (
                <button onClick={handleFavoriteClick} className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow">
                    {isFavorite ? <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> : <Heart className="w-4 h-4 text-gray-400" />}
                </button>
            )}

            <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{title}</h3>
            </div>
        </Link>
    );
}
