const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

if (finePointer.matches) {
  const dot = document.createElement("div");
  const ring = document.createElement("div");

  dot.className = "custom-cursor-dot";
  ring.className = "custom-cursor-ring";

  document.body.append(dot, ring);
  document.documentElement.classList.add("custom-cursor-enabled");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;

  const move = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.transform =
      `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    dot.classList.add("is-visible");
    ring.classList.add("is-visible");
  };

  const animate = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;

    ring.style.transform =
      `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(animate);
  };

  window.addEventListener("pointermove", move);

  document.addEventListener("pointerover", (event) => {
    if (
      event.target.closest(
        "a, button, input, textarea, select, [role='button']"
      )
    ) {
      ring.classList.add("is-hovering");
      dot.classList.add("is-hovering");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (
      event.target.closest(
        "a, button, input, textarea, select, [role='button']"
      )
    ) {
      ring.classList.remove("is-hovering");
      dot.classList.remove("is-hovering");
    }
  });

  window.addEventListener("pointerdown", () => {
    ring.classList.add("is-clicking");
  });

  window.addEventListener("pointerup", () => {
    ring.classList.remove("is-clicking");
  });

  document.documentElement.addEventListener("mouseleave", () => {
    dot.classList.remove("is-visible");
    ring.classList.remove("is-visible");
  });

  animate();
}
