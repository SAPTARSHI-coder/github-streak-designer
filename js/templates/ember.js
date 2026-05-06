'use strict';

/**
 * templates/ember.js — Dark bg, warm accent card (UMD)
 *
 * Template personality:
 *  - Solid rounded-rect card with accent-colored border
 *  - Title bar at top with username
 *  - 3-column stat layout (row/hero) or 3-row layout (stacked)
 *  - No emojis — custom SVG path icons from icons.js
 *
 * function ember(data, options) → SVG string
 */

/* global globalThis, window */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory(require('../icons'));
  } else {
    root.EmberTemplate = factory(root.Icons);
  }
})(
  typeof globalThis !== 'undefined' ? globalThis
    : typeof window !== 'undefined' ? window : this,
  function (icons) {

    // ── Format "YYYY-MM-DD" → "May 6, 2026" ────────────────────────────────
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function fmt(d) {
      if (!d) return '';
      var p = d.split('-');
      return MONTHS[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
    }

    function esc(s) {
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ── Layout lookup ───────────────────────────────────────────────────────
    var LAYOUTS = {
      row: {
        W: 495, H: 195,
        titleY: 20, dividerY: 30,
        cols: [
          { x: 82,  yIcon: 60, yLabel: 84, yValue: 115, yDate: 133 },
          { x: 248, yIcon: 60, yLabel: 84, yValue: 115, yDate: 133 },
          { x: 413, yIcon: 60, yLabel: 84, yValue: 115, yDate: 133 },
        ],
        vDividers: [
          { x: 165, y1: 30, y2: 180 },
          { x: 330, y1: 30, y2: 180 },
        ],
        hDividers: [],
        footerY: 188,
      },
      stacked: {
        W: 495, H: 235,
        titleY: null, // no title bar in stacked
        dividerY: null,
        cols: [
          { x: 248, yIcon: 30,  yLabel: 52,  yValue: 78,  yDate: 95  },
          { x: 248, yIcon: 100, yLabel: 122, yValue: 148, yDate: 165 },
          { x: 248, yIcon: 170, yLabel: 192, yValue: 218, yDate: — },
        ],
        vDividers: [],
        hDividers: [
          { y: 90,  x1: 30, x2: 465 },
          { y: 160, x1: 30, x2: 465 },
        ],
        footerY: null,
      },
      hero: {
        W: 495, H: 195,
        titleY: 20, dividerY: 30,
        cols: [
          { x: 82,  yIcon: 75,  yLabel: 97,  yValue: 124, yDate: 140, scale: 0.85 },
          { x: 248, yIcon: 48,  yLabel: 70,  yValue: 100, yDate: 118, scale: 1.2  },
          { x: 413, yIcon: 75,  yLabel: 97,  yValue: 124, yDate: 140, scale: 0.85 },
        ],
        vDividers: [
          { x: 165, y1: 20, y2: 180 },
          { x: 330, y1: 20, y2: 180 },
        ],
        hDividers: [],
        footerY: 188,
      },
    };

    // ── Render a single stat column ─────────────────────────────────────────
    function renderStat(col, opts) {
      var scale    = col.scale || 1;
      var iconSize = Math.round(22 * scale);
      var valSize  = Math.round(28 * scale);
      var labelSize = Math.round(10 * scale);
      var dateSize = Math.round(9.5 * scale);
      var iconX    = col.x - Math.round(iconSize / 2);

      var iconSvg = opts.icon.replace(/FILL/g, opts.color);

      return [
        // icon
        '<svg x="' + iconX + '" y="' + (col.yIcon - iconSize) + '" width="' + iconSize + '" height="' + iconSize + '" viewBox="0 0 24 24">' + iconSvg + '</svg>',
        // label
        '<text x="' + col.x + '" y="' + col.yLabel + '" text-anchor="middle"',
        '  font-family="' + opts.font + '" font-size="' + labelSize + '" fill="' + opts.labelColor + '" letter-spacing="0.8">',
        '  ' + esc(opts.label),
        '</text>',
        // value
        '<text x="' + col.x + '" y="' + col.yValue + '" text-anchor="middle"',
        '  font-family="' + opts.font + '" font-size="' + valSize + '" font-weight="700" fill="' + opts.color + '">',
        '  ' + esc(opts.value),
        '</text>',
        // date sub-label
        col.yDate
          ? '<text x="' + col.x + '" y="' + col.yDate + '" text-anchor="middle"'
          + '  font-family="' + opts.font + '" font-size="' + dateSize + '" fill="' + opts.subtextColor + '">'
          + '  ' + esc(opts.sub || '')
          + '</text>'
          : '',
      ].join('\n');
    }

    // ── Main template function ──────────────────────────────────────────────
    function ember(data, options) {
      var layout  = LAYOUTS[options.layout] || LAYOUTS.row;
      var C       = options.colors;
      var font    = options.font || "'Inter', sans-serif";
      var radius  = options.borderRadius != null ? options.borderRadius : 10;
      var bWidth  = options.borderWidth  != null ? options.borderWidth  : 1;
      var bStyle  = options.borderStyle  || 'solid';
      var W = layout.W, H = layout.H;

      var strokeDasharray = bStyle === 'dashed' ? ' stroke-dasharray="6 3"' : '';
      var strokeWidth     = bStyle === 'none'   ? 0 : bWidth;

      var isStacked = options.layout === 'stacked';

      // streak sub-labels
      var currentSub = data.currentStreak > 0
        ? fmt(data.streakStart) + ' \u2013 ' + fmt(data.streakEnd)
        : data.lastContributionDate ? 'Last: ' + fmt(data.lastContributionDate) : 'No contributions';
      var longestSub = data.longestStreak > 0
        ? fmt(data.longestStreakStart) + ' \u2013 ' + fmt(data.longestStreakEnd)
        : '';
      var totalSub = 'Last 365 days';

      var stats = [
        { icon: icons.barChart, color: C.accentGreen, label: 'TOTAL CONTRIBUTIONS',
          value: Number(data.totalContributions).toLocaleString(), sub: totalSub },
        { icon: icons.flame,    color: C.accent,      label: 'CURRENT STREAK',
          value: data.currentStreak + ' day' + (data.currentStreak !== 1 ? 's' : ''), sub: currentSub },
        { icon: icons.bolt,     color: C.accentAlt,   label: 'LONGEST STREAK',
          value: data.longestStreak + ' day' + (data.longestStreak !== 1 ? 's' : ''), sub: longestSub },
      ];

      var parts = [];
      parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"'
        + ' viewBox="0 0 ' + W + ' ' + H + '" role="img"'
        + ' aria-label="GitHub Streak Stats for ' + esc(data.username) + '">');
      parts.push('<title>GitHub Streak Stats \u2014 ' + esc(data.username) + '</title>');

      // background rect
      parts.push('<rect width="' + W + '" height="' + H + '"'
        + ' rx="' + radius + '" ry="' + radius + '"'
        + ' fill="' + C.bg + '" stroke="' + (strokeWidth ? C.border : 'none') + '"'
        + ' stroke-width="' + strokeWidth + '"' + strokeDasharray + '/>');

      // title bar (row + hero only)
      if (!isStacked && layout.titleY) {
        parts.push('<text x="' + (W / 2) + '" y="' + layout.titleY + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="12.5" font-weight="600"'
          + ' fill="' + C.title + '" letter-spacing="0.6">'
          + 'GitHub Streak Stats \u2014 ' + esc(data.username)
          + '</text>');
        parts.push('<line x1="20" y1="' + layout.dividerY + '" x2="' + (W - 20) + '" y2="' + layout.dividerY + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      }

      // vertical dividers
      layout.vDividers.forEach(function (d) {
        parts.push('<line x1="' + d.x + '" y1="' + d.y1 + '" x2="' + d.x + '" y2="' + d.y2 + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      });

      // horizontal dividers (stacked)
      layout.hDividers.forEach(function (d) {
        parts.push('<line x1="' + d.x1 + '" y1="' + d.y + '" x2="' + d.x2 + '" y2="' + d.y + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      });

      // stat columns
      layout.cols.forEach(function (col, i) {
        var stat = stats[i];
        parts.push(renderStat(col, {
          icon:         stat.icon,
          color:        stat.color,
          label:        stat.label,
          value:        stat.value,
          sub:          stat.sub,
          font:         font,
          labelColor:   C.title,
          subtextColor: C.subtext,
        }));
      });

      // footer (row + hero)
      if (!isStacked && layout.footerY) {
        var now = new Date().toUTCString().replace(' GMT', ' UTC');
        parts.push('<text x="' + (W / 2) + '" y="' + layout.footerY + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="9" fill="' + C.subtext + '">'
          + 'Updated ' + now
          + '</text>');
      }

      // stacked username footer
      if (isStacked) {
        parts.push('<text x="' + (W / 2) + '" y="' + (H - 5) + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="9" fill="' + C.subtext + '">'
          + esc(data.username) + ' \u2022 GitHub Streak'
          + '</text>');
      }

      parts.push('</svg>');
      return parts.join('\n');
    }

    return ember;
  }
);
