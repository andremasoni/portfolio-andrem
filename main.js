/* ==========================================================================
   André Masoni Fraile — portfolio behaviour

   Progressive enhancement only. The page is fully readable without this file:
   the reveal animation is scoped to the `js` class that index.html adds to
   <html> before the first paint, so a blocked script leaves content visible.
   ========================================================================== */

(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */

  const themeToggle = document.getElementById("theme-toggle");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    // Storage throws in private mode and in restricted frames. Losing the
    // preference is acceptable; losing the toggle is not.
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      /* preference is not persisted */
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  /* ---------- headline split ---------- */

  const headline = document.querySelector(".hero h1");
  const WORD_STEP_MS = 55;

  if (headline && !prefersReducedMotion) {
    const pieces = [];

    // Text nodes are split per word; elements such as <mark> stay whole so the
    // highlight is not chopped into fragments.
    headline.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(function (chunk) {
          if (!chunk.trim()) {
            pieces.push(document.createTextNode(chunk));
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          word.textContent = chunk;
          pieces.push(word);
        });
      } else {
        node.classList.add("word");
        pieces.push(node);
      }
    });

    headline.replaceChildren.apply(headline, pieces);
    headline.querySelectorAll(".word").forEach(function (word, index) {
      word.style.animationDelay = index * WORD_STEP_MS + "ms";
    });
  }

  /* ---------- reveal on scroll ---------- */

  const revealables = document.querySelectorAll(".reveal");
  const STAGGER_STEP_MS = 70;
  const STAGGER_MAX_STEPS = 4;

  function revealAll() {
    revealables.forEach(function (element) {
      element.classList.add("shown");
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries
        .filter(function (entry) {
          return entry.isIntersecting;
        })
        // Entries arrive in observation order, not visual order. Sorting by
        // position is what makes the stagger read as top to bottom.
        .sort(function (a, b) {
          return a.boundingClientRect.top - b.boundingClientRect.top;
        })
        .forEach(function (entry, index) {
          const element = entry.target;
          const steps = Math.min(index, STAGGER_MAX_STEPS);

          element.style.transitionDelay = steps * STAGGER_STEP_MS + "ms";
          element.classList.add("shown");
          revealObserver.unobserve(element);

          // Clear the delay once used, so a later transition on the same
          // element does not inherit it.
          element.addEventListener("transitionend", function () {
            element.style.transitionDelay = "";
          }, { once: true });
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.05 });

    revealables.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  /* ---------- scroll driven UI ---------- */

  const header = document.querySelector(".topbar");
  const progressBar = document.getElementById("progress");
  const timeline = document.getElementById("migrations");
  const timelineFill = document.getElementById("mig-fill");
  const backToTop = document.getElementById("to-top");
  const timelineSteps = timeline ? Array.from(timeline.querySelectorAll(".mig")) : [];
  const BACK_TO_TOP_OFFSET = 700;
  const TIMELINE_TRIGGER = 0.55; // share of the viewport height used as the read line

  let frameRequested = false;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function publishHeaderHeight() {
    if (!header) return;
    // scroll-padding-top reads this, so anchors clear the sticky header even
    // when the nav wraps to a second line on narrow screens.
    root.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  function updateScrollUI() {
    frameRequested = false;

    // Read phase: every measurement happens before any style is written, so
    // the browser is not forced to recalculate layout mid-frame.
    const scrollY = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const timelineBox = timeline ? timeline.getBoundingClientRect() : null;
    const timelineProgressPx = timelineBox
      ? clamp(window.innerHeight * TIMELINE_TRIGGER - timelineBox.top, 0, timelineBox.height)
      : 0;
    const stepOffsets = timelineBox
      ? timelineSteps.map(function (step) { return step.offsetTop; })
      : [];

    // Write phase.
    if (progressBar) {
      const progress = scrollableHeight > 0 ? scrollY / scrollableHeight : 0;
      progressBar.style.transform = "scaleX(" + clamp(progress, 0, 1) + ")";
    }

    if (timelineFill && timelineBox && timelineBox.height > 0) {
      const travelled = window.innerHeight * TIMELINE_TRIGGER - timelineBox.top;
      timelineFill.style.transform = "scaleY(" + clamp(travelled / timelineBox.height, 0, 1) + ")";
    }

    timelineSteps.forEach(function (step, index) {
      step.classList.toggle("reached", timelineProgressPx >= stepOffsets[index]);
    });

    if (backToTop) {
      backToTop.classList.toggle("visible", scrollY > BACK_TO_TOP_OFFSET);
    }
  }

  function requestScrollUpdate() {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateScrollUI);
  }

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", function () {
    publishHeaderHeight();
    requestScrollUpdate();
  }, { passive: true });

  publishHeaderHeight();
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- scrollspy ---------- */

  const navLinks = Array.from(document.querySelectorAll(".topnav a"));
  const sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("current", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- copy e-mail ---------- */

  const copyButton = document.getElementById("copy-email");

  if (copyButton) {
    const label = copyButton.querySelector(".copy-label");
    const idleText = label.textContent;
    const email = copyButton.getAttribute("data-email");
    const FEEDBACK_MS = 2000;
    let resetTimer;

    function showCopied() {
      label.textContent = "E-mail copiado";
      copyButton.classList.add("done");

      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        label.textContent = idleText;
        copyButton.classList.remove("done");
      }, FEEDBACK_MS);
    }

    function openMailClient() {
      window.location.href = "mailto:" + email;
    }

    copyButton.addEventListener("click", function () {
      // The Clipboard API is missing on old browsers and rejected when the
      // page is not a secure context. Both cases fall back to the mail client.
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        openMailClient();
        return;
      }
      navigator.clipboard.writeText(email).then(showCopied, openMailClient);
    });
  }
})();
