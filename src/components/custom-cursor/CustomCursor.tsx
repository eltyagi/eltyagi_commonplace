import { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

type CursorVariant = 'default' | 'hover' | 'action';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches === false) {
      return;
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      // Use requestAnimationFrame for smooth position updates
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setPosition({ x: mouseX, y: mouseY });
          rafRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Setup hover handlers for interactive elements
    const updateCursorState = (element: Element, entering: boolean) => {
      if (entering) {
        const cursorLabel = element.getAttribute('data-cursor-label') || '';
        const isAction = element.classList.contains('blog-card') ||
                        element.classList.contains('scenery-card') ||
                        element.hasAttribute('data-cursor-action');

        setVariant(isAction ? 'action' : 'hover');
        setLabel(cursorLabel);
      } else {
        setVariant('default');
        setLabel('');
      }
    };

    // Watch for dynamically added interactive elements
    const observer = new MutationObserver(() => {
      const interactiveElements = document.querySelectorAll(
        'a, button, .blog-card, .scenery-card, [data-cursor], .progress-indicator, .nav-tab'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => updateCursorState(el, true));
        el.addEventListener('mouseleave', () => updateCursorState(el, false));
      });
    });

    // Initial setup
    const interactiveElements = document.querySelectorAll(
      'a, button, .blog-card, .scenery-card, [data-cursor], .progress-indicator, .nav-tab'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => updateCursorState(el, true));
      el.addEventListener('mouseleave', () => updateCursorState(el, false));
    });

    // Observe DOM changes for dynamically added elements
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      // Clean up hover listeners
      const allElements = document.querySelectorAll(
        'a, button, .blog-card, .scenery-card, [data-cursor], .progress-indicator, .nav-tab'
      );
      allElements.forEach((el) => {
        el.removeEventListener('mouseenter', () => updateCursorState(el, true));
        el.removeEventListener('mouseleave', () => updateCursorState(el, false));
      });
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor custom-cursor--${variant}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {label && <span className="cursor-label">{label}</span>}
    </div>
  );
};

export default CustomCursor;
