if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')

const SEED_CATEGORIES = require('../data/seedCategory.json')

db.on('open', async () => {
  try {
    console.log('start creating category data... ')
    await Category.create(SEED_CATEGORIES)
    console.log('done.')
    process.exit()
  } 
  catch (error) {
    console.log(error)
  }
})