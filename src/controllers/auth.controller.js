import User from "../models/User.js"
import createError from "../utils/createError.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

class AuthController{
    async sign_up(req, res, next) {
        try{
            const {name, email, phone, password, isAgent} = req.body;

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
                isAgent: isAgent

            })

            await user.save()
            res.status(201).send("User has been created.")


        }catch (error){
            next(error)
        }
    }
    async sign_in(req, res, next) {
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

            console.log(req)

        }catch (error){
            next(error)
        }
    }
    async logout(req, res) {
        res.clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        }).status(200).send("User has been logged out.")
    }
}
export default AuthController;