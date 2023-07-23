const Handlebars = require('handlebars')

Handlebars.registerHelper('if_eq', (selection, value, options) => {
  const stringValue = String(value)
  if (selection === stringValue) {
    return options.fn(this)
  }
  return options.inverse(this)
})