const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  mediaUrl: { type: String, required: true },
  buttonText: { type: String },
  buttonLink: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const statisticSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  value: { type: Number, required: true },
  label: { type: String, required: true },
  suffix: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

const aboutSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subheading: { type: String },
  description: { type: String, required: true },
  images: [{ type: String }],
  mission: { type: String },
  vision: { type: String },
  values: [{ type: String }]
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
  link: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  videoType: { type: String, enum: ['hero', 'promotional', 'campus', 'virtual'], required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'general' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const programSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  ageGroup: { type: String },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const featureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String },
  image: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const testimonialSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  studentName: { type: String },
  testimonial: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: { type: String },
  designation: { type: String },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const headerSchema = new mongoose.Schema({
  logo: { type: String },
  schoolName: { type: String, required: true },
  tagline: { type: String },
  primaryColor: { type: String, default: '#667eea' },
  secondaryColor: { type: String, default: '#764ba2' },
  accentColor: { type: String, default: '#f093fb' },
  fontFamily: { type: String, default: 'Roboto, sans-serif' },
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    youtube: { type: String },
    linkedin: { type: String }
  },
  mapLocation: {
    showMap: { type: Boolean, default: false },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    zoom: { type: Number, default: 15 },
    mapUrl: { type: String },
    embedUrl: { type: String }
  }
});

const exploreCampusSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  virtualTourLink: { type: String },
  brochureLink: { type: String }
});

const homePageContentSchema = new mongoose.Schema({
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
    unique: true
  },

  // Header and Branding
  header: { type: headerSchema, required: true },

  // Hero Slider
  sliders: [sliderSchema],

  // Statistics Section
  statistics: [statisticSchema],

  // About Section
  about: { type: aboutSchema, required: true },

  // Explore Campus Section
  exploreCampus: { type: exploreCampusSchema },

  // News and Events
  news: [newsSchema],

  // Videos Section
  videos: [videoSchema],

  // Gallery Section
  gallery: [gallerySchema],

  // Programs Section
  programs: [programSchema],

  // Why Choose Us Section
  whyChooseUs: {
    heading: { type: String, default: 'Why Choose Us' },
    description: { type: String },
    features: [featureSchema]
  },

  // Testimonials Section
  testimonials: {
    heading: { type: String, default: 'What Parents Say' },
    description: { type: String },
    items: [testimonialSchema]
  },

  // Section Visibility Controls
  sectionVisibility: {
    showSlider: { type: Boolean, default: true },
    showStatistics: { type: Boolean, default: true },
    showAbout: { type: Boolean, default: true },
    showExploreCampus: { type: Boolean, default: true },
    showNews: { type: Boolean, default: true },
    showVideos: { type: Boolean, default: true },
    showGallery: { type: Boolean, default: true },
    showPrograms: { type: Boolean, default: true },
    showWhyChooseUs: { type: Boolean, default: true },
    showTestimonials: { type: Boolean, default: true }
  },

  // SEO and Meta
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: [{ type: String }],
    ogImage: { type: String }
  },

  // Published status
  isPublished: { type: Boolean, default: true },
  lastPublishedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
homePageContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isPublished && this.isModified()) {
    this.lastPublishedAt = Date.now();
  }
  next();
});

const HomePageContent = mongoose.model("HomePageContent", homePageContentSchema);

module.exports = HomePageContent;
