import createError from "../utils/createError.js";
import Property from "../models/Property.js";

class PropertyController{
    async createProperty(req, res, next){

        if(!req.isAgent){
            return res.status(403).json({"error": "Only agent can create a property!"})
        }

        try{

            const property = new Property({
                ...req.body,
                agentId: req.userId
            });


            const savedProperty = await property.save();
            return res.status(201).json(savedProperty)

        }catch (error){

            next(error)
        }


    }

    async getSingleProperty(req, res, next){
        try{
            const property = await Property.findById(req.params.id)

            if(!property){
                return res.status(404).json({"error": "Property not found!"})
            }
            res.status(200).send(property)

        }catch (error){
            return res.status(404).json({"error": "Property not found!"})
        }



    }

    async getAllProperties(req, res, next){

        const q = req.query;

        const filter = {
            ...(q.state_province && {state_province: {$regex: q.state_province, $options: "i"}}),
            ...(q.city && {city: {$regex: q.city, $options: "i"}}),
            ...(q.country && {country: {$regex :q.country, $options: "i"}}),
            ...(q.zipcode && {zipcode: q.zipcode}),
            ...(q.property_type && {property_type: {$regex: q.property_type, $options: "i"}}),
            ...(q.property_status && {property_status: {$regex: q.property_status, $options: "i"}}),
            ...((q.min || q.max) && {
                price: {
                    ...(q.min && { $gt: q.min }),
                    ...(q.max && { $lt: q.max }),
                },
            }),
        }

        try{
            const properties = await Property.find(filter);
            res.status(200).json(properties)

        }catch (error){
            next(error)
        }
    }
}

export default PropertyController;