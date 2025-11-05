require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const AdminUser = require("../model/adminUser.model");
const School = require("../model/school.model");

const jwtSecret = process.env.JWT_SECRET;

module.exports = {
    /**
     * Login for Admin Users (both SUPER_ADMIN and ADMIN)
     */
    loginAdminUser: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email and password are required"
                });
            }

            // Find admin user by email only (email is unique per school)
            const adminUser = await AdminUser.findOne({
                email: email.toLowerCase(),
                is_active: true
            }).populate('school', 'school_name school_image');

            if (!adminUser) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials or account not found"
                });
            }

            // Check password
            const isPasswordValid = bcrypt.compareSync(password, adminUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            // Update last login
            adminUser.last_login = new Date();
            await adminUser.save();

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: adminUser._id,
                    schoolId: adminUser.school._id,
                    school_name: adminUser.school.school_name,
                    full_name: adminUser.full_name,
                    email: adminUser.email,
                    role: adminUser.role,
                    image_url: adminUser.profile_image,
                    permissions: adminUser.permissions
                },
                jwtSecret,
                { expiresIn: '24h' }
            );

            res.header("Authorization", token);
            res.status(200).json({
                success: true,
                message: "Login successful",
                token: token,
                user: {
                    id: adminUser._id,
                    full_name: adminUser.full_name,
                    email: adminUser.email,
                    role: adminUser.role,
                    school_name: adminUser.school.school_name,
                    schoolId: adminUser.school._id,
                    image_url: adminUser.profile_image,
                    permissions: adminUser.permissions
                }
            });

        } catch (error) {
            console.log("Error in loginAdminUser:", error);
            res.status(500).json({
                success: false,
                message: "Server error during login"
            });
        }
    },

    /**
     * Create new admin user (Only SUPER_ADMIN can do this)
     */
    createAdminUser: async (req, res) => {
        try {
            const { full_name, email, password, role, phone, permissions } = req.body;
            const schoolId = req.user.schoolId;
            const creatorId = req.user.id;
            const creatorRole = req.user.role;

            // Only SUPER_ADMIN can create new admins
            if (creatorRole !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: "Only Super Admin can create new admin users"
                });
            }

            // Validate required fields
            if (!full_name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Full name, email, and password are required"
                });
            }

            // Check if email already exists for this school
            const existingAdmin = await AdminUser.findOne({
                email: email.toLowerCase(),
                school: schoolId
            });

            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: "An admin with this email already exists for this school"
                });
            }

            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Set default permissions based on role
            let defaultPermissions = {
                can_manage_students: true,
                can_manage_teachers: true,
                can_manage_classes: true,
                can_manage_fees: true,
                can_manage_exams: true,
                can_manage_attendance: true,
                can_view_reports: true,
                can_manage_admins: role === 'SUPER_ADMIN',
                can_delete_records: role === 'SUPER_ADMIN',
                can_modify_school_settings: role === 'SUPER_ADMIN'
            };

            // Override with custom permissions if provided
            if (permissions) {
                defaultPermissions = { ...defaultPermissions, ...permissions };
            }

            // Create new admin user
            const newAdminUser = new AdminUser({
                school: schoolId,
                full_name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'ADMIN',
                phone,
                permissions: defaultPermissions,
                created_by: creatorId,
                is_active: true
            });

            const savedAdmin = await newAdminUser.save();

            res.status(201).json({
                success: true,
                message: "Admin user created successfully",
                data: {
                    id: savedAdmin._id,
                    full_name: savedAdmin.full_name,
                    email: savedAdmin.email,
                    role: savedAdmin.role,
                    phone: savedAdmin.phone,
                    is_active: savedAdmin.is_active,
                    permissions: savedAdmin.permissions
                }
            });

        } catch (error) {
            console.log("Error in createAdminUser:", error);
            res.status(500).json({
                success: false,
                message: "Server error creating admin user"
            });
        }
    },

    /**
     * Get all admin users for the school
     */
    getAllAdminUsers: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const userRole = req.user.role;

            // Only SUPER_ADMIN can view all admins
            if (userRole !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: "Only Super Admin can view all admin users"
                });
            }

            const admins = await AdminUser.find({ school: schoolId })
                .select('-password')
                .populate('created_by', 'full_name email')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                message: "Admin users fetched successfully",
                data: admins,
                count: admins.length
            });

        } catch (error) {
            console.log("Error in getAllAdminUsers:", error);
            res.status(500).json({
                success: false,
                message: "Server error fetching admin users"
            });
        }
    },

    /**
     * Get single admin user by ID
     */
    getAdminUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            const userRole = req.user.role;

            // Only SUPER_ADMIN can view other admin details
            if (userRole !== 'SUPER_ADMIN' && req.user.id !== id) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied"
                });
            }

            const admin = await AdminUser.findOne({ _id: id, school: schoolId })
                .select('-password')
                .populate('created_by', 'full_name email')
                .populate('school', 'school_name');

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Admin user fetched successfully",
                data: admin
            });

        } catch (error) {
            console.log("Error in getAdminUserById:", error);
            res.status(500).json({
                success: false,
                message: "Server error fetching admin user"
            });
        }
    },

    /**
     * Update admin user
     */
    updateAdminUser: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            const userRole = req.user.role;
            const { full_name, email, phone, role, permissions, is_active } = req.body;

            // Only SUPER_ADMIN can update other admins
            if (userRole !== 'SUPER_ADMIN' && req.user.id !== id) {
                return res.status(403).json({
                    success: false,
                    message: "Only Super Admin can update other admin users"
                });
            }

            const admin = await AdminUser.findOne({ _id: id, school: schoolId });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Update fields
            if (full_name) admin.full_name = full_name;
            if (email) admin.email = email.toLowerCase();
            if (phone) admin.phone = phone;

            // Only SUPER_ADMIN can change role and permissions
            if (userRole === 'SUPER_ADMIN') {
                if (role) admin.role = role;
                if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
                if (typeof is_active !== 'undefined') admin.is_active = is_active;
            }

            const updatedAdmin = await admin.save();

            res.status(200).json({
                success: true,
                message: "Admin user updated successfully",
                data: {
                    id: updatedAdmin._id,
                    full_name: updatedAdmin.full_name,
                    email: updatedAdmin.email,
                    role: updatedAdmin.role,
                    phone: updatedAdmin.phone,
                    is_active: updatedAdmin.is_active,
                    permissions: updatedAdmin.permissions
                }
            });

        } catch (error) {
            console.log("Error in updateAdminUser:", error);
            res.status(500).json({
                success: false,
                message: "Server error updating admin user"
            });
        }
    },

    /**
     * Delete admin user (Only SUPER_ADMIN)
     */
    deleteAdminUser: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            const userRole = req.user.role;
            const userId = req.user.id;

            // Only SUPER_ADMIN can delete admins
            if (userRole !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: "Only Super Admin can delete admin users"
                });
            }

            // Prevent self-deletion
            if (userId === id) {
                return res.status(400).json({
                    success: false,
                    message: "You cannot delete your own account"
                });
            }

            const admin = await AdminUser.findOne({ _id: id, school: schoolId });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Check if this is the primary admin of the school
            const school = await School.findById(schoolId);
            if (school.primary_admin && school.primary_admin.toString() === id) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete the primary Super Admin of the school"
                });
            }

            await AdminUser.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                message: "Admin user deleted successfully"
            });

        } catch (error) {
            console.log("Error in deleteAdminUser:", error);
            res.status(500).json({
                success: false,
                message: "Server error deleting admin user"
            });
        }
    },

    /**
     * Change password
     */
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Current password and new password are required"
                });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be at least 6 characters long"
                });
            }

            const admin = await AdminUser.findById(userId);

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            // Verify current password
            const isPasswordValid = bcrypt.compareSync(currentPassword, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Current password is incorrect"
                });
            }

            // Hash new password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(newPassword, salt);

            admin.password = hashedPassword;
            await admin.save();

            res.status(200).json({
                success: true,
                message: "Password changed successfully"
            });

        } catch (error) {
            console.log("Error in changePassword:", error);
            res.status(500).json({
                success: false,
                message: "Server error changing password"
            });
        }
    },

    /**
     * Toggle admin active status (Only SUPER_ADMIN)
     */
    toggleAdminStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const schoolId = req.user.schoolId;
            const userRole = req.user.role;

            if (userRole !== 'SUPER_ADMIN') {
                return res.status(403).json({
                    success: false,
                    message: "Only Super Admin can toggle admin status"
                });
            }

            const admin = await AdminUser.findOne({ _id: id, school: schoolId });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            admin.is_active = !admin.is_active;
            await admin.save();

            res.status(200).json({
                success: true,
                message: `Admin ${admin.is_active ? 'activated' : 'deactivated'} successfully`,
                data: {
                    id: admin._id,
                    is_active: admin.is_active
                }
            });

        } catch (error) {
            console.log("Error in toggleAdminStatus:", error);
            res.status(500).json({
                success: false,
                message: "Server error toggling admin status"
            });
        }
    },

    /**
     * Get current admin's profile
     */
    getMyProfile: async (req, res) => {
        try {
            const userId = req.user.id;

            const admin = await AdminUser.findById(userId)
                .select('-password')
                .populate('school', 'school_name school_image')
                .populate('created_by', 'full_name email');

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin user not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Profile fetched successfully",
                data: admin
            });

        } catch (error) {
            console.log("Error in getMyProfile:", error);
            res.status(500).json({
                success: false,
                message: "Server error fetching profile"
            });
        }
    }
};
