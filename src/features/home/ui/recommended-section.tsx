import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/shared/ui/carousel';
import { CarouselCard } from '@/shared/ui/cards/carousel-card';
import { useFavorites } from '@/shared/hooks/use-favorites';

interface RecommendedSectionProps {
    tests: Array<{
        id: string;
        title: string;
        description: string;
        image: string;
        tag: string;
    }>;
}

export function RecommendedSection({ tests }: RecommendedSectionProps) {
    const { toggleFavorite, isFavorite } = useFavorites();

    return (
        <section className="space-y-4 mt-12">
            <h2 className="text-xl font-bold text-gray-900">📌 테스트 추천</h2>
            <Carousel className="w-full">
                <CarouselContent className="-ml-2">
                    {tests.map((test) => (
                        <CarouselItem key={test.id} className="pl-2 basis-[280px]">
                            <CarouselCard
                                id={test.id}
                                title={test.title}
                                description={test.description}
                                image={test.image}
                                tag={test.tag}
                                isFavorite={isFavorite(test.id)}
                                onToggleFavorite={toggleFavorite}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    );
}
