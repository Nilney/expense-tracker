if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')

const SEED_CATEGORIES = require('../data/seedCategory.json')

db.on('open', async () => {
  try {
    console.log('start creating category data... ')
    const createdCategory = []
    for (const seedCategory of SEED_CATEGORIES) {
      const { name } = seedCategory
      const category = await Category.findOne({ name })
      if (!category) {
        createdCategory.push(seedCategory)
      }
    }
    await Category.create(createdCategory)
    console.log('done.')
    process.exit()
  } 
  catch (error) {
    console.log(error)
  }
})