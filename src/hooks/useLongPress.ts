import React, { useRef, useCallback } from 'react';

interface UseLongPressOptions {
  threshold?: number;
  onLongPress: () => void;
  onClick?: () => void;
}

export function useLongPress({
  threshold = 320,
  onLongPress,
  onClick,
}: UseLongPressOptions) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = useRef(false);

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Don't prevent default on touch right away, but track hold
      isLongPressActive.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        isLongPressActive.current = true;
        onLongPress();
      }, threshold);
    },
    [onLongPress, threshold]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePointerUp = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      cancel();
      // If released before threshold, treat as regular click
      if (!isLongPressActive.current && onClick) {
        onClick();
      }
    },
    [cancel, onClick]
  );

  return {
    onMouseDown: start,
    onMouseUp: handlePointerUp,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: handlePointerUp,
    onTouchCancel: cancel,
  };
}
