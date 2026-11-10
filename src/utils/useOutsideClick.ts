import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent) => void;

export const useOutsideClick = (
  ref: RefObject<HTMLElement | null>,
  handler: Handler
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
};
