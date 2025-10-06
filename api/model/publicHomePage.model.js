const mongoose = require('mongoose');

// Global Public Home Page - NOT tied to any specific school
const publicHomePageSchema = new mongoose.Schema({
  // There will only be ONE document in this collection
  isSingleton: {
    type: Boolean,
    default: true,
    unique: true
  },

  // Main Hero Section
  heroSection: {
    title: {
      type: String,
      default: 'SCHOOL MANAGEMENT SYSTEM'
    },
    subtitle: {
      type: String,
      default: 'Manage Your School Efficiently'
    },
    description: {
      type: String,
      default: 'A comprehensive platform for managing students, teachers, classes, and more.'
    },
    backgroundImage: {
      type: String,
      default: null
    },
    ctaButtonText: {
      type: String,
      default: 'Get Started'
    },
    ctaButtonLink: {
      type: String,
      default: '/login'
    }
  },

  // About Section
  aboutSection: {
    title: {
      type: String,
      default: 'About Our Platform'
    },
    description: {
      type: String,
      default: 'Our school management system helps educational institutions streamline their operations.'
    },
    image: {
      type: String,
      default: null
    },
    features: [{
      icon: String,
      title: String,
      description: String
    }]
  },

  // Statistics Section
  statistics: {
    showSection: {
      type: Boolean,
      default: true
    },
    stats: [{
      label: String,
      value: String,
      icon: String
    }]
  },

  // Image/Video Slider
  slider: {
    showSlider: {
      type: Boolean,
      default: true
    },
    slides: [{
      id: { type: String, required: true },
      type: { type: String, enum: ['image', 'video'], default: 'image' },
      url: { type: String, required: true },
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      order: { type: Number, default: 0 },
      active: { type: Boolean, default: true }
    }]
  },

  // Features/Services Section
  features: {
    showSection: {
      type: Boolean,
      default: true
    },
    sectionTitle: {
      type: String,
      default: 'Key Features'
    },
    items: [{
      icon: String,
      title: String,
      description: String,
      color: String
    }]
  },

  // Announcements/News Section
  announcements: {
    showSection: {
      type: Boolean,
      default: true
    },
    sectionTitle: {
      type: String,
      default: 'Latest Updates'
    },
    items: [{
      title: String,
      description: String,
      date: { type: Date, default: Date.now },
      image: String,
      published: { type: Boolean, default: true }
    }]
  },

  // Theme Settings
  theme: {
    primaryColor: {
      type: String,
      default: '#667eea'
    },
    secondaryColor: {
      type: String,
      default: '#764ba2'
    },
    fontFamily: {
      type: String,
      default: 'Roboto, sans-serif'
    }
  },

  // Header/Navigation
  header: {
    logo: {
      type: String,
      default: null
    },
    siteName: {
      type: String,
      default: 'SCHOOL MANAGEMENT SYSTEM'
    },
    showLoginButton: {
      type: Boolean,
      default: true
    },
    showRegisterButton: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#333333'
    }
  },

  // Footer
  footer: {
    copyrightText: {
      type: String,
      default: '© 2024 School Management System. All rights reserved.'
    },
    socialLinks: [{
      platform: String,
      url: String,
      icon: String
    }],
    contactInfo: {
      email: String,
      phone: String,
      address: String
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('PublicHomePage', publicHomePageSchema);
