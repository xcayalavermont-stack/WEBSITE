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

  // Conditional hero video loading: skip only when reduced-motion is requested
  var video = document.getElementById("heroVideo");
  if (video) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      var source = video.querySelector("source[data-src]");
      if (source) {
        source.src = source.getAttribute("data-src");
        video.load();
        video.play().catch(function () {
          /* autoplay can be blocked; poster image remains visible */
        });
      }
    }
  }
})();
