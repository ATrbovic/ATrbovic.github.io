/**
 * tree-sway.js
 * Fetches the branch overlay SVG, inlines it as real DOM, then splits paths into
 * three weight classes (heavy / medium / light) so each class animates independently
 * — thicker branches barely move, thin twigs swing freely.
 */
(function treeSway() {
  'use strict';

  const SVG_SRC = 'sunny-tree-branches-overlay-v2.svg';

  // Weight classes: thresholds are stroke-width values read from each <path>
  const CLASSES = [
    { name: 'ts-heavy',  minSW: 10,  },
    { name: 'ts-medium', minSW: 3.5, },
    { name: 'ts-light',  minSW: 0,   },
  ];

  let overlayEl = null;  // the wrapper div
  let svgLoaded  = false;

  // ── Build ────────────────────────────────────────────────────────────────────

  function buildOverlay(svgText) {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(svgText, 'image/svg+xml');
    const svg    = doc.querySelector('svg');
    if (!svg) return;

    // Give the SVG element itself no fixed width/height — it will fill its parent
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;top:0;left:0;';

    // Collect every <path> in the document
    const allPaths = Array.from(svg.querySelectorAll('path'));

    // Create one <g> per weight class
    const wrappers = CLASSES.map(c => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', c.name);
      return g;
    });

    // Pull each path out of its current parent and drop it into the right bucket
    allPaths.forEach(path => {
      const sw = parseFloat(path.getAttribute('stroke-width') || '2');
      let bucket = wrappers[wrappers.length - 1]; // default → lightest
      for (let i = 0; i < CLASSES.length; i++) {
        if (sw >= CLASSES[i].minSW) { bucket = wrappers[i]; break; }
      }
      path.parentNode.removeChild(path);
      bucket.appendChild(path);
    });

    // Append wrappers that received at least one path, preserving existing
    // non-path children (defs, ellipses, etc.) which stay in document order
    const firstG = svg.querySelector('g');
    wrappers.forEach(g => {
      if (g.childElementCount > 0) {
        if (firstG) svg.insertBefore(g, firstG);
        else        svg.appendChild(g);
      }
    });

    // Wrapper div — overscan by 50px on each side so movement never exposes an edge
    overlayEl = document.createElement('div');
    overlayEl.id = 'tree-sway-overlay';
    overlayEl.style.cssText = [
      'position:fixed',
      'inset:-50px',
      'pointer-events:none',
      'z-index:1',
      'overflow:hidden',
      'opacity:0',
      'transition:opacity 0.5s ease',
      'mix-blend-mode:multiply',
    ].join(';');

    overlayEl.appendChild(svg);
    document.body.appendChild(overlayEl);
    svgLoaded = true;

    // Sync visibility to whatever the theme currently is
    applyTheme(document.documentElement.getAttribute('data-theme') || 'light');
  }

  // ── Theme sync ───────────────────────────────────────────────────────────────

  function applyTheme(theme) {
    if (!overlayEl) return;
    overlayEl.style.opacity = (theme === 'sunny') ? '1' : '0';
  }

  function initIfNeeded() {
    if (svgLoaded) return;
    svgLoaded = true; // set eagerly to prevent duplicate fetches
    fetch(SVG_SRC)
      .then(r => { if (!r.ok) throw r.status; return r.text(); })
      .then(buildOverlay)
      .catch(err => {
        svgLoaded = false;
        console.warn('tree-sway: could not load overlay SVG:', err);
      });
  }

  // ── Observe theme changes ────────────────────────────────────────────────────

  new MutationObserver(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    if (theme === 'sunny') initIfNeeded();
    applyTheme(theme);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // ── DOM ready ────────────────────────────────────────────────────────────────

  function onDOMReady() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    if (theme === 'sunny') initIfNeeded();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMReady);
  } else {
    onDOMReady();
  }
})();
