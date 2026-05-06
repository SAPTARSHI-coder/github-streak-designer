'use strict';

/**
 * js/customizer.js — Designer editor logic
 *
 * Reads ?template= from URL on load.
 * Manages state, re-renders SVG preview on every control change.
 * Builds the README API URL for copying.
 */

/* globals Icons, Templates, Palettes */

// ── API base (update this after deploying the tracker to Vercel) ─────────────
var API_BASE = 'https://github-streak-tracker-for-all.vercel.app';

// ── Font stacks ───────────────────────────────────────────────────────────────
var FONT_STACKS = {
  inter:        "'Inter', 'Helvetica Neue', Arial, sans-serif",
  jetbrains:    "'JetBrains Mono', 'Fira Code', monospace",
  spacegrotesk: "'Space Grotesk', 'Segoe UI', sans-serif",
  mono:         "'Courier New', Courier, monospace",
};

// ── State ─────────────────────────────────────────────────────────────────────
var state = {
  username:     'SAPTARSHI-coder',
  template:     'ember',
  palette:      'dark',
  font:         'inter',
  layout:       'row',
  borderRadius: 10,
  borderWidth:  1,
  borderStyle:  'solid',
  custom:       null,   // populated from Palettes.custom
  // preview data
  previewTotal:   1247,
  previewCurrent: 42,
  previewLongest: 87,
};

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // clone custom palette from Palettes global
  state.custom = Object.assign({}, Palettes.custom);

  // read ?template= from URL
  var params   = new URLSearchParams(window.location.search);
  var tmplParam = params.get('template');
  if (tmplParam && Templates.registry[tmplParam]) {
    state.template = tmplParam;
    var btn = document.querySelector('[data-template="' + tmplParam + '"]');
    if (btn) setActive('.tmpl-btn', btn);
  }

  bindControls();
  render();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function setActive(selector, activeEl) {
  document.querySelectorAll(selector).forEach(function (el) {
    el.classList.toggle('active', el === activeEl);
  });
}

function resolveColors() {
  if (state.palette === 'custom') return Object.assign({}, state.custom);
  return Object.assign({}, Palettes.palettes[state.palette]);
}

function buildPreviewData() {
  return {
    username:             state.username || 'your-username',
    totalContributions:   state.previewTotal,
    currentStreak:        state.previewCurrent,
    longestStreak:        state.previewLongest,
    streakStart:          '2026-04-01',
    streakEnd:            '2026-05-06',
    longestStreakStart:   '2026-01-01',
    longestStreakEnd:     '2026-02-26',
    lastContributionDate: '2026-05-06',
  };
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  var fn  = Templates.getTemplate(state.template);
  var svg = fn(buildPreviewData(), {
    colors:       resolveColors(),
    font:         FONT_STACKS[state.font],
    layout:       state.layout,
    borderRadius: state.borderRadius,
    borderWidth:  state.borderWidth,
    borderStyle:  state.borderStyle,
  });

  $('preview-wrap').innerHTML = svg;
  updateURL();
}

// ── Build API URL ─────────────────────────────────────────────────────────────
function buildURL() {
  var p = new URLSearchParams({
    username: state.username || 'your-username',
    template: state.template,
    palette:  state.palette,
    font:     state.font,
    layout:   state.layout,
  });
  if (state.palette === 'custom') {
    var c = state.custom;
    p.set('bg',     c.bg);
    p.set('accent', c.accent);
    p.set('border', c.border);
  }
  return API_BASE + '/streak?' + p.toString();
}

function updateURL() {
  var url = buildURL();
  var el  = $('url-preview');
  if (el) el.textContent = url;
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function toast(msg) {
  var t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// ── Bind controls ─────────────────────────────────────────────────────────────
function bindControls() {

  // Template buttons
  document.querySelectorAll('.tmpl-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.template = btn.dataset.template;
      setActive('.tmpl-btn', btn);
      render();
    });
  });

  // Layout buttons
  document.querySelectorAll('.layout-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.layout = btn.dataset.layout;
      setActive('.layout-btn', btn);
      render();
    });
  });

  // Palette swatches
  document.querySelectorAll('.palette-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.palette = btn.dataset.palette;
      setActive('.palette-btn', btn);
      var customPanel = $('custom-panel');
      if (customPanel) customPanel.hidden = (state.palette !== 'custom');
      render();
    });
  });

  // Font buttons
  document.querySelectorAll('.font-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.font = btn.dataset.font;
      setActive('.font-btn', btn);
      render();
    });
  });

  // Border style buttons
  document.querySelectorAll('.border-style-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.borderStyle = btn.dataset.style;
      setActive('.border-style-btn', btn);
      render();
    });
  });

  // Border radius slider
  var radiusSlider = $('ctrl-radius');
  if (radiusSlider) {
    radiusSlider.addEventListener('input', function () {
      state.borderRadius = +this.value;
      $('radius-val').textContent = this.value + 'px';
      render();
    });
  }

  // Border width slider
  var bwSlider = $('ctrl-border-width');
  if (bwSlider) {
    bwSlider.addEventListener('input', function () {
      state.borderWidth = +this.value;
      $('border-width-val').textContent = this.value + 'px';
      render();
    });
  }

  // Username input
  var uInput = $('ctrl-username');
  if (uInput) {
    uInput.addEventListener('input', function () {
      state.username = this.value.trim();
      render();
    });
  }

  // Preview number inputs
  ['total', 'current', 'longest'].forEach(function (key) {
    var el = $('ctrl-' + key);
    if (!el) return;
    el.addEventListener('input', function () {
      state['preview' + key.charAt(0).toUpperCase() + key.slice(1)] = parseInt(this.value, 10) || 0;
      render();
    });
  });

  // Custom color pickers
  var COLOR_KEYS = ['bg', 'border', 'title', 'value', 'accent', 'accentAlt', 'accentGreen', 'subtext', 'divider'];
  COLOR_KEYS.forEach(function (key) {
    var picker = $('cc-' + key);
    var hexIn  = $('cc-' + key + '-hex');
    if (!picker || !hexIn) return;

    picker.addEventListener('input', function () {
      state.custom[key] = this.value;
      hexIn.value = this.value;
      if (state.palette === 'custom') render();
    });
    hexIn.addEventListener('input', function () {
      if (/^#[0-9a-fA-F]{6}$/.test(this.value)) {
        state.custom[key] = this.value;
        picker.value = this.value;
        if (state.palette === 'custom') render();
      }
    });
  });

  // Copy README link
  var copyLink = $('btn-copy-link');
  if (copyLink) {
    copyLink.addEventListener('click', function () {
      var url = buildURL();
      var md  = '![GitHub Streak](' + url + ')';
      navigator.clipboard.writeText(md).then(function () { toast('README markdown copied!'); });
    });
  }

  // Copy raw SVG
  var copySvg = $('btn-copy-svg');
  if (copySvg) {
    copySvg.addEventListener('click', function () {
      var svgEl = $('preview-wrap').querySelector('svg');
      if (!svgEl) return;
      navigator.clipboard.writeText(svgEl.outerHTML).then(function () { toast('SVG copied!'); });
    });
  }

  // Copy URL only
  var copyUrl = $('btn-copy-url');
  if (copyUrl) {
    copyUrl.addEventListener('click', function () {
      navigator.clipboard.writeText(buildURL()).then(function () { toast('URL copied!'); });
    });
  }
}
