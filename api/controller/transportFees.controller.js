require("dotenv").config();
const TransportFees = require("../model/transportFees.model");

module.exports = {
    // Create a new transport fee location
    createTransportFees: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const { location_name, distance, fee_structure, monthly_fee, annual_fee, description } = req.body;

            // Validation
            if (!location_name) {
                return res.status(400).json({
                    success: false,
                    message: "Location name is required."
                });
            }

            // Validate fee structure
            if (fee_structure && Array.isArray(fee_structure)) {
                if (fee_structure.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: "At least one fee period is required."
                    });
                }
                // Validate each fee entry
                for (const fee of fee_structure) {
                    if (!fee.period_name || fee.amount === undefined || fee.amount === null) {
                        return res.status(400).json({
                            success: false,
                            message: "Each fee entry must have a period name and amount."
                        });
                    }
                }
            } else if (!monthly_fee) {
                // Fallback: If no fee_structure, monthly_fee is required
                return res.status(400).json({
                    success: false,
                    message: "Either fee structure or monthly fee is required."
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
            const transportData = {
                school: schoolId,
                location_name: location_name.trim(),
                distance: distance || '',
                description: description || ''
            };

            // Add fee structure if provided
            if (fee_structure && Array.isArray(fee_structure) && fee_structure.length > 0) {
                transportData.fee_structure = fee_structure.map(f => ({
                    period_name: f.period_name.trim(),
                    amount: Number(f.amount)
                }));
            } else {
                // Backward compatibility
                if (monthly_fee) transportData.monthly_fee = Number(monthly_fee);
                if (annual_fee) transportData.annual_fee = Number(annual_fee);
            }

            const newTransportFees = new TransportFees(transportData);
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
            const { location_name, distance, fee_structure, monthly_fee, annual_fee, description, is_active } = req.body;

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
            if (description !== undefined) transportFees.description = description;
            if (is_active !== undefined) transportFees.is_active = is_active;

            // Update fee structure if provided
            if (fee_structure && Array.isArray(fee_structure) && fee_structure.length > 0) {
                transportFees.fee_structure = fee_structure.map(f => ({
                    period_name: f.period_name.trim(),
                    amount: Number(f.amount)
                }));
            } else {
                // Backward compatibility - update legacy fields
                if (monthly_fee !== undefined) transportFees.monthly_fee = Number(monthly_fee);
                if (annual_fee !== undefined) transportFees.annual_fee = Number(annual_fee);
            }

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
