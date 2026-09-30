import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    if (!finePointer.matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animationFrame;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)
        translate(-50%, -50%)`;

      dot.classList.add("cursor-visible");
      ring.classList.add("cursor-visible");
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)
        translate(-50%, -50%)`;

      animationFrame = requestAnimationFrame(animateRing);
    };

    const handleOver = (e) => {
      const interactive = e.target.closest(
        "a, button, input, textarea, select, [role='button'], .cursor-hover"
      );

      if (interactive) {
        ring.classList.add("cursor-hovering");
        dot.classList.add("cursor-hovering");
      }
    };

    const handleOut = (e) => {
      const interactive = e.target.closest(
        "a, button, input, textarea, select, [role='button'], .cursor-hover"
      );

      if (interactive) {
        ring.classList.remove("cursor-hovering");
        dot.classList.remove("cursor-hovering");
      }
    };

    const handleDown = () => {
      ring.classList.add("cursor-clicking");
    };

    const handleUp = () => {
      ring.classList.remove("cursor-clicking");
    };

    const hideCursor = () => {
      dot.classList.remove("cursor-visible");
      ring.classList.remove("cursor-visible");
    };

    window.addEventListener("pointermove", moveCursor);
    document.addEventListener("pointerover", handleOver);
    document.addEventListener("pointerout", handleOut);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.documentElement.addEventListener("mouseleave", hideCursor);

    animateRing();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("pointerout", handleOut);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="premium-cursor-ring" />
      <div ref={dotRef} className="premium-cursor-dot" />
    </>
  );
}