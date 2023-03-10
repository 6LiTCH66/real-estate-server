import User from "../models/User.js"
import createError from "../utils/createError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class AuthController{
    async sign_up(req, res, next) {
        try{
            const {name, email, phone, password} = req.body;

            const candidate = await User.findOne({email})

            if (candidate){
                return res.status(400).json({message: "User with this email is already exists."})
            }

            const hashedPassword = bcrypt.hashSync(password, 5);

            const user = new User({
                name: name,
                email: email,
                phone: phone,
                password: hashedPassword,
                ...req.body

            })

            await user.save()
            res.status(201).send("User has been created.")


        }catch (error){
            next(error)
        }
    }
    async sign_in(req, res) {
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email})

            if(!user){
                return res.status(400).json({message: `User with email ${email} is not found!`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)

            if(!validPassword){
                return res.status(400).json({message: "Password is invalid!"})
            }

            const token = jwt.sign(
                {
                    id: user._id,
                    isAgent: user.isAgent
                },
                process.env.JWT_TOKEN
            )

            const {...info} = user._doc;

            res.cookie("accessToken", token, {
                httpOnly: true,
            }).status(200).send(info)

        }catch (error){

        }
    }
    async logout(req, res) {
        try{

        }catch (error){

        }
    }
}
export default AuthController;