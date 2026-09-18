/* Jose Marquez — personal site. Three small behaviours, no dependencies. */

/* =============================================================
   Theme selector
   -------------------------------------------------------------
   <head> has already resolved and applied the theme before paint;
   this only wires up the button, keeps the label honest, and
   persists a deliberate choice.

   Until the visitor actually picks a side, nothing is stored and
   the page keeps following the OS live. The first click locks it.
   ============================================================= */

(function () {
  "use strict";

  var KEY = "theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var label = btn.querySelector(".theme-toggle__label");
  var meta = document.querySelector('meta[name="theme-color"]');
  var BAR = { dark: "#0d1320", light: "#f2e9dc" };   // keep in sync with --ink-900

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (label) label.textContent = theme;
    btn.title = "Switch to " + (theme === "dark" ? "light" : "dark") + " theme";
    if (meta) meta.setAttribute("content", BAR[theme]);
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode — fine */ }
    }
  }

  // Sync the label with whatever <head> already decided.
  apply(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);

  btn.addEventListener("click", function () {
    apply(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
  });

  // No stored preference => keep tracking the OS if it changes mid-visit.
  var sys = window.matchMedia("(prefers-color-scheme: light)");
  function onSystemChange(e) {
    if (!stored()) apply(e.matches ? "light" : "dark", false);
  }
  if (sys.addEventListener) sys.addEventListener("change", onSystemChange);
  else if (sys.addListener) sys.addListener(onSystemChange);   // Safari < 14
})();


/* =============================================================
   Footer year
   ============================================================= */

(function () {
  "use strict";
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();


/* =============================================================
   Typewriter on the intro line
   -------------------------------------------------------------
   The element ships with its full text already in the DOM, so the
   line reads correctly with JS off, with JS broken, and for
   crawlers. We only clear and retype when motion is welcome.
   ============================================================= */

(function () {
  "use strict";

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
