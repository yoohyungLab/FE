import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/constants/tests/categories';

interface FavoriteCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    category: number;
    tags?: string[];
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

export function FavoriteCard({ id, title, description, image, category, tags, isFavorite = false, onToggleFavorite }: FavoriteCardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggleFavorite?.(id);
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start">
                <Link to={`/tests/${id}`} className="flex-grow flex items-center">
                    <img src={image} alt={title} className="w-20 h-20 object-cover rounded-lg mr-4 shadow-sm flex-shrink-0" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-pink-100 text-pink-600 font-medium px-2 py-0.5 rounded-full">
                                #{CATEGORIES[category as keyof typeof CATEGORIES]}
                            </span>
                            {tags?.slice(0, 1).map((tag) => (
                                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
                    </div>
                </Link>
                <button onClick={handleFavoriteClick} className="ml-4 text-pink-500 hover:text-pink-600 transition-colors">
                    <Heart className="w-5 h-5" fill="currentColor" />
                </button>
            </div>
        </div>
    );
}
