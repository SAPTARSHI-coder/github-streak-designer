'use strict';

/**
 * js/templates/index.js — Template registry (UMD)
 * Exports: { registry, getTemplate }
 */

/* global globalThis, window */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory(
      require('./ember'),
      require('./frost'),
      require('./neon')
    );
  } else {
    root.Templates = factory(
      root.EmberTemplate,
      root.FrostTemplate,
      root.NeonTemplate
    );
  }
})(
  typeof globalThis !== 'undefined' ? globalThis
    : typeof window !== 'undefined' ? window : this,
  function (ember, frost, neon) {
    'use strict';

    var registry = { ember: ember, frost: frost, neon: neon };

    function getTemplate(name) {
      return registry[name] || registry.ember;
    }

    return { registry: registry, getTemplate: getTemplate };
  }
);
