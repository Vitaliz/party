module.exports = {
  syntax: 'css-in-js',
  plugins: [
    'stylelint-scss'
  ],
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-styled-components'
  ],
  rules: {
    'indentation': 2,

    'no-empty-source': null,
    'no-duplicate-selectors': null,
    'no-descending-specificity': null,
    'property-no-unknown': null,
    'property-no-vendor-prefix': null,
    'selector-type-no-unknown': null,
    'selector-pseudo-class-no-unknown': null,
    'font-family-no-duplicate-names': null,
    'font-family-no-missing-generic-family-keyword': null
  }
};
