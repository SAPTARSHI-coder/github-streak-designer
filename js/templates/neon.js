'use strict';

/**
 * templates/neon.js — Black bg, neon glow card (UMD)
 *
 * Template personality:
 *  - Pure black background (#050505)
 *  - SVG feGaussianBlur glow filter on icons and values
 *  - Monospace font default (overrideable)
 *  - Accent border glows outward
 *  - Same layout system (row / stacked / hero)
 */

/* global globalThis, window */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory(require('../icons'));
  } else {
    root.NeonTemplate = factory(root.Icons);
  }
})(
  typeof globalThis !== 'undefined' ? globalThis
    : typeof window !== 'undefined' ? window : this,
  function (icons) {

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

    var LAYOUTS = {
      row: {
        W: 495, H: 195,
        titleY: 20, dividerY: 30,
        cols: [
          { x: 82,  yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
          { x: 248, yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
          { x: 413, yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
        ],
        vDividers: [
          { x: 165, y1: 30, y2: 178 },
          { x: 330, y1: 30, y2: 178 },
        ],
        hDividers: [],
        footerY: 188,
      },
      stacked: {
        W: 495, H: 235,
        titleY: null, dividerY: null,
        cols: [
          { x: 248, yIcon: 32,  yLabel: 54,  yValue: 80,  yDate: 97  },
          { x: 248, yIcon: 102, yLabel: 124, yValue: 150, yDate: 167 },
          { x: 248, yIcon: 172, yLabel: 194, yValue: 220, yDate: null },
        ],
        vDividers: [],
        hDividers: [
          { y: 92,  x1: 30, x2: 465 },
          { y: 162, x1: 30, x2: 465 },
        ],
        footerY: null,
      },
      hero: {
        W: 495, H: 195,
        titleY: 20, dividerY: 30,
        cols: [
          { x: 82,  yIcon: 76,  yLabel: 98,  yValue: 125, yDate: 141, scale: 0.85 },
          { x: 248, yIcon: 50,  yLabel: 72,  yValue: 102, yDate: 120, scale: 1.2  },
          { x: 413, yIcon: 76,  yLabel: 98,  yValue: 125, yDate: 141, scale: 0.85 },
        ],
        vDividers: [
          { x: 165, y1: 22, y2: 178 },
          { x: 330, y1: 22, y2: 178 },
        ],
        hDividers: [],
        footerY: 188,
      },
    };

    function renderStat(col, opts) {
      var scale     = col.scale || 1;
      var iconSize  = Math.round(22 * scale);
      var valSize   = Math.round(27 * scale);
      var labelSize = Math.round(9 * scale);
      var dateSize  = Math.round(8.5 * scale);
      var iconX     = col.x - Math.round(iconSize / 2);
      var iconSvg   = opts.icon.replace(/FILL/g, opts.color);

      return [
        '<svg x="' + iconX + '" y="' + (col.yIcon - iconSize) + '" width="' + iconSize + '" height="' + iconSize + '"'
          + ' viewBox="0 0 24 24" filter="url(#neon-glow)">' + iconSvg + '</svg>',
        '<text x="' + col.x + '" y="' + col.yLabel + '" text-anchor="middle"'
          + ' font-family="' + opts.font + '" font-size="' + labelSize + '"'
          + ' fill="' + opts.labelColor + '" letter-spacing="1.5">'
          + esc(opts.label) + '</text>',
        '<text x="' + col.x + '" y="' + col.yValue + '" text-anchor="middle"'
          + ' font-family="' + opts.font + '" font-size="' + valSize + '" font-weight="700"'
          + ' fill="' + opts.color + '" filter="url(#neon-glow)">'
          + esc(opts.value) + '</text>',
        col.yDate
          ? '<text x="' + col.x + '" y="' + col.yDate + '" text-anchor="middle"'
            + ' font-family="' + opts.font + '" font-size="' + dateSize + '"'
            + ' fill="' + opts.subtextColor + '">'
            + esc(opts.sub || '') + '</text>'
          : '',
      ].join('\n');
    }

    function neon(data, options) {
      var layout = LAYOUTS[options.layout] || LAYOUTS.row;
      var C      = options.colors;
      // neon default: monospace font
      var font   = options.font || "'JetBrains Mono', 'Fira Code', monospace";
      var radius = options.borderRadius != null ? options.borderRadius : 8;
      var bWidth = options.borderWidth  != null ? options.borderWidth  : 1.5;
      var bStyle = options.borderStyle  || 'solid';
      var W = layout.W, H = layout.H;
      var isStacked = options.layout === 'stacked';

      var strokeDasharray = bStyle === 'dashed' ? ' stroke-dasharray="6 3"' : '';
      var strokeWidth     = bStyle === 'none'   ? 0 : bWidth;

      var currentSub = data.currentStreak > 0
        ? fmt(data.streakStart) + ' \u2013 ' + fmt(data.streakEnd)
        : data.lastContributionDate ? 'Last: ' + fmt(data.lastContributionDate) : 'No contributions';
      var longestSub = data.longestStreak > 0
        ? fmt(data.longestStreakStart) + ' \u2013 ' + fmt(data.longestStreakEnd) : '';

      var stats = [
        { icon: icons.barChart, color: C.accentGreen, label: 'TOTAL',
          value: Number(data.totalContributions).toLocaleString(), sub: 'Last 365 days' },
        { icon: icons.flame,    color: C.accent,      label: 'CURRENT STREAK',
          value: data.currentStreak + ' day' + (data.currentStreak !== 1 ? 's' : ''), sub: currentSub },
        { icon: icons.bolt,     color: C.accentAlt,   label: 'LONGEST',
          value: data.longestStreak + ' day' + (data.longestStreak !== 1 ? 's' : ''), sub: longestSub },
      ];

      var parts = [];
      parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"'
        + ' viewBox="0 0 ' + W + ' ' + H + '" role="img"'
        + ' aria-label="GitHub Streak Stats for ' + esc(data.username) + '">');
      parts.push('<title>GitHub Streak Stats \u2014 ' + esc(data.username) + '</title>');

      // ── SVG defs: neon glow filter + border glow rect ─────────────────────
      parts.push('<defs>'
        + '<filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">'
        + '<feGaussianBlur stdDeviation="3.5" result="blur1"/>'
        + '<feGaussianBlur stdDeviation="8" result="blur2"/>'
        + '<feMerge><feMergeNode in="blur2"/><feMergeNode in="blur1"/><feMergeNode in="SourceGraphic"/></feMerge>'
        + '</filter>'
        + '<filter id="border-glow" x="-5%" y="-5%" width="110%" height="110%">'
        + '<feGaussianBlur stdDeviation="4" result="blur"/>'
        + '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>'
        + '</filter>'
        + '</defs>');

      // background
      parts.push('<rect width="' + W + '" height="' + H + '"'
        + ' rx="' + radius + '" ry="' + radius + '" fill="' + C.bg + '"/>');

      // neon border (two rects: glow layer + crisp layer)
      if (strokeWidth > 0) {
        parts.push('<rect width="' + W + '" height="' + H + '"'
          + ' rx="' + radius + '" ry="' + radius + '"'
          + ' fill="none" stroke="' + C.border + '"'
          + ' stroke-width="' + (strokeWidth * 3) + '" opacity="0.3"'
          + ' filter="url(#border-glow)"' + strokeDasharray + '/>');
        parts.push('<rect width="' + W + '" height="' + H + '"'
          + ' rx="' + radius + '" ry="' + radius + '"'
          + ' fill="none" stroke="' + C.border + '"'
          + ' stroke-width="' + strokeWidth + '"' + strokeDasharray + '/>');
      }

      // title
      if (!isStacked && layout.titleY) {
        parts.push('<text x="' + (W / 2) + '" y="' + layout.titleY + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="11" font-weight="700"'
          + ' fill="' + C.title + '" letter-spacing="1.5">'
          + 'STREAK STATS \u2014 ' + esc(data.username.toUpperCase())
          + '</text>');
        parts.push('<line x1="20" y1="' + layout.dividerY + '" x2="' + (W - 20) + '" y2="' + layout.dividerY + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      }

      layout.vDividers.forEach(function (d) {
        parts.push('<line x1="' + d.x + '" y1="' + d.y1 + '" x2="' + d.x + '" y2="' + d.y2 + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      });
      layout.hDividers.forEach(function (d) {
        parts.push('<line x1="' + d.x1 + '" y1="' + d.y + '" x2="' + d.x2 + '" y2="' + d.y + '"'
          + ' stroke="' + C.divider + '" stroke-width="1"/>');
      });

      layout.cols.forEach(function (col, i) {
        var stat = stats[i];
        parts.push(renderStat(col, {
          icon: stat.icon, color: stat.color, label: stat.label,
          value: stat.value, sub: stat.sub, font: font,
          labelColor: C.title, subtextColor: C.subtext,
        }));
      });

      if (!isStacked && layout.footerY) {
        var now = new Date().toUTCString().replace(' GMT', ' UTC');
        parts.push('<text x="' + (W / 2) + '" y="' + layout.footerY + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="8.5" fill="' + C.subtext + '">'
          + 'Updated ' + now + '</text>');
      }
      if (isStacked) {
        parts.push('<text x="' + (W / 2) + '" y="' + (H - 5) + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="8.5" fill="' + C.subtext + '">'
          + esc(data.username.toUpperCase()) + ' \u2022 GITHUB STREAK</text>');
      }

      parts.push('</svg>');
      return parts.join('\n');
    }

    return neon;
  }
);
