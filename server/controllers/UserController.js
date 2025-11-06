import { ApiError } from "../helper/ApiError.js";
import { createUser, getUser} from "../models/User.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUser = async (req, res, next) => {
  const { user } = req.body

  try {
    if (!user || !user.email || !user.password) {
      return next(new ApiError('Email and password are required'))
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const result = await createUser(user.email, hashedPassword)

    return res.status(201).json({ id: result.rows[0].id, email: user.email })
  } catch (error) {
    return next(error)
  }
}

const loginUser = async (req, res, next) => {
  const { user } = req.body

  try {
    if (!user || !user.email || !user.password) {
      return next(new ApiError('Email and password are required', 400))
    }

    const result = await getUser(user.email)
    if (result.rows.length === 0) {
      return next(new ApiError('User not found', 404))
    }

    const dbUser = result.rows[0]
    bcrypt.compare(user.password, dbUser.password, (err, isMatch) => {
      if (err) return next(err)
    
      if (!isMatch) {
        return next(new ApiError('Invalid password', 401))
      }
    })

    const token = jwt.sign({ user: dbUser.email }, process.env.JWT_SECRET)
    res.status(200).json({
      id: dbUser.id,
      email: dbUser.email,
      token
    })
  } catch (error) {
    return next(error)
  }
}

export { registerUser, loginUser }