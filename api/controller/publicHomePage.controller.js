const PublicHomePage = require('../model/publicHomePage.model');
const formidableLib = require('formidable');
const path = require('path');
const fs = require('fs');

// Get public home page data (NO authentication required)
exports.getPublicHomePageData = async (req, res) => {
  try {
    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    // If no public page exists, create default one
    if (!publicPage) {
      publicPage = await PublicHomePage.create({
        isSingleton: true,
        heroSection: {
          title: 'SCHOOL MANAGEMENT SYSTEM',
          subtitle: 'Manage Your School Efficiently',
          description: 'A comprehensive platform for managing students, teachers, classes, and more.'
        },
        statistics: {
          showSection: true,
          stats: [
            { label: 'Schools', value: '100+', icon: 'school' },
            { label: 'Students', value: '10,000+', icon: 'students' },
            { label: 'Teachers', value: '1,000+', icon: 'teachers' },
            { label: 'Success Rate', value: '95%', icon: 'success' }
          ]
        },
        features: {
          showSection: true,
          sectionTitle: 'Key Features',
          items: [
            {
              icon: 'students',
              title: 'Student Management',
              description: 'Manage student information, attendance, and records efficiently',
              color: '#667eea'
            },
            {
              icon: 'teachers',
              title: 'Teacher Management',
              description: 'Handle teacher profiles, schedules, and performance tracking',
              color: '#f093fb'
            },
            {
              icon: 'classes',
              title: 'Class Management',
              description: 'Organize classes, subjects, and timetables seamlessly',
              color: '#4facfe'
            },
            {
              icon: 'exams',
              title: 'Examination System',
              description: 'Create and manage exams, grades, and report cards',
              color: '#43e97b'
            }
          ]
        }
      });
    }

    res.status(200).json({
      success: true,
      data: publicPage
    });
  } catch (error) {
    console.error('Error fetching public home page:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching public home page data'
    });
  }
};

// Update hero section (requires authentication)
exports.updateHeroSection = async (req, res) => {
  try {
    const { title, subtitle, description, backgroundImage, ctaButtonText, ctaButtonLink } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (title !== undefined) publicPage.heroSection.title = title;
    if (subtitle !== undefined) publicPage.heroSection.subtitle = subtitle;
    if (description !== undefined) publicPage.heroSection.description = description;
    if (backgroundImage !== undefined) publicPage.heroSection.backgroundImage = backgroundImage;
    if (ctaButtonText !== undefined) publicPage.heroSection.ctaButtonText = ctaButtonText;
    if (ctaButtonLink !== undefined) publicPage.heroSection.ctaButtonLink = ctaButtonLink;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating hero section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hero section'
    });
  }
};

// Update slider
exports.updateSlider = async (req, res) => {
  try {
    const { showSlider, slides } = req.body;

    console.log('📥 Received slider update request:', { showSlider, slidesCount: slides?.length });

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      console.log('Creating new public page document...');
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSlider !== undefined) publicPage.slider.showSlider = showSlider;
    if (slides !== undefined) {
      // Ensure all slides have required fields
      publicPage.slider.slides = slides.map(slide => ({
        id: slide.id || Date.now().toString(),
        type: slide.type || 'image',
        url: slide.url,
        title: slide.title || '',
        description: slide.description || '',
        order: slide.order || 0,
        active: slide.active !== undefined ? slide.active : true
      }));
    }

    await publicPage.save();

    console.log('✅ Slider updated successfully');

    res.status(200).json({
      success: true,
      message: 'Slider updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('❌ Error updating slider:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating slider'
    });
  }
};

// Update statistics
exports.updateStatistics = async (req, res) => {
  try {
    const { showSection, stats } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.statistics.showSection = showSection;
    if (stats !== undefined) publicPage.statistics.stats = stats;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Statistics updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating statistics'
    });
  }
};

// Update features
exports.updateFeatures = async (req, res) => {
  try {
    const { showSection, sectionTitle, items } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.features.showSection = showSection;
    if (sectionTitle !== undefined) publicPage.features.sectionTitle = sectionTitle;
    if (items !== undefined) publicPage.features.items = items;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Features updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating features:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating features'
    });
  }
};

// Update announcements
exports.updateAnnouncements = async (req, res) => {
  try {
    const { showSection, sectionTitle, items } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.announcements.showSection = showSection;
    if (sectionTitle !== undefined) publicPage.announcements.sectionTitle = sectionTitle;
    if (items !== undefined) publicPage.announcements.items = items;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Announcements updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating announcements'
    });
  }
};

// Update header
exports.updateHeader = async (req, res) => {
  try {
    const { logo, siteName, showLoginButton, showRegisterButton, backgroundColor, textColor } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (logo !== undefined) publicPage.header.logo = logo;
    if (siteName !== undefined) publicPage.header.siteName = siteName;
    if (showLoginButton !== undefined) publicPage.header.showLoginButton = showLoginButton;
    if (showRegisterButton !== undefined) publicPage.header.showRegisterButton = showRegisterButton;
    if (backgroundColor !== undefined) publicPage.header.backgroundColor = backgroundColor;
    if (textColor !== undefined) publicPage.header.textColor = textColor;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Header updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating header:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating header'
    });
  }
};

// Update theme
exports.updateTheme = async (req, res) => {
  try {
    const { primaryColor, secondaryColor, fontFamily } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (primaryColor !== undefined) publicPage.theme.primaryColor = primaryColor;
    if (secondaryColor !== undefined) publicPage.theme.secondaryColor = secondaryColor;
    if (fontFamily !== undefined) publicPage.theme.fontFamily = fontFamily;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Theme updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating theme'
    });
  }
};

// Update programs section
exports.updatePrograms = async (req, res) => {
  try {
    const { showSection, sectionTitle, items } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.programs.showSection = showSection;
    if (sectionTitle !== undefined) publicPage.programs.sectionTitle = sectionTitle;
    if (items !== undefined) publicPage.programs.items = items;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Programs updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating programs:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating programs'
    });
  }
};

// Update campus section
exports.updateCampus = async (req, res) => {
  try {
    const { showSection, sectionTitle, description, images, videoUrl } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.campus.showSection = showSection;
    if (sectionTitle !== undefined) publicPage.campus.sectionTitle = sectionTitle;
    if (description !== undefined) publicPage.campus.description = description;
    if (images !== undefined) publicPage.campus.images = images;
    if (videoUrl !== undefined) publicPage.campus.videoUrl = videoUrl;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Campus section updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating campus:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating campus section'
    });
  }
};

// Update testimonials section
exports.updateTestimonials = async (req, res) => {
  try {
    const { showSection, sectionTitle, items } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.testimonials.showSection = showSection;
    if (sectionTitle !== undefined) publicPage.testimonials.sectionTitle = sectionTitle;
    if (items !== undefined) publicPage.testimonials.items = items;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Testimonials updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating testimonials'
    });
  }
};

// Update about section
exports.updateAbout = async (req, res) => {
  try {
    const { title, description, image, features } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (title !== undefined) publicPage.aboutSection.title = title;
    if (description !== undefined) publicPage.aboutSection.description = description;
    if (image !== undefined) publicPage.aboutSection.image = image;
    if (features !== undefined) publicPage.aboutSection.features = features;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'About section updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating about section:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating about section'
    });
  }
};
// Update social media links
exports.updateSocialMedia = async (req, res) => {
  try {
    const { whatsapp, instagram, twitter, facebook, youtube } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (whatsapp !== undefined) publicPage.socialMedia.whatsapp = whatsapp;
    if (instagram !== undefined) publicPage.socialMedia.instagram = instagram;
    if (twitter !== undefined) publicPage.socialMedia.twitter = twitter;
    if (facebook !== undefined) publicPage.socialMedia.facebook = facebook;
    if (youtube !== undefined) publicPage.socialMedia.youtube = youtube;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Social media links updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating social media:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating social media links'
    });
  }
};

// Update Achievements section
exports.updateAchievements = async (req, res) => {
  try {
    const { showSection, sectionTitle, items } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.achievements.showSection = showSection;
    if (sectionTitle) publicPage.achievements.sectionTitle = sectionTitle;
    if (items) publicPage.achievements.items = items;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Achievements section updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating achievements section'
    });
  }
};

// Update Contact Information
exports.updateContact = async (req, res) => {
  try {
    const { showSection, phone, email, address } = req.body;

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSection !== undefined) publicPage.contact.showSection = showSection;
    if (phone !== undefined) publicPage.contact.phone = phone;
    if (email !== undefined) publicPage.contact.email = email;
    if (address !== undefined) publicPage.contact.address = address;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Contact information updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact information'
    });
  }
};

// File upload handler for public home page
exports.uploadFile = async (req, res) => {
  const form = formidableLib.formidable({
    multiples: true,
    uploadDir: path.join(__dirname, "../uploads/public-home"),
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024 // 50MB
  });

  // Create upload directory if it doesn't exist
  const uploadDir = path.join(__dirname, "../uploads/public-home");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("❌ File upload error:", err);
      return res.status(500).json({
        success: false,
        message: "File upload failed",
        error: err.message
      });
    }

    const uploadedFiles = [];
    const fileArray = Array.isArray(files.file) ? files.file : [files.file];

    fileArray.forEach(file => {
      if (file) {
        const fileName = file.newFilename || file.originalFilename;
        const fileUrl = `/uploads/public-home/${fileName}`;
        uploadedFiles.push({
          filename: fileName,
          originalName: file.originalFilename,
          url: fileUrl,
          size: file.size,
          type: file.mimetype
        });
        console.log(`✅ File uploaded: ${fileName}`);
      }
    });

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles
    });
  });
};
