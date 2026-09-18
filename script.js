/* Jose Marquez — personal site. Two small behaviours, no dependencies. */

(function () {
  "use strict";

  /* ---- footer year ------------------------------------------------ */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- typewriter on the intro line -------------------------------
     The element ships with its full text already in the DOM, so the
     line reads correctly with JS off, with JS broken, and for
     crawlers. We only clear and retype when motion is welcome.     */

  var el = document.querySelector("[data-typewriter]");
  if (!el) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var text = el.dataset.typewriter || el.textContent;
  var i = 0;
  var SPEED = 78;      // ms per character
  var LEAD_IN = 450;   // ms before the first character lands

  /* Give assistive tech the finished line up front — the reveal is
     purely visual. aria-label goes on the heading, which has a role
     that reliably supports it; the span alone would not. */
  var heading = el.closest("h1");
  if (heading) heading.setAttribute("aria-label", text);

  /* The line is height-reserved in CSS (.hero__title min-height), so
     blanking it costs no vertical reflow. Width is deliberately left
     free: the block cursor should travel with the text. */
  el.textContent = "";

  function step() {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, SPEED);
  }

  setTimeout(step, LEAD_IN);
})();
