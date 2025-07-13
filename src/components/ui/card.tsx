import * as React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';

interface CardProps {
    id: string;
    title: string;
    image: string;
    tag: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
}

export function HomeCard({ id, title, image, tag, isFavorite = false, onToggleFavorite }: CardProps) {
    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onToggleFavorite?.(id);
    };

    return (
        <Link to={`/tests/${id}`} className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border transition-all">
            <img src={image} alt={title} className="w-full h-36 object-cover" />

            <div className="absolute top-2 left-2 bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">#{tag}</div>

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

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
