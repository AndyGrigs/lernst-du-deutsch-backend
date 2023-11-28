import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from "../models/user.js"




export const register = async(req, res)=>{
    try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: hash
    })
    const user = await doc.save()

    const token = jwt.sign({
        _id: user._id
    }, 
    'secret999',
    {
        expiresIn: '30d'
    }
    )

    const {passwordHash, ...userData} = user._doc

    res.json({
        ...userData,
        token
    })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Ragistration failed"
           
        })
    }
}
export const login = async (req, res) => {
    try {
  
      const { email, password } = req.body;
  
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign({ _id: user._id }, 'secret999', { expiresIn: '30d' });
  
      const { passwordHash, ...userData } = user._doc;
  
      res.json({ ...userData, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Login failed' });
    }
  }

export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId)

        if(!user){
            return res.status(404).json({
                message: 'User is not found!'
            })
        }

        const {passwordHash, ...userData} = user._doc
        res.json(userData)

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'some error'
        })
    }
}

