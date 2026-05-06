'use strict';

/**
 * js/palettes.js — Predefined color palettes for the designer
 *
 * Each palette defines all 9 color tokens:
 * bg, border, title, value, accent, accentAlt, accentGreen, subtext, divider
 */

/* global globalThis, window */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else {
    root.Palettes = factory();
  }
})(
  typeof globalThis !== 'undefined' ? globalThis
    : typeof window !== 'undefined' ? window : this,
  function () {

    var palettes = {
      dark: {
        label: 'Dark',
        bg: '#0d1117', border: '#30363d', title: '#8b949e', value: '#e6edf3',
        accent: '#f78166', accentAlt: '#58a6ff', accentGreen: '#3fb950',
        subtext: '#6e7681', divider: '#21262d',
      },
      dracula: {
        label: 'Dracula',
        bg: '#282a36', border: '#6272a4', title: '#8be9fd', value: '#f8f8f2',
        accent: '#ff79c6', accentAlt: '#bd93f9', accentGreen: '#50fa7b',
        subtext: '#6272a4', divider: '#44475a',
      },
      catppuccin: {
        label: 'Catppuccin',
        bg: '#1e1e2e', border: '#313244', title: '#cdd6f4', value: '#cdd6f4',
        accent: '#cba6f7', accentAlt: '#89dceb', accentGreen: '#a6e3a1',
        subtext: '#7f849c', divider: '#313244',
      },
      nord: {
        label: 'Nord',
        bg: '#2e3440', border: '#3b4252', title: '#d8dee9', value: '#eceff4',
        accent: '#88c0d0', accentAlt: '#81a1c1', accentGreen: '#a3be8c',
        subtext: '#4c566a', divider: '#3b4252',
      },
      light: {
        label: 'Light',
        bg: '#ffffff', border: '#d0d7de', title: '#57606a', value: '#1f2328',
        accent: '#cf222e', accentAlt: '#0969da', accentGreen: '#1a7f37',
        subtext: '#8c959f', divider: '#eaeef2',
      },
    };

    // custom palette starts as a copy of dark
    var custom = Object.assign({}, palettes.dark, { label: 'Custom' });

    return { palettes: palettes, custom: custom };
  }
);
