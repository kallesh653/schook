const FrontPage = require('../model/frontPage.model');
const School = require('../model/school.model');

const frontPageController = {
  // Get front page data for a school
  getFrontPageData: async (req, res) => {
    try {
      console.log('=== GET FRONT PAGE DATA ===');
      console.log('User:', req.user);
      
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      let frontPageData = await FrontPage.findOne({ schoolId }).populate('schoolId', 'school_name school_image');
      
      // If no front page data exists, create default data
      if (!frontPageData) {
        const school = await School.findById(schoolId);
        if (!school) {
          return res.status(404).json({
            success: false,
            message: 'School not found'
          });
        }

        frontPageData = new FrontPage({
          schoolId,
          schoolInfo: {
            name: school.school_name,
            tagline: 'Nurturing Tomorrow\'s Leaders',
            description: 'Empowering students with knowledge, values, and skills for a brighter future.',
            established: '1995',
            students: '2,500+',
            teachers: '150+',
            achievements: '50+'
          },
          media: {
            logo: school.school_image || null
          },
          news: [
            {
              title: 'Welcome to Our School',
              description: 'We are excited to share our journey with you.',
              published: true
            }
          ],
          programs: [
            {
              title: 'Elementary School',
              description: 'Building strong foundations for lifelong learning',
              icon: '🌱',
              color: '#667eea'
            },
            {
              title: 'Middle School',
              description: 'Developing critical thinking and creativity',
              icon: '🚀',
              color: '#f093fb'
            },
            {
              title: 'High School',
              description: 'Preparing for college and career success',
              icon: '🎓',
              color: '#4facfe'
            }
          ]
        });
        
        await frontPageData.save();
      }

      res.status(200).json({
        success: true,
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in getFrontPageData:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching front page data',
        error: error.message
      });
    }
  },

  // Update school information
  updateSchoolInfo: async (req, res) => {
    try {
      console.log('=== UPDATE SCHOOL INFO ===');
      console.log('Request body:', req.body);
      
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      const updateData = {
        'schoolInfo.name': req.body.name,
        'schoolInfo.tagline': req.body.tagline,
        'schoolInfo.description': req.body.description,
        'schoolInfo.established': req.body.established,
        'schoolInfo.students': req.body.students,
        'schoolInfo.teachers': req.body.teachers,
        'schoolInfo.achievements': req.body.achievements
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const frontPageData = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: 'School information updated successfully',
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in updateSchoolInfo:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating school information',
        error: error.message
      });
    }
  },

  // Update media (images, videos)
  updateMedia: async (req, res) => {
    try {
      console.log('=== UPDATE MEDIA ===');
      console.log('Request body keys:', Object.keys(req.body));
      
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      const { logo, heroImage, aboutImage, heroVideo, promoVideo, campusVideo, virtualTour, galleryImages, sliderImages } = req.body;

      const updateData = {};
      if (logo !== undefined) updateData['media.logo'] = logo;
      if (heroImage !== undefined) updateData['media.heroImage'] = heroImage;
      if (aboutImage !== undefined) updateData['media.aboutImage'] = aboutImage;
      if (heroVideo !== undefined) updateData['media.heroVideo'] = heroVideo;
      if (promoVideo !== undefined) updateData['media.promoVideo'] = promoVideo;
      if (campusVideo !== undefined) updateData['media.campusVideo'] = campusVideo;
      if (virtualTour !== undefined) updateData['media.virtualTour'] = virtualTour;
      if (galleryImages !== undefined) updateData['media.galleryImages'] = galleryImages;
      if (sliderImages !== undefined) updateData['media.sliderImages'] = sliderImages;

      const frontPageData = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      res.status(200).json({
        success: true,
        message: 'Media updated successfully',
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in updateMedia:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating media',
        error: error.message
      });
    }
  },

  // Add news item
  addNews: async (req, res) => {
    try {
      console.log('=== ADD NEWS ===');
      console.log('Request body:', req.body);
      
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      const { title, description, image, published = true } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: 'Title and description are required'
        });
      }

      const newsItem = {
        title,
        description,
        image: image || null,
        published,
        date: new Date()
      };

      const frontPageData = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $push: { news: newsItem } },
        { new: true, upsert: true }
      );

      res.status(201).json({
        success: true,
        message: 'News item added successfully',
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in addNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding news item',
        error: error.message
      });
    }
  },

  // Update news item
  updateNews: async (req, res) => {
    try {
      console.log('=== UPDATE NEWS ===');
      console.log('Request body:', req.body);
      
      const schoolId = req.user?.schoolId;
      const { newsId } = req.params;
      
      if (!schoolId || !newsId) {
        return res.status(400).json({
          success: false,
          message: 'School ID and News ID are required'
        });
      }

      const { title, description, image, published } = req.body;
      
      const updateFields = {};
      if (title !== undefined) updateFields['news.$.title'] = title;
      if (description !== undefined) updateFields['news.$.description'] = description;
      if (image !== undefined) updateFields['news.$.image'] = image;
      if (published !== undefined) updateFields['news.$.published'] = published;

      const frontPageData = await FrontPage.findOneAndUpdate(
        { schoolId, 'news._id': newsId },
        { $set: updateFields },
        { new: true }
      );

      if (!frontPageData) {
        return res.status(404).json({
          success: false,
          message: 'News item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'News item updated successfully',
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in updateNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating news item',
        error: error.message
      });
    }
  },

  // Delete news item
  deleteNews: async (req, res) => {
    try {
      console.log('=== DELETE NEWS ===');
      console.log('News ID:', req.params.newsId);
      
      const schoolId = req.user?.schoolId;
      const { newsId } = req.params;
      
      if (!schoolId || !newsId) {
        return res.status(400).json({
          success: false,
          message: 'School ID and News ID are required'
        });
      }

      const frontPageData = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $pull: { news: { _id: newsId } } },
        { new: true }
      );

      if (!frontPageData) {
        return res.status(404).json({
          success: false,
          message: 'School or news item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'News item deleted successfully',
        data: frontPageData
      });
    } catch (error) {
      console.error('❌ Error in deleteNews:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting news item',
        error: error.message
      });
    }
  },

  // Update theme settings
  updateTheme: async (req, res) => {
    try {
      console.log('=== UPDATE THEME ===');
      console.log('Request body:', req.body);
      
      const schoolId = req.user?.schoolId;
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      const frontPage = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $set: { theme: req.body } },
        { new: true, upsert: true }
      );
      
      res.json({
        success: true,
        message: 'Theme updated successfully',
        data: frontPage.theme
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating theme',
        error: error.message
      });
    }
  },

  // Update header settings
  updateHeaderSettings: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      
      const frontPage = await FrontPage.findOneAndUpdate(
        { schoolId },
        { $set: { headerSettings: req.body } },
        { new: true, upsert: true }
      );
      
      res.json({
        success: true,
        message: 'Header settings updated successfully',
        data: frontPage.headerSettings
      });
    } catch (error) {
      console.error('Error updating header settings:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating header settings',
        error: error.message
      });
    }
  },

  // Get public front page data (no authentication required)
  getPublicFrontPageData: async (req, res) => {
    try {
      console.log('=== GET PUBLIC FRONT PAGE DATA ===');
      const { schoolId } = req.params;
      
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
      }

      const frontPageData = await FrontPage.findOne({ schoolId })
        .populate('schoolId', 'school_name school_image')
        .select('-__v');

      if (!frontPageData) {
        return res.status(404).json({
          success: false,
          message: 'Front page data not found'
        });
      }

      // Filter only published news items for public view
      const publicData = {
        ...frontPageData.toObject(),
        news: frontPageData.news.filter(item => item.published)
      };

      res.status(200).json({
        success: true,
        data: publicData
      });
    } catch (error) {
      console.error('❌ Error in getPublicFrontPageData:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching public front page data',
        error: error.message
      });
    }
  }
};

module.exports = frontPageController;
