import Favorite from "../models/Favorite.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
class UserController{

    async addToFavorite(req, res, next){
        try{

            const property = await Property.findById(req.params.id)

            if (!property){
                return res.status(404).json({"error": "Property not found!"})
            }


            const favouriteDuplicate = await Favorite.find({userId: req.userId, propertyId: req.params.id});

            if (favouriteDuplicate.length){
                return res.status(400).json({"message": "This property already in your favourite list."})
            }

            const favourite = new Favorite({
                userId: req.userId,
                propertyId: req.params.id

            })

            await favourite.save();

            const favouriteList = await Favorite.find({userId: req.userId}).populate("propertyId").select("propertyId")

            res.status(200).json(favouriteList)

        }catch (error){
            next(error)
        }
    }

    async getFavourites(req, res, next){
        try{
            const favourite = await Favorite.find({userId: req.userId}).populate("propertyId").select("propertyId")
            res.status(200).json(favourite)

        }catch (error){
            next(error)
        }
    }

    async deleteFavourite(req, res, next){
        try{

            const favourite = await Favorite.findOne({userId: req.userId, propertyId: req.params.id})

            if (!favourite){
                return res.status(403).json({"message": "Property not found in your favourite list!"})
            }

            await Favorite.findOneAndDelete({propertyId: req.params.id})

            const favouriteList = await Favorite.find({userId: req.userId}).populate("propertyId").select("propertyId")

            res.status(200).json(favouriteList)

            // res.status(200).json({"message": "Property has been deleted from your favourite list!"})

        }catch (error){
            next(error)
        }
    }


    async getUser(req, res, next){
        try{
            const user_id = req.userId

            const user = await User.findById(user_id)

            const {password, ...info} = user._doc;

            res.status(200).json(info)

        }catch (error){
            res.status(200).json(null)
            next()
        }
    }
}

export default UserController;