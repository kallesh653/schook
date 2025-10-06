const PublicHomePage = require('../model/publicHomePage.model');

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

    let publicPage = await PublicHomePage.findOne({ isSingleton: true });

    if (!publicPage) {
      publicPage = await PublicHomePage.create({ isSingleton: true });
    }

    if (showSlider !== undefined) publicPage.slider.showSlider = showSlider;
    if (slides !== undefined) publicPage.slider.slides = slides;

    await publicPage.save();

    res.status(200).json({
      success: true,
      message: 'Slider updated successfully',
      data: publicPage
    });
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating slider'
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
