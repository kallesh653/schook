const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
    // Reference to the school this admin belongs to
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },

    // Admin details
    full_name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    // Role: SUPER_ADMIN or ADMIN
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN'],
        default: 'ADMIN',
        required: true
    },

    // Profile image
    profile_image: {
        type: String,
        default: 'default-admin.png'
    },

    // Phone number
    phone: {
        type: String,
        trim: true
    },

    // Status
    is_active: {
        type: Boolean,
        default: true
    },

    // Last login
    last_login: {
        type: Date
    },

    // Permissions (for future granular control)
    permissions: {
        can_manage_students: { type: Boolean, default: true },
        can_manage_teachers: { type: Boolean, default: true },
        can_manage_classes: { type: Boolean, default: true },
        can_manage_fees: { type: Boolean, default: true },
        can_manage_exams: { type: Boolean, default: true },
        can_manage_attendance: { type: Boolean, default: true },
        can_view_reports: { type: Boolean, default: true },
        can_manage_admins: { type: Boolean, default: false }, // Only SUPER_ADMIN
        can_delete_records: { type: Boolean, default: false }, // Only SUPER_ADMIN
        can_modify_school_settings: { type: Boolean, default: false } // Only SUPER_ADMIN
    },

    // Created by (which super admin created this admin)
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminUser'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
adminUserSchema.index({ school: 1, email: 1 }, { unique: true });
adminUserSchema.index({ school: 1, role: 1 });
adminUserSchema.index({ is_active: 1 });

// Virtual for getting admin's school name
adminUserSchema.virtual('school_info', {
    ref: 'School',
    localField: 'school',
    foreignField: '_id',
    justOne: true
});

// Pre-save middleware to update timestamps
adminUserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if user is super admin
adminUserSchema.methods.isSuperAdmin = function() {
    return this.role === 'SUPER_ADMIN';
};

// Method to check if user has specific permission
adminUserSchema.methods.hasPermission = function(permission) {
    if (this.role === 'SUPER_ADMIN') {
        return true; // Super admin has all permissions
    }
    return this.permissions[permission] === true;
};

module.exports = mongoose.model("AdminUser", adminUserSchema);
