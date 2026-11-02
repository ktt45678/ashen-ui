const plugin = require('tailwindcss/plugin');
const codepoints = require('./material-symbols-outlined.codepoints.json');

module.exports = plugin(function ({ addUtilities }) {
  const utilities = {};

  for (const { name, code } of codepoints) {
    utilities[`.sn-icon-${name}::before`] = { content: `'\\${code}'` };
  }

  addUtilities(utilities);
});
