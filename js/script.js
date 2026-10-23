/* Le Portail — interactions du site.
   Chaque module est indépendant et ne fait rien si ses éléments sont absents. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  var lang = (doc.lang || "fr").slice(0, 2) === "en" ? "en" : "fr";

  var TEXT = {
    fr: {
      days: ["", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"],
      openUntil: "Ouvert maintenant · jusqu'à {t}",
      opensToday: "Fermé · ouvre aujourd'hui à {t}",
      opensTomorrow: "Fermé · ouvre demain à {t}",
      opensOn: "Fermé · ouvre {d} à {t}",
      today: "Aujourd'hui",
      menuOpen: "Ouvrir le menu",
      menuClose: "Fermer le menu"
    },
    en: {
      days: ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      openUntil: "Open now · until {t}",
      opensToday: "Closed · opens today at {t}",
      opensTomorrow: "Closed · opens tomorrow at {t}",
      opensOn: "Closed · opens {d} at {t}",
      today: "Today",
      menuOpen: "Open menu",
      menuClose: "Close menu"
    }
  }[lang];

  /* Menu mobile ---------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    var desktop = window.matchMedia("(min-width: 56.25em)");

    function setOpen(open, restoreFocus) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? TEXT.menuClose : TEXT.menuOpen);
      nav.classList.toggle("is-open", open);
      if (!open && restoreFocus) toggle.focus();
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) setOpen(false, true);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });

    var onChange = function (mq) { if (mq.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* En-tête : filet au défilement ---------------------------------------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var update = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* Horaires : jour courant et statut d'ouverture ------------------------
     Les horaires sont lus dans le tableau HTML (attributs data-*),
     qui reste la seule source à modifier. Heure de référence : Zurich. */
  function zurichNow() {
    var parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Zurich",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return "";
    };
    var day = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }[get("weekday")];
    return { day: day, minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10) };
  }

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function formatTime(hhmm) {
    var p = hhmm.split(":");
    var h = parseInt(p[0], 10);
    if (lang === "fr") return h + "h" + p[1];
    var suffix = h >= 12 ? " pm" : " am";
    return ((h % 12) || 12) + ":" + p[1] + suffix;
  }

  function initHours() {
    var rows = document.querySelectorAll("[data-hours] tr[data-day]");
    var targets = document.querySelectorAll("[data-status]");
    if (!rows.length) return;

    var schedule = {};
    Array.prototype.forEach.call(rows, function (row) {
      var open = row.getAttribute("data-open");
      var close = row.getAttribute("data-close");
      schedule[row.getAttribute("data-day")] = open && close ? { open: open, close: close } : null;
    });

    function render() {
      var now;
      try { now = zurichNow(); } catch (e) { return; }
      if (!now.day) return;

      Array.prototype.forEach.call(rows, function (row) {
        var isToday = row.getAttribute("data-day") === String(now.day);
        row.classList.toggle("is-today", isToday);
        var th = row.querySelector("th");
        if (th) {
          if (isToday) th.setAttribute("data-today-label", TEXT.today);
          else th.removeAttribute("data-today-label");
        }
      });

      if (!targets.length) return;

      var today = schedule[now.day];
      var state = "closed";
      var message = "";

      if (today && now.minutes >= toMinutes(today.open) && now.minutes < toMinutes(today.close)) {
        state = "open";
        message = TEXT.openUntil.replace("{t}", formatTime(today.close));
      } else if (today && now.minutes < toMinutes(today.open)) {
        message = TEXT.opensToday.replace("{t}", formatTime(today.open));
      } else {
        for (var offset = 1; offset <= 7; offset++) {
          var d = ((now.day - 1 + offset) % 7) + 1;
          if (schedule[d]) {
            var template = offset === 1 ? TEXT.opensTomorrow : TEXT.opensOn;
            message = template.replace("{d}", TEXT.days[d]).replace("{t}", formatTime(schedule[d].open));
            break;
          }
        }
      }

      if (!message) return;
      Array.prototype.forEach.call(targets, function (el) {
        el.textContent = message;
        el.setAttribute("data-state", state);
        el.hidden = false;
      });
    }

    render();
    window.setInterval(render, 60000);
  }

  /* Apparition douce des sections ---------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add("is-visible"); });
      return;
    }

    doc.classList.add("has-reveal");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(items, function (el) { observer.observe(el); });
  }

  /* Année du pied de page ------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function init() {
    initMenu();
    initHeader();
    initHours();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
