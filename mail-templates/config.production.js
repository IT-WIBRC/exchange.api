/** @type {import('@maizzle/framework').Config} */
module.exports = {
  build: {
    templates: {
      destination: {
        path: "../src/mail/templates",
        extension: "hbs",
      },
    },
  },
  inlineCSS: true,
  removeUnusedCSS: true,
  shorthandCSS: true,
  prettify: true,
};
