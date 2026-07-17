(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Hero video: respect reduced-motion; otherwise nudge autoplay as a fallback
  // for browsers/devices that ignore the autoplay attribute on first paint.
  var video = document.getElementById("heroVideo");
  if (video) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.pause();
      video.removeAttribute("autoplay");
    } else {
      var tryPlay = function () {
        video.play().catch(function () {
          /* autoplay can be blocked; poster image remains visible */
        });
      };
      tryPlay();
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && video.paused) tryPlay();
      });
    }
  }
})();
