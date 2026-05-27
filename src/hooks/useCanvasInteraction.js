import { useRef, useEffect, useCallback } from "react";

export function useCanvasInteraction(canvasRef, { state, dispatch }) {
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startCenterX: 0, startCenterY: 0 });
  const didDragRef = useRef(false);

  const pixelToWorldDelta = useCallback(
    (dpx, dpy) => {
      const canvas = canvasRef.current;
      if (!canvas) return { dx: 0, dy: 0 };
      const aspect = canvas.width / canvas.height;
      const viewWidth = 4.0 / state.zoom;
      const viewHeight = viewWidth / aspect;
      return {
        dx: (dpx / canvas.width) * viewWidth,
        dy: (dpy / canvas.height) * viewHeight,
      };
    },
    [canvasRef, state.zoom]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function onMouseDown(e) {
      dragRef.current = {
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startCenterX: state.centerX,
        startCenterY: state.centerY,
      };
      didDragRef.current = false;
      canvas.style.cursor = "grabbing";
    }

    function onMouseMove(e) {
      if (!dragRef.current.dragging) return;
      const dpx = e.clientX - dragRef.current.startX;
      const dpy = e.clientY - dragRef.current.startY;
      if (Math.abs(dpx) > 3 || Math.abs(dpy) > 3) didDragRef.current = true;
      const { dx, dy } = pixelToWorldDelta(dpx, dpy);
      dispatch({
        type: "SET_VIEWPORT",
        payload: {
          centerX: dragRef.current.startCenterX - dx,
          centerY: dragRef.current.startCenterY - dy,
        },
      });
    }

    function onMouseUp() {
      dragRef.current.dragging = false;
      canvas.style.cursor = "grab";
    }

    function onClick(e) {
      if (didDragRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const aspect = canvas.width / canvas.height;
      const viewWidth = 4.0 / state.zoom;
      const viewHeight = viewWidth / aspect;
      const clickX = state.centerX + (px / canvas.width - 0.5) * viewWidth;
      const clickY = state.centerY + (py / canvas.height - 0.5) * viewHeight;
      dispatch({
        type: "SET_VIEWPORT",
        payload: { centerX: clickX, centerY: clickY, zoom: state.zoom * 2 },
      });
    }

    function onWheel(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const aspect = canvas.width / canvas.height;
      const viewWidth = 4.0 / state.zoom;
      const viewHeight = viewWidth / aspect;

      const worldX = state.centerX + (px / canvas.width - 0.5) * viewWidth;
      const worldY = state.centerY + (py / canvas.height - 0.5) * viewHeight;

      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const newZoom = state.zoom * factor;

      dispatch({
        type: "SET_VIEWPORT",
        payload: {
          centerX: worldX + (state.centerX - worldX) / factor,
          centerY: worldY + (state.centerY - worldY) / factor,
          zoom: newZoom,
        },
      });
    }

    canvas.style.cursor = "grab";
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [canvasRef, state.centerX, state.centerY, state.zoom, dispatch, pixelToWorldDelta]);
}
