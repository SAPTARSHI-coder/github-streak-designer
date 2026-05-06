# Deep Dive: `js/customizer.js`

This file is the brain of the visual designer. It handles state, DOM updates, and builds the final Markdown URL.

---

## 🧠 The State Object

Everything the user selects in the UI is stored in a central `state` object:

```javascript
var state = {
  username:     'SAPTARSHI-coder',
  template:     'ember',
  palette:      'dark',
  font:         'inter',
  layout:       'row',
  borderRadius: 10,
  borderWidth:  1,
  borderStyle:  'solid',
  custom:       null, // Holds custom color overrides if 'palette=custom'
  
  // Fake data for the instant visual preview
  previewTotal:   1247,
  previewCurrent: 42,
  previewLongest: 87,
};
```

---

## 🔄 The Render Loop

Every single time an input changes (a button is clicked, a slider is moved, text is typed), the `bindControls()` functions fire and call `render()`.

**The `render()` function:**
1. Looks at `state.template` and grabs the correct rendering function (e.g., `Templates.registry['neon']`).
2. Builds the "Options" object containing the resolved colors, font stack, and layout.
3. Injects the returned SVG string into the DOM (`$('preview-wrap').innerHTML = svg;`).
4. Calls `updateURL()` to reflect the new parameters in the textbox at the bottom of the screen.

---

## 🔗 The URL Builder

The `buildURL()` function is crucial. It translates the internal `state` object into URL Query Parameters. 

```javascript
var API_BASE = 'https://github-streak-tracker-for-all.vercel.app';
```

If the user selects the `custom` palette, the URL builder iterates through the `state.custom` object and appends every HEX code to the URL, making sure to URL-Encode the `#` symbol into `%23`.

```
// Standard Palette
?username=SAPTARSHI-coder&template=neon&palette=dracula

// Custom Palette
?username=SAPTARSHI-coder&palette=custom&bg=%231e1e2e&accent=%23ff79c6
```
