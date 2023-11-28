// import jwt from "jsonwebtoken";

// export default (req, res, next)=>{
//     const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
// if(token){
//     try {
//         const decoded = jwt.verify(token, 'secret999')
//         req.userId = decoded._id
//         next()

//     } catch (error) {
//         return res.status(403).json({
//             message: 'No excess!'
//         })
//     }
// } else{
//     return res.status(403).json({
//         message: 'no excess!'
//     })
// }
//     res.send(token)
// }

import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret999')
      req.userId = decoded._id
    } catch (error) {
      return res.status(403).json({
        message: 'No access!'
      })
    }
  } else {
    return res.status(403).json({
      message: 'No access!'
    })
  }
  next()
}



