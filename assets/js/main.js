(function () {
  "use strict";

  /* mobile navigation */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  /* event list */
  var data = window.DUST_EVENTS || [];
  var ARROW = '<svg class="p-arrow" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M7 17L17 7M8 7h9v9"/></svg>';

  function row(e) {
    var inner =
      '<span class="p-title">' + e.name + '</span>' +
      '<span class="p-meta"><span class="p-cat">' + e.kind + '</span>' +
      '<span class="p-year">/' + e.year + '</span></span>' +
      ARROW;
    return '<li class="p-item">' +
      (e.url
        ? '<a href="' + e.url + '"' +
          (/^https?:/.test(e.url) && e.url.indexOf("thedustprotocol.com") === -1
            ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a>'
        : '<div>' + inner + '</div>') +
      '</li>';
  }

  function render(list, items) {
    var lim = parseInt(list.getAttribute("data-limit"), 10);
    var shown = isNaN(lim) ? items : items.slice(0, lim);
    list.innerHTML = shown.length
      ? shown.map(row).join("")
      : '<li class="events__empty">No events in this category yet.</li>';
  }

  /* every list starts populated — "All Categories" is the default */
  Array.prototype.forEach.call(document.querySelectorAll("[data-events]"), function (list) {
    render(list, data);
  });

  var buttons = document.querySelectorAll("[data-filter]");
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener("click", function () {
      var kind = btn.getAttribute("data-filter");
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute("aria-current", String(b === btn));
      });
      render(document.querySelector("[data-events]"),
        kind === "all" ? data : data.filter(function (e) { return e.kind === kind; }));
    });
  });

  /* home slider */
  var slider = document.querySelector("[data-slider]");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var fill = slider.querySelector("[data-progress]");
    var current = slider.querySelector("[data-current]");
    var i = 0, timer = null, DURATION = 7000;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function pad(n) { return (n < 10 ? "0" : "") + n; }

    function show(n) {
      i = (n + slides.length) % slides.length;

      Array.prototype.forEach.call(slides, function (s, k) {
        s.classList.toggle("is-active", k === i);
        s.setAttribute("aria-hidden", String(k !== i));
      });

      /* the bar tracks position in the set, as on the original */
      fill.style.transform = "scaleX(" + ((i + 1) / slides.length) + ")";
      current.textContent = pad(i + 1);

      /* a video slide only starts once it is on screen */
      var frame = slides[i].querySelector("iframe[data-src]");
      if (frame) {
        frame.src = frame.getAttribute("data-src");
        frame.removeAttribute("data-src");
      }

      clearTimeout(timer);
      if (!reduced) timer = setTimeout(function () { show(i + 1); }, DURATION);
    }

    slider.querySelector("[data-next]").addEventListener("click", function () { show(i + 1); });
    slider.querySelector("[data-prev]").addEventListener("click", function () { show(i - 1); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(i + 1);
      if (e.key === "ArrowLeft") show(i - 1);
    });

    document.body.classList.add("is-slider");
    document.querySelector(".masthead").classList.add("over");
    show(0);
  }

  /* back to top */
  var top = document.querySelector(".totop");
  if (top) {
    var show = function () {
      top.setAttribute("data-show", String(window.scrollY > 400));
    };
    window.addEventListener("scroll", show, { passive: true });
    show();
    top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
