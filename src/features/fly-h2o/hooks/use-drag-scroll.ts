"use client";

import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useRef, useState } from "react";
import { dragClickThreshold } from "../data/media";

type DragScrollOptions = {
  bypassClickBlockSelector?: string;
};

export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>, options: DragScrollOptions = {}) {
  const dragRef = useRef({
    active: false,
    captured: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });
  const blockClickRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  function onPointerDown(event: ReactPointerEvent<T>) {
    if (event.button !== 0) return;
    const element = ref.current;
    if (!element) return;

    dragRef.current = {
      active: true,
      captured: false,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }

  function onPointerMove(event: ReactPointerEvent<T>) {
    const element = ref.current;
    const drag = dragRef.current;
    if (!element || !drag.active) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > dragClickThreshold || Math.abs(dy) > dragClickThreshold) {
      if (!drag.captured) {
        element.setPointerCapture?.(drag.pointerId);
        drag.captured = true;
      }
      drag.moved = true;
      blockClickRef.current = true;
      setDragging(true);
    }

    element.scrollLeft = drag.scrollLeft - dx;
    element.scrollTop = drag.scrollTop - dy;
    if (drag.moved) event.preventDefault();
  }

  function finishDrag(event: ReactPointerEvent<T>) {
    const element = ref.current;
    const drag = dragRef.current;
    const moved = drag.moved;
    if (drag.captured && element?.hasPointerCapture?.(drag.pointerId)) {
      element.releasePointerCapture(drag.pointerId);
    }
    dragRef.current.active = false;
    dragRef.current.captured = false;
    dragRef.current.pointerId = -1;
    setDragging(false);
    if (moved) {
      window.setTimeout(() => {
        blockClickRef.current = false;
      }, 120);
    }
  }

  function onClickCapture(event: ReactMouseEvent<T>) {
    if (!blockClickRef.current) return;

    if (options.bypassClickBlockSelector && event.target instanceof Element) {
      const shouldBypass = Boolean(event.target.closest(options.bypassClickBlockSelector));
      if (shouldBypass) {
        blockClickRef.current = false;
        return;
      }
    }

    event.preventDefault();
    event.stopPropagation();
    blockClickRef.current = false;
  }

  return {
    dragging,
    dragProps: {
      onClickCapture,
      onPointerCancel: finishDrag,
      onPointerDown,
      onPointerMove,
      onPointerUp: finishDrag,
      onLostPointerCapture: finishDrag,
    },
  };
}
