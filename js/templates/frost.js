'use strict';

/**
 * templates/frost.js — Navy bg, ice-blue accent card (UMD)
 *
 * Template personality:
 *  - Softer, cooler aesthetic — muted navy base
 *  - Dashed top accent line below title
 *  - Slightly smaller value font for an elegant, less bold feel
 *  - Same layout system as ember (row / stacked / hero)
 */

/* global globalThis, window */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory(require('../icons'));
  } else {
    root.FrostTemplate = factory(root.Icons);
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
        titleY: 20, dividerY: 30, accentLineY: 33,
        cols: [
          { x: 82,  yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
          { x: 248, yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
          { x: 413, yIcon: 62, yLabel: 85, yValue: 116, yDate: 134 },
        ],
        vDividers: [
          { x: 165, y1: 33, y2: 178 },
          { x: 330, y1: 33, y2: 178 },
        ],
        hDividers: [],
        footerY: 188,
      },
      stacked: {
        W: 495, H: 235,
        titleY: null, dividerY: null, accentLineY: null,
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
        titleY: 20, dividerY: 30, accentLineY: 33,
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
      var iconSize  = Math.round(20 * scale);
      var valSize   = Math.round(26 * scale); // slightly smaller than ember
      var labelSize = Math.round(10 * scale);
      var dateSize  = Math.round(9 * scale);
      var iconX     = col.x - Math.round(iconSize / 2);
      var iconSvg   = opts.icon.replace(/FILL/g, opts.color);

      return [
        '<svg x="' + iconX + '" y="' + (col.yIcon - iconSize) + '" width="' + iconSize + '" height="' + iconSize + '" viewBox="0 0 24 24">' + iconSvg + '</svg>',
        '<text x="' + col.x + '" y="' + col.yLabel + '" text-anchor="middle"'
          + ' font-family="' + opts.font + '" font-size="' + labelSize + '" fill="' + opts.labelColor + '" letter-spacing="1.2">'
          + esc(opts.label) + '</text>',
        '<text x="' + col.x + '" y="' + col.yValue + '" text-anchor="middle"'
          + ' font-family="' + opts.font + '" font-size="' + valSize + '" font-weight="600" fill="' + opts.color + '">'
          + esc(opts.value) + '</text>',
        col.yDate
          ? '<text x="' + col.x + '" y="' + col.yDate + '" text-anchor="middle"'
            + ' font-family="' + opts.font + '" font-size="' + dateSize + '" fill="' + opts.subtextColor + '">'
            + esc(opts.sub || '') + '</text>'
          : '',
      ].join('\n');
    }

    function frost(data, options) {
      var layout = LAYOUTS[options.layout] || LAYOUTS.row;
      var C      = options.colors;
      var font   = options.font || "'Inter', sans-serif";
      var radius = options.borderRadius != null ? options.borderRadius : 12;
      var bWidth = options.borderWidth  != null ? options.borderWidth  : 1;
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
        { icon: icons.barChart, color: C.accentGreen, label: 'TOTAL CONTRIBUTIONS',
          value: Number(data.totalContributions).toLocaleString(), sub: 'Last 365 days' },
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

      // background
      parts.push('<rect width="' + W + '" height="' + H + '"'
        + ' rx="' + radius + '" ry="' + radius + '"'
        + ' fill="' + C.bg + '" stroke="' + (strokeWidth ? C.border : 'none') + '"'
        + ' stroke-width="' + strokeWidth + '"' + strokeDasharray + '/>');

      // frost: accent top-bar line (distinctive from ember)
      if (!isStacked && layout.accentLineY) {
        parts.push('<line x1="20" y1="' + layout.accentLineY + '" x2="' + (W - 20) + '" y2="' + layout.accentLineY + '"'
          + ' stroke="' + C.accentAlt + '" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.6"/>');
      }

      // title
      if (!isStacked && layout.titleY) {
        parts.push('<text x="' + (W / 2) + '" y="' + layout.titleY + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="12" font-weight="500"'
          + ' fill="' + C.title + '" letter-spacing="0.4">'
          + 'GitHub Streak Stats \u2014 ' + esc(data.username)
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
          + ' font-family="' + font + '" font-size="9" fill="' + C.subtext + '">'
          + 'Updated ' + now + '</text>');
      }
      if (isStacked) {
        parts.push('<text x="' + (W / 2) + '" y="' + (H - 5) + '" text-anchor="middle"'
          + ' font-family="' + font + '" font-size="9" fill="' + C.subtext + '">'
          + esc(data.username) + ' \u2022 GitHub Streak</text>');
      }

      parts.push('</svg>');
      return parts.join('\n');
    }

    return frost;
  }
);
