require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const School = require("../model/school.model");
const AdminUser = require("../model/adminUser.model");

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

// Create Super Admin for existing school
const createSuperAdminForExistingSchool = async () => {
    try {
        // Find the first school (you can modify this to find by email or name)
        const school = await School.findOne();

        if (!school) {
            console.log("❌ No school found in database");
            return;
        }

        console.log(`\n📚 Found School: ${school.school_name}`);
        console.log(`📧 Email: ${school.email}`);

        // Check if super admin already exists for this school
        const existingAdmin = await AdminUser.findOne({
            school: school._id,
            role: 'SUPER_ADMIN'
        });

        if (existingAdmin) {
            console.log(`\n⚠️  Super Admin already exists for ${school.school_name}`);
            console.log(`Admin Name: ${existingAdmin.full_name}`);
            console.log(`Admin Email: ${existingAdmin.email}`);

            // Update school's primary_admin if not set
            if (!school.primary_admin) {
                school.primary_admin = existingAdmin._id;
                await school.save();
                console.log("✅ Updated school's primary_admin reference");
            }

            return;
        }

        // Create Super Admin with same credentials as school
        const primaryAdmin = new AdminUser({
            school: school._id,
            full_name: school.owner_name,
            email: school.email,
            password: school.password, // Already hashed
            role: 'SUPER_ADMIN',
            phone: '',
            permissions: {
                can_manage_students: true,
                can_manage_teachers: true,
                can_manage_classes: true,
                can_manage_fees: true,
                can_manage_exams: true,
                can_manage_attendance: true,
                can_view_reports: true,
                can_manage_admins: true,
                can_delete_records: true,
                can_modify_school_settings: true
            },
            profile_image: school.school_image,
            is_active: true
        });

        const savedAdmin = await primaryAdmin.save();

        // Update school with primary_admin reference
        school.primary_admin = savedAdmin._id;
        await school.save();

        console.log("\n✅ Super Admin Created Successfully!");
        console.log("==========================================");
        console.log(`School: ${school.school_name}`);
        console.log(`Admin Name: ${savedAdmin.full_name}`);
        console.log(`Admin Email: ${savedAdmin.email}`);
        console.log(`Admin Role: ${savedAdmin.role}`);
        console.log("==========================================");
        console.log("\n🔐 Login Credentials:");
        console.log(`Email: ${savedAdmin.email}`);
        console.log(`Password: [Same as school password]`);
        console.log("\n📝 Note: Use these credentials to login via Admin Login");

    } catch (error) {
        console.error("❌ Error creating Super Admin:", error);
    }
};

// Main function
const main = async () => {
    console.log("🚀 Starting Super Admin Creation Script...\n");

    await connectDB();
    await createSuperAdminForExistingSchool();

    console.log("\n✅ Script completed!");
    process.exit(0);
};

// Run the script
main();
