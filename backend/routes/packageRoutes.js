import express from 'express';
import { packages } from '../models/packageModel.js'; // Importing the Package model
import multer from 'multer';
import {Agency} from '../models/agencyModel.js'
import { customers } from '../models/customerModel.js';
import path from 'path';
const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('public', 'packageImage'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Save a new package with image upload handling
router.post('/', upload.array('images'), async (req, res, next) => {
    try {
        // Check if all required fields are provided
        const {
            name, description, price, duration, location, itinerary, highlights, availableDates, maxGroupSize, guide, AgentID
        } = req.body;

        if (!name || !description || !price || !duration || !location || !itinerary || !highlights || !availableDates || !maxGroupSize || !AgentID) {
            return res.status(400).send({
                message: "Please provide all required fields"
            });
        }
        const AgentData = await Agency.findById(AgentID)
        if(!AgentData){
            return res.status(404).send({ message: 'Agent not found' });
        }
        const AgentName = AgentData.username;
        // Map over the uploaded files to extract file paths
        const imagePaths = req.files ? req.files.map(file => `/public/packageImage/${file.filename}`) : [];

        // Create a new package object with the data from the request
        const newPackage = {
            name,
            description,
            price,
            duration,
            location,
            itinerary,
            highlights,
            availableDates: availableDates.split(','),  // Assuming dates are passed as a comma-separated string
            maxGroupSize,
            guideID: guide,
            AgentID, 
            AgentName, // Store the agentID in the package
            reviews: req.body.reviews || [],
            image: imagePaths,  // Save the image paths to the database
            totalBookings: req.body.totalBookings || 0,
            isActive: 'pending'
        };

        // Save the new package in the database
        const savedPackage = await packages.create(newPackage);

        // Send the response with the saved package
        return res.status(201).send(savedPackage);
    } catch (error) {
        console.error(error);
        next(error);
        return res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

// view all packages
router.get('/',async (req,res,next) => {
    try {
        const packs = await packages.find({});
        return res.status(200).json({
            count: packs.length,
            data: packs
        })
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
})
// view a single package
router.get('/:id',async (req,res,next) => {
    try {
        let {id} = req.params
        id = id.toString()
        const packs = await packages.findOne({ _id: id });
        return res.status(200).json(packs)
    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
    
})
// update package
router.put('/:id',async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndUpdate(id, req.body);

        if(!result){
            return res.status(404).json({message:" Package not found"})
        }
        return res.status(200).json({message:" package updated"})

    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
    
})
// delete a package
router.delete('/:id', async (req,res,next) => {
    try {
        const {id} = req.params;
        const result = await packages.findByIdAndDelete(id)
        if(!result){
            return res.status(404).json({message:" package not found"})
        }
        return res.status(200).json({message:" package deleted"})


    } catch (error) {
        console.log(error.message);
        next(error);
        res.status(500).send({message: error.message})
    }
    
})
router.get('/agents/:AgentID', async (req, res, next) => {
    const { AgentID } = req.params;
    // This check might not be needed since AgentID is expected in the route
    if (!AgentID) {
        return res.status(400).json({ message: 'Agent ID is required' });
    }

    try {
        // Query the packages for the given AgentID
        const agentPackages = await packages.find({ AgentID });

        // Check if no packages were found for the agent
        if (agentPackages.length === 0) {
            return res.status(404).json({ message: 'No packages found for this agent' });
        }

        // Respond with the packages found
        res.status(200).json(agentPackages);
    } catch (error) {
        console.error(error);
        next(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
