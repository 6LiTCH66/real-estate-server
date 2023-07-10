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
                agentId: req.userId,
                images: req.files.map((image, index) => {return "https://real-estate-server-production.up.railway.app/" + image.path})
            });



            const savedProperty = await property.save();
            return res.status(201).json(savedProperty)

        }catch (error){

            next(error)
        }


    }

    async getSingleProperty(req, res){
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

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await Property.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        const filter = {
            ...(q.state_province && {state_province: {$regex: q.state_province, $options: "i"}}),
            ...(q.city && {city: {$regex: q.city, $options: "i"}}),
            ...(q.country && {country: {$regex: q.country, $options: "i"}}),
            ...(q.zipcode && {zipcode: q.zipcode}),

            ...(q.property_type && {property_type:
                    { $regex: new RegExp(typeof q.property_type === "object" ? q.property_type.join("|") : q.property_type, "i") }
            }),
            ...(q.property_status && {property_status: {$regex: q.property_status, $options: "i"}}),
            ...(q.beds && {bedrooms: {$gte: q.beds}}),
            ...(q.baths && {bathrooms: {$gte: q.baths}}),
            ...((q.min || q.max) && {
                price: {
                    ...(q.min && { $gte: q.min }),
                    ...(q.max && { $lte: q.max }),
                },
            }),
        }

        const price_sort = (q.sort && {price: q.sort === "desc" ? -1 : q.sort === "asc" ? 1 : ""})

        try{
            // const properties = await Property.find(filter);
            results.properties = await Property.find(filter).sort(price_sort).limit(limit).skip(startIndex).exec()

            res.status(200).json(results)

        }catch (error){
            next(error)
        }
    }

    async deleteProperty(req, res, next){

        try{

            const findProperty = await Property.findById(req.params.id)

            if(req.userId !== findProperty.agentId){
                return res.status(403).json({"error": "You can delete only your property"})
            }

            await Property.findByIdAndDelete(req.params.id)
            res.status(200).send("Property has been deleted successfully!")

        }catch (error){
            next(error)
        }
    }


}

export default PropertyController;