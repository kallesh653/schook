const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // URL or base64 string
    default: null
  },
  published: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const programSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🎓'
  },
  color: {
    type: String,
    default: '#667eea'
  }
}, { timestamps: true });

const frontPageSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    unique: true
  },
  // School Information
  schoolInfo: {
    name: {
      type: String,
      required: true
    },
    tagline: {
      type: String,
      default: 'Nurturing Tomorrow\'s Leaders'
    },
    description: {
      type: String,
      default: 'Empowering students with knowledge, values, and skills for a brighter future.'
    },
    established: {
      type: String,
      default: '1995'
    },
    students: {
      type: String,
      default: '2,500+'
    },
    teachers: {
      type: String,
      default: '150+'
    },
    achievements: {
      type: String,
      default: '50+'
    }
  },
  // Images and Media
  media: {
    logo: { type: String, default: null },
    heroImage: { type: String, default: null },
    aboutImage: { type: String, default: null },
    heroVideo: { type: String, default: null },
    promoVideo: { type: String, default: null },
    campusVideo: { type: String, default: null },
    virtualTour: { type: String, default: null },
    galleryImages: [{
      type: String
    }],
    sliderImages: [{
      id: { type: String, required: true },
      url: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      order: { type: Number, default: 0 },
      active: { type: Boolean, default: true }
    }]
  },
  // News and Events
  news: [newsSchema],
  // Programs
  programs: [programSchema],
  // Theme and Layout Settings
  theme: {
    primaryColor: { type: String, default: '#667eea' },
    secondaryColor: { type: String, default: '#764ba2' },
    showStatistics: { type: Boolean, default: true },
    showNews: { type: Boolean, default: true },
    showPrograms: { type: Boolean, default: true },
    showGallery: { type: Boolean, default: false },
    showVideos: { type: Boolean, default: false }
  },
  headerSettings: {
    schoolName: { type: String, default: '' },
    showLogo: { type: Boolean, default: true },
    logoPosition: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    navigationStyle: { type: String, enum: ['modern', 'classic', 'minimal'], default: 'modern' },
    backgroundColor: { type: String, default: '#fefefe' },
    textColor: { type: String, default: '#333' },
    showLoginButton: { type: Boolean, default: true },
    showRegisterButton: { type: Boolean, default: true },
    showDashboardButton: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('FrontPage', frontPageSchema);
