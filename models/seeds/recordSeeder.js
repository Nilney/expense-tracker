const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const User = require('../user')
const Record = require('../record')
const Category = require('../category')

const SEED_USERS = require('../data/seedUser.json')
const SEED_RECORDS = require('../data/seedRecord.json')

db.on('open', async () => {
  try {
    console.log('start creating user & record data...')
    // 建立種子Users
    for (const seedUser of SEED_USERS) {
      const { name, email, password, recordIndex } = seedUser
      const user = await User.findOne({ email })
      // 若資料庫沒有該種子User 建立至資料庫
      if (!user) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const createdUser = await User.create({
          name,
          email,
          password: hash
        })
        const userId = createdUser._id
        // 建立種子records
        for ( const index of recordIndex) {
          const category = await Category.findOne({ name: SEED_RECORDS[index].category })
          const record = await Record.findOne({ id: index + 1 })
          //  若資料庫沒有該User的種子record 建立至資料庫
          if (!record) {
            await Record.create({
              ...SEED_RECORDS[index],
              userId,
              categoryId: category._id
            })
          } else {
            // 若record已存在 更新其userId
            record.userId = userId
            record.categoryId = category._id
            await record.save()
          }
        }
      } else {
        // 若資料庫已存在種子User
        const userId = user._id
        for (const index of recordIndex) {
          const category = await Category.findOne({ name: SEED_RECORDS[index].category })
          const record = await Record.findOne({ id: index + 1 })
          //  若資料庫沒有該User的種子record 應建立至資料庫
          if (!record) {
            await Record.create({
              ...SEED_RECORDS[index],
              userId,
              categoryId: category._id
            })
          } else { 
            // 若record已存在 更新其userId
            record.userId = userId
            record.categoryId = category._id
            await record.save()
          }
        }
      }
    }
    console.log('done.')
    process.exit()
  }
  catch (error) {
    console.log(error)
  }
})