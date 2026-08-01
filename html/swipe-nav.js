(function () {
  // Order controls which sheet is "next" / "previous" when swiping.
  // Add/remove/reorder filenames here to change the cycle.
  const order = [
    "Barbarian.html",
    "Barbarianshadows.html",
    "warrior.html",
    "warriorshadows.html",
    "rogue.html",
    "mage.html",
    "mageshadows.html",
    "Ranger.html",
    "Rangershadows.html",
    "bard.html"
  ];

  const current = window.location.pathname.split("/").pop();
  const idx = order.indexOf(current);
  if (idx === -1) return; // this page isn't part of the cycle, do nothing

  function goTo(i) {
    if (i < 0 || i >= order.length) return;
    window.location.href = order[i];
  }

  // ---- Swipe / drag detection (Pointer Events cover touch AND mouse,
  // so this is testable by click-dragging on a desktop browser too) ----
  let startX = 0;
  let startY = 0;
  let tracking = false;

  document.addEventListener("pointerdown", (e) => {
    tracking = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  document.addEventListener("pointerup", (e) => {
    if (!tracking) return;
    tracking = false;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // require a mostly-horizontal, deliberate swipe so vertical
    // scrolling / tapping ability rows isn't hijacked
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) {
      if (dx < 0) {
        goTo(idx + 1); // swipe/drag left -> next
      } else {
        goTo(idx - 1); // swipe/drag right -> previous
      }
    }
  });

  // ---- Small on-screen hint + dot indicator (also click/tap-able,
  // handy for testing on a desktop browser with no touchscreen) ----
  const bar = document.createElement("div");
  bar.style.position = "fixed";
  bar.style.bottom = "10px";
  bar.style.left = "50%";
  bar.style.transform = "translateX(-50%)";
  bar.style.display = "flex";
  bar.style.flexDirection = "column";
  bar.style.alignItems = "center";
  bar.style.gap = "4px";
  bar.style.zIndex = "2000";
  bar.style.pointerEvents = "none"; // dots handle their own clicks below
  bar.style.fontFamily = "inherit";

  const hint = document.createElement("div");
  hint.textContent = "‹ swipe to browse heroes ›";
  hint.style.color = "rgba(255,255,255,0.8)";
  hint.style.fontSize = "12px";
  hint.style.textShadow = "0 0 4px rgba(0,0,0,0.8)";
  bar.appendChild(hint);

  const dots = document.createElement("div");
  dots.style.display = "flex";
  dots.style.gap = "6px";
  dots.style.pointerEvents = "auto";

  order.forEach((file, i) => {
    const dot = document.createElement("div");
    dot.title = file.replace(".html", "");
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.cursor = "pointer";
    dot.style.background = i === idx ? "crimson" : "rgba(255,255,255,0.4)";
    dot.style.boxShadow = i === idx ? "0 0 6px rgba(255,50,50,0.9)" : "none";
    dot.addEventListener("click", () => goTo(i));
    dots.appendChild(dot);
  });
  bar.appendChild(dots);

  document.body.appendChild(bar);
})();
