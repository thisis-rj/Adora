/* =====================================================================
   Adora — landing page behaviour
   ===================================================================== */
(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ------------------------------------------------------------------
     Image slots
     Every <img data-img-slot> falls back to its tinted container and
     labels the filename it is waiting for, so a missing asset never
     collapses the layout.
     ------------------------------------------------------------------ */
  function markEmpty(img) {
    var box = img.closest(".media");
    img.style.display = "none";
    if (!box) return;
    box.classList.add("is-empty");
    box.setAttribute("data-slot", img.getAttribute("src").split("/").pop());
  }

  $$("img[data-img-slot]").forEach(function (img) {
    img.addEventListener("error", function () { markEmpty(img); });
    // Cached failures fire before this script runs.
    if (img.complete && img.naturalWidth === 0) markEmpty(img);
  });

  /* ------------------------------------------------------------------
     Header: solid once scrolled, and mobile menu
     ------------------------------------------------------------------ */
  var header = $("#siteHeader");
  var nav = $("#siteNav");
  var navToggle = $("#navToggle");

  var onScroll = function () {
    header.classList.toggle("is-stuck", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  navToggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ------------------------------------------------------------------
     Scroll reveals + current section in the nav
     ------------------------------------------------------------------ */
  var revealables = $$(".reveal");

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealables.forEach(function (el) { revealer.observe(el); });

    var navLinks = $$(".site-nav a");
    var watched = navLinks
      .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    watched.forEach(function (el) { spy.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ------------------------------------------------------------------
     01 · Water report
     Placeholder figures only — swap SAMPLE_WATER_DATA for a real
     groundwater API before launch.
     ------------------------------------------------------------------ */
  var SAMPLE_WATER_DATA = {
    "560": { place: "Bangalore", hardness: 412, iron: 0.72, chlorine: 0.31, tds: 180 },
    "110": { place: "Delhi",     hardness: 486, iron: 0.54, chlorine: 0.44, tds: 320 },
    "400": { place: "Mumbai",    hardness: 214, iron: 0.21, chlorine: 0.52, tds: 165 },
    "600": { place: "Chennai",   hardness: 505, iron: 0.63, chlorine: 0.28, tds: 410 },
    "700": { place: "Kolkata",   hardness: 268, iron: 0.94, chlorine: 0.33, tds: 240 },
    "500": { place: "Hyderabad", hardness: 398, iron: 0.48, chlorine: 0.36, tds: 295 },
    "411": { place: "Pune",      hardness: 246, iron: 0.29, chlorine: 0.41, tds: 190 },
    "380": { place: "Ahmedabad", hardness: 534, iron: 0.67, chlorine: 0.30, tds: 460 }
  };
  var DEFAULT_READING = { place: "Your area", hardness: 355, iron: 0.58, chlorine: 0.35, tds: 265 };

  var THRESHOLDS = {
    hardness: [180, 300],
    iron:     [0.3, 0.6],
    chlorine: [0.25, 0.5],
    tds:      [200, 350]
  };

  function levelFor(metric, value) {
    var t = THRESHOLDS[metric];
    if (value >= t[1]) return ["High", "level--high"];
    if (value >= t[0]) return ["Medium", "level--med"];
    return ["Low", "level--low"];
  }

  function formatValue(metric, value) {
    return metric === "iron" || metric === "chlorine" ? value.toFixed(2) : String(Math.round(value));
  }

  var form = $("#pincodeForm");
  var input = $("#pincode");
  var errorEl = $("#pincodeError");
  var card = $("#reportCard");

  function renderReading(reading, pincode) {
    card.classList.add("is-updating");

    window.setTimeout(function () {
      $("#reportPlace").textContent = reading.place + ", " + pincode;

      Object.keys(THRESHOLDS).forEach(function (metric) {
        var valueEl = card.querySelector('[data-metric="' + metric + '"]');
        var levelEl = card.querySelector('[data-level="' + metric + '"]');
        var level = levelFor(metric, reading[metric]);

        valueEl.textContent = formatValue(metric, reading[metric]);
        levelEl.textContent = "(" + level[0] + ")";
        levelEl.className = "level " + level[1];
      });

      card.classList.remove("is-updating");
    }, 260);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = input.value.trim();

    if (!/^\d{6}$/.test(value)) {
      form.classList.add("is-invalid");
      errorEl.textContent = "Please enter a valid six-digit pincode.";
      errorEl.hidden = false;
      input.focus();
      return;
    }

    form.classList.remove("is-invalid");
    errorEl.hidden = true;
    renderReading(SAMPLE_WATER_DATA[value.slice(0, 3)] || DEFAULT_READING, value);
  });

  input.addEventListener("input", function () {
    input.value = input.value.replace(/\D/g, "").slice(0, 6);
    if (form.classList.contains("is-invalid")) {
      form.classList.remove("is-invalid");
      errorEl.hidden = true;
    }
  });

  /* ------------------------------------------------------------------
     04 · Results tabs and stat bars
     ------------------------------------------------------------------ */
  var RESULTS_DATA = {
    hair:   [["Less buildup", 92], ["Smoother texture", 89], ["Shinier hair", 87]],
    skin:   [["Less dryness", 90], ["Calmer skin", 84], ["Less irritation", 81]],
    shower: [["Less scale", 94], ["Cleaner tiles", 88], ["Fresher water", 85]]
  };

  var statsPanel = $("#statsPanel");
  var tabs = $$(".tabs [role='tab']");

  function renderStats(key) {
    statsPanel.innerHTML = RESULTS_DATA[key].map(function (row) {
      return '<div class="stat">' +
               '<span class="stat__name">' + row[0] + '</span>' +
               '<span class="stat__track"><span class="stat__fill" data-target="' + row[1] + '"></span></span>' +
               '<span class="stat__value">' + row[1] + '%</span>' +
             '</div>';
    }).join("");
  }

  function fillBars() {
    $$(".stat__fill", statsPanel).forEach(function (bar) {
      // Next frame, so the transition has a 0 width to animate from.
      requestAnimationFrame(function () {
        bar.style.width = bar.getAttribute("data-target") + "%";
      });
    });
  }

  renderStats("hair");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });
      statsPanel.setAttribute("aria-labelledby", tab.id);
      renderStats(tab.id.replace("tab-", ""));
      fillBars();
    });
  });

  if ("IntersectionObserver" in window) {
    var statsWatcher = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fillBars();
        statsWatcher.disconnect();
      });
    }, { threshold: 0.3 });
    statsWatcher.observe(statsPanel);
  } else {
    fillBars();
  }

  /* ------------------------------------------------------------------
     04 · Before / after comparison
     ------------------------------------------------------------------ */
  var compare = $("#compare");
  var handle = $("#compareHandle");
  var dragging = false;

  function setPosition(percent) {
    var clamped = Math.max(0, Math.min(100, percent));
    compare.style.setProperty("--pos", clamped + "%");
    handle.setAttribute("aria-valuenow", String(Math.round(clamped)));
  }

  function positionFromEvent(e) {
    var rect = compare.getBoundingClientRect();
    setPosition(((e.clientX - rect.left) / rect.width) * 100);
  }

  setPosition(50);

  handle.addEventListener("pointerdown", function (e) {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener("pointermove", function (e) {
    if (dragging) positionFromEvent(e);
  });

  handle.addEventListener("pointerup", function (e) {
    dragging = false;
    if (handle.hasPointerCapture(e.pointerId)) handle.releasePointerCapture(e.pointerId);
  });

  compare.addEventListener("click", function (e) {
    if (e.target !== handle && !handle.contains(e.target)) positionFromEvent(e);
  });

  handle.addEventListener("keydown", function (e) {
    var step = e.shiftKey ? 10 : 4;
    var now = Number(handle.getAttribute("aria-valuenow"));
    if (e.key === "ArrowLeft")       { setPosition(now - step); e.preventDefault(); }
    else if (e.key === "ArrowRight") { setPosition(now + step); e.preventDefault(); }
    else if (e.key === "Home")       { setPosition(0);  e.preventDefault(); }
    else if (e.key === "End")        { setPosition(100); e.preventDefault(); }
  });

  /* ------------------------------------------------------------------
     05 · Testimonial carousel
     ------------------------------------------------------------------ */
  var TESTIMONIALS = [
    { quote: "The cartridge came out orange at day ninety. That was the argument.", name: "Nikhil S.", avatar: "assets/images/avatar-nikhil.webp" },
    { quote: "My hair feels softer, my skin is less dry, and my showers just feel better.", name: "Aditi R.", avatar: "assets/images/avatar-aditi.webp" },
    { quote: "I stopped finding white scale on the tiles within a fortnight.", name: "Meera K.", avatar: "assets/images/avatar-meera.webp" },
    { quote: "Bangalore water wrecked my hair for two years. This finally fixed it.", name: "Rohan D.", avatar: "assets/images/avatar-rohan.webp" }
  ];

  var quoteA = $("#quoteA");
  var quoteB = $("#quoteB");
  var voiceIndex = 0;

  function paintQuote(figure, item) {
    figure.querySelector("blockquote").textContent = "“" + item.quote + "”";
    figure.querySelector("figcaption b").textContent = item.name;

    var img = figure.querySelector(".avatar img");
    var fresh = img.cloneNode(true);
    fresh.style.display = "";
    fresh.src = item.avatar;
    fresh.addEventListener("error", function () { fresh.style.display = "none"; });
    img.replaceWith(fresh);
  }

  function showPair(index) {
    var total = TESTIMONIALS.length;
    voiceIndex = ((index % total) + total) % total;

    [quoteA, quoteB].forEach(function (f) { f.classList.add("is-swapping"); });

    window.setTimeout(function () {
      paintQuote(quoteA, TESTIMONIALS[voiceIndex]);
      paintQuote(quoteB, TESTIMONIALS[(voiceIndex + 1) % total]);
      [quoteA, quoteB].forEach(function (f) { f.classList.remove("is-swapping"); });
    }, 300);
  }

  $("#voiceNext").addEventListener("click", function () { showPair(voiceIndex + 2); });
  $("#voicePrev").addEventListener("click", function () { showPair(voiceIndex - 2); });

})();
