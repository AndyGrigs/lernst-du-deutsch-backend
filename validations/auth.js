import {body} from 'express-validator'

export const registerValidation = [
    body('email', 'wrong email').isEmail(),
    body('password', 'your password is too short').isLength({min: 5}),
    body('fullName', 'Name fails').isLength({min: 3}),
    body('avatar', 'wrong photo URL ').optional().isURL()
]