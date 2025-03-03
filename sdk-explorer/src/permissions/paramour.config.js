/**
 * @type {import('./styleguide.types.mjs').ParamourCssConfig}
 */
export default {
  classes: true,
  reset: true,
  borders: {
    radii: [2, 4, 8, 9999],
    widths: [1, 2, 4],
  },
  breakpoints: {},
  color: {
    scales: {
      gray: '#808080',
    },
    spots: {},
  },
  customProperties: {},
  grid: {
    steps: 6,
  },
  spaceScale: {
    steps: 9,
    viewportMin: 320,
    viewportMax: 1500,
    baseMin: 16,
    baseMax: 18,
    scaleMin: 'minor-third',
    scaleMax: 'perfect-fifth',
  },
  typeScale: {
    steps: 9,
    viewportMin: 320,
    viewportMax: 1500,
    baseMin: 16,
    baseMax: 18,
    scaleMin: 'minor-third',
    scaleMax: 'perfect-fifth',
  },
}
