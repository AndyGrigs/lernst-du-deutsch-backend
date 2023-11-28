import { validationResult } from 'express-validator'

export default (res, req, next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }
    next()
}