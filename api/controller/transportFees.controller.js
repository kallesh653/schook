require("dotenv").config();
const TransportFees = require("../model/transportFees.model");

module.exports = {
    // Create a new transport fee location
    createTransportFees: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const { location_name, distance, monthly_fee, annual_fee, description } = req.body;

            // Validation
            if (!location_name || !monthly_fee) {
                return res.status(400).json({
                    success: false,
                    message: "Location name and monthly fee are required."
                });
            }

            // Check if location already exists for this school
            const existingLocation = await TransportFees.findOne({
                school: schoolId,
                location_name: location_name.trim()
            });

            if (existingLocation) {
                return res.status(400).json({
                    success: false,
                    message: "Transport location with this name already exists."
                });
            }

            // Create new transport fees entry
            const newTransportFees = new TransportFees({
                school: schoolId,
                location_name: location_name.trim(),
                distance: distance || '',
                monthly_fee: Number(monthly_fee),
                annual_fee: annual_fee ? Number(annual_fee) : null,
                description: description || ''
            });

            const savedData = await newTransportFees.save();

            res.status(201).json({
                success: true,
                data: savedData,
                message: "Transport fees location created successfully."
            });

        } catch (error) {
            console.log("Error in createTransportFees:", error);
            res.status(500).json({
                success: false,
                message: `Failed to create transport fees: ${error.message}`
            });
        }
    },

    // Get all transport fee locations for a school
    getAllTransportFees: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;

            const transportFees = await TransportFees.find({ school: schoolId })
                .sort({ location_name: 1 });

            res.status(200).json({
                success: true,
                data: transportFees,
                count: transportFees.length
            });

        } catch (error) {
            console.log("Error in getAllTransportFees:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching transport fees."
            });
        }
    },

    // Get active transport fee locations only
    getActiveTransportFees: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;

            const transportFees = await TransportFees.find({
                school: schoolId,
                is_active: true
            }).sort({ location_name: 1 });

            res.status(200).json({
                success: true,
                data: transportFees,
                count: transportFees.length
            });

        } catch (error) {
            console.log("Error in getActiveTransportFees:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching active transport fees."
            });
        }
    },

    // Get single transport fee by ID
    getTransportFeesById: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;

            const transportFees = await TransportFees.findOne({
                _id: id,
                school: schoolId
            });

            if (!transportFees) {
                return res.status(404).json({
                    success: false,
                    message: "Transport fees location not found."
                });
            }

            res.status(200).json({
                success: true,
                data: transportFees
            });

        } catch (error) {
            console.log("Error in getTransportFeesById:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching transport fees details."
            });
        }
    },

    // Update transport fees
    updateTransportFees: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            const { location_name, distance, monthly_fee, annual_fee, description, is_active } = req.body;

            const transportFees = await TransportFees.findOne({
                _id: id,
                school: schoolId
            });

            if (!transportFees) {
                return res.status(404).json({
                    success: false,
                    message: "Transport fees location not found."
                });
            }

            // Update fields
            if (location_name) transportFees.location_name = location_name.trim();
            if (distance !== undefined) transportFees.distance = distance;
            if (monthly_fee !== undefined) transportFees.monthly_fee = Number(monthly_fee);
            if (annual_fee !== undefined) transportFees.annual_fee = Number(annual_fee);
            if (description !== undefined) transportFees.description = description;
            if (is_active !== undefined) transportFees.is_active = is_active;

            const updatedData = await transportFees.save();

            res.status(200).json({
                success: true,
                data: updatedData,
                message: "Transport fees updated successfully."
            });

        } catch (error) {
            console.log("Error in updateTransportFees:", error);
            res.status(500).json({
                success: false,
                message: `Failed to update transport fees: ${error.message}`
            });
        }
    },

    // Delete transport fees
    deleteTransportFees: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;

            const deletedData = await TransportFees.findOneAndDelete({
                _id: id,
                school: schoolId
            });

            if (!deletedData) {
                return res.status(404).json({
                    success: false,
                    message: "Transport fees location not found."
                });
            }

            res.status(200).json({
                success: true,
                message: "Transport fees location deleted successfully.",
                data: deletedData
            });

        } catch (error) {
            console.log("Error in deleteTransportFees:", error);
            res.status(500).json({
                success: false,
                message: "Failed to delete transport fees location."
            });
        }
    },

    // Toggle active status
    toggleActiveStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;

            const transportFees = await TransportFees.findOne({
                _id: id,
                school: schoolId
            });

            if (!transportFees) {
                return res.status(404).json({
                    success: false,
                    message: "Transport fees location not found."
                });
            }

            transportFees.is_active = !transportFees.is_active;
            const updatedData = await transportFees.save();

            res.status(200).json({
                success: true,
                data: updatedData,
                message: `Transport fees location ${updatedData.is_active ? 'activated' : 'deactivated'} successfully.`
            });

        } catch (error) {
            console.log("Error in toggleActiveStatus:", error);
            res.status(500).json({
                success: false,
                message: "Failed to toggle active status."
            });
        }
    }
};
