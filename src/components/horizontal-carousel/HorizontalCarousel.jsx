import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const useIntersectionObserver = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);

  return isIntersecting;
};

const CarouselItem = ({ item, index , type ='' ,url='' }) => {
  const ref = useRef(null);
  const isVisible = useIntersectionObserver(ref);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isVisible, isLoaded]);

  return (
    <div ref={ref} className="flex-shrink-0 w-64 px-2 gap-2">
      <Card className="overflow-hidden h-full py-0" onClick={()=> window.open(item.url, '_blank')}>
        <CardContent className="p-0">
          <div className="relative w-full h-60 object-cover">
            {(isVisible || isLoaded) ? (
             <Image
             src={ item.imageUrl ||
                "data:image/jpeg;base64,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"
             }
             alt={item.title || `Item ${index + 1}`}
             fill
             unoptimized
             className="object-cover opacity-0 transition-opacity duration-300"
             onLoadingComplete={(img) => img.classList.remove("opacity-0")}
             sizes="(max-width: 768px) 100vw, 256px"
           />
            ) : (
              <div className="w-full h-full bg-gray-200 animate-pulse"></div>
            )}
          </div>
          {  type !== 'Wardrobe Matches' &&
            <div className="p-4">
              <h3 className="font-normal text-base">{item.title || `Item ${index + 1}`}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.description || 'No description available'}</p>
              {item.price && (
                <p className="font-semibold text-sm mt-2">{typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}</p>
              )}
            </div>
          }

        </CardContent>
      </Card>
    </div>
  );
};

const HorizontalCarousel = ({ items = [], title = "Featured Items", id = ''  }) => {
  const carouselRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    const ref = carouselRef.current;

    if (ref) {
      ref.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
    }

    return () => {
      if (ref) {
        ref.removeEventListener('scroll', checkScrollButtons);
      }
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [items]);

  const scrollLeft = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 mx-2">
        <h2 className="text-md font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            disabled={!showLeftButton}
            className={`rounded-full ${!showLeftButton ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            disabled={!showRightButton}
            className={`rounded-full ${!showRightButton ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide scroll-smooth py-2 mx-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.length > 0 ? (
            items.map((item, index) => (
              <CarouselItem key={item.id || index} item={item} index={index}  type={title}/>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index} item={{}} index={index} type={title}/>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCarousel;