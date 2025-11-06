import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { pool } from './db.js'

const __dirname = import.meta.dirname
const { hash } = bcrypt

const initializeTestDb = () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '../database.sql'), 'utf8')

  pool.query(sql, (err) => {
    if (err) {
      console.error('Error initializing test database:', err)
    } else {
      console.log('Test database initialized successfully')
    }
  })
}

const insertTestUser = (user) => {
  hash(user.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password', err)
      return
    }
    pool.query('INSERT INTO account (email, password) VALUES ($1, $2)',
      [user.email, hashedPassword],
      (err) => {
        if (err) {
          console.error('Error inserting test user:', err)
        } else {
          console.log('Test user inserted succesfully')
        }
      })
  })
}

const getToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET)
}

export { initializeTestDb, insertTestUser, getToken }