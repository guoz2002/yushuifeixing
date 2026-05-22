"use client";

import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from "react";
import { useRef, useState } from "react";
import { dragClickThreshold } from "../data/media";

export function useDragScroll<T extends HTMLElement>(ref: RefObject<T | null>) {
  const dragRef = useRef({
    active: false,
    moved: false,
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
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
    element.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: ReactPointerEvent<T>) {
    const element = ref.current;
    const drag = dragRef.current;
    if (!element || !drag.active) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > dragClickThreshold || Math.abs(dy) > dragClickThreshold) {
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
    const moved = dragRef.current.moved;
    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    dragRef.current.active = false;
    setDragging(false);
    if (moved) {
      window.setTimeout(() => {
        blockClickRef.current = false;
      }, 120);
    }
  }

  function onClickCapture(event: ReactMouseEvent<T>) {
    if (!blockClickRef.current) return;
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
