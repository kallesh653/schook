require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const School = require("../model/school.model");

const seedSchool = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");

        const existingSchool = await School.findOne({ email: "admin@gentime.in" });
        if (existingSchool) {
            console.log("⚠️ School already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("123456", 10);

        const newSchool = new School({
            school_name: "GenTime International School",
            email: "admin@gentime.in",
            owner_name: "Super Admin",
            school_image: "https://via.placeholder.com/150",
            password: hashedPassword
        });

        await newSchool.save();
        console.log("✅ School created successfully");

    } catch (error) {
        console.error("❌ Error creating school:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedSchool();
