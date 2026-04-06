import { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

type CursorVariant = 'default' | 'hover' | 'action';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const updateCursorPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.left = `${positionRef.current.x}px`;
      cursorRef.current.style.top = `${positionRef.current.y}px`;
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsEnabled(e.matches);
      if (!e.matches) setVisible(false);
    };

    // Set initial state
    handleMediaChange(mediaQuery);

    // Listen for dynamic changes (e.g. external mouse connected/disconnected)
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateCursorPosition);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateCursorPosition]);

  // Observe hover targets via MutationObserver for dynamic content
  useEffect(() => {
    if (!isEnabled) return;

    const handleEnter = (el: Element) => () => {
      const cursorLabel = el.getAttribute('data-cursor-label') || '';
      if (cursorLabel) {
        setVariant('action');
        setLabel(cursorLabel);
      } else {
        setVariant('hover');
        setLabel('');
      }
    };

    const handleLeave = () => {
      setVariant('default');
      setLabel('');
    };

    const listenersMap = new Map<Element, { enter: () => void; leave: () => void }>();

    const attachListeners = () => {
      const selector = 'a, button, .blog-card, .scenery-card, [data-cursor]';
      const elements = document.querySelectorAll(selector);

      elements.forEach((el) => {
        if (listenersMap.has(el)) return; // Already attached

        const enter = handleEnter(el);
        const leave = handleLeave;
        el.addEventListener('mouseenter', enter);
        el.addEventListener('mouseleave', leave);
        listenersMap.set(el, { enter, leave });
      });
    };

    // Initial attachment
    attachListeners();

    // Debounced re-attach when DOM changes (route transitions, dynamic content)
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(attachListeners, 100);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
      listenersMap.forEach(({ enter, leave }, el) => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
      listenersMap.clear();
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${variant}${visible ? '' : ' custom-cursor--hidden'}`}
      style={{ left: positionRef.current.x, top: positionRef.current.y }}
    >
      {label && <span className="custom-cursor__label">{label}</span>}
    </div>
  );
};

export default CustomCursor;
