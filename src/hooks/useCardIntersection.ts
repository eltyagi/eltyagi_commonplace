import { useEffect, useRef, useCallback, useState } from 'react';

interface UseCardIntersectionOptions {
  /** Debounce delay in ms for scroll updates */
  debounceMs?: number;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection */
  threshold?: number;
}

interface UseCardIntersectionReturn {
  /** Current index of card in viewport center */
  activeIndex: number;
  /** Refs to attach to each card element */
  cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  /** Scroll a specific card into view */
  scrollToCard: (index: number) => void;
  /** Set active index manually (for click handling) */
  setActiveIndex: (index: number) => void;
}

/**
 * Hook to track which card is in the viewport center using IntersectionObserver.
 * Returns the index of the currently "focused" card and utilities for navigation.
 */
export const useCardIntersection = (
  totalCards: number,
  options: UseCardIntersectionOptions = {}
): UseCardIntersectionReturn => {
  const {
    debounceMs = 50,
    rootMargin = '-35% 0px -35% 0px', // Focus on middle 30% of viewport
    threshold = 0.1,
  } = options;

  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualScrollRef = useRef(false);

  // Ensure cardRefs array is properly sized
  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, totalCards);
    while (cardRefs.current.length < totalCards) {
      cardRefs.current.push(null);
    }
  }, [totalCards]);

  // Debounced update function
  const debouncedSetActive = useCallback(
    (index: number) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (!isManualScrollRef.current) {
          setActiveIndex(index);
        }
      }, debounceMs);
    },
    [debounceMs]
  );

  // Intersection observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      // Find the entry with highest intersection ratio
      let maxRatio = 0;
      let mostVisibleIndex = activeIndex;

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          const index = cardRefs.current.findIndex(
            (ref) => ref === entry.target
          );
          if (index !== -1) {
            mostVisibleIndex = index;
          }
        }
      });

      if (maxRatio > 0) {
        debouncedSetActive(mostVisibleIndex);
      }
    },
    [activeIndex, debouncedSetActive]
  );

  // Set up the intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    });

    // Observe all card refs
    cardRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [handleIntersection, rootMargin, threshold, totalCards]);

  // Scroll to a specific card
  const scrollToCard = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      isManualScrollRef.current = true;
      setActiveIndex(index);
      
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Reset manual scroll flag after animation completes
      setTimeout(() => {
        isManualScrollRef.current = false;
      }, 500);
    }
  }, []);

  // Manual set active (for click handling)
  const handleSetActiveIndex = useCallback((index: number) => {
    isManualScrollRef.current = true;
    setActiveIndex(index);
    
    // Reset after short delay
    setTimeout(() => {
      isManualScrollRef.current = false;
    }, 100);
  }, []);

  return {
    activeIndex,
    cardRefs,
    scrollToCard,
    setActiveIndex: handleSetActiveIndex,
  };
};

export default useCardIntersection;
