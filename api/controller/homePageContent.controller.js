const HomePageContent = require("../model/homePageContent.model");
const formidableLib = require("formidable");
const fs = require("fs");
const path = require("path");

// Get home page content for any school (public - no auth)
const getPublicHomePageContent = async (req, res) => {
  try {
    // Try to get first available school's home page content
    const content = await HomePageContent.findOne().populate('schoolId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "No home page content available yet"
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error("Error fetching public home page content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching home page content",
      error: error.message
    });
  }
};

// Get home page content by schoolId
const getHomePageContent = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const content = await HomePageContent.findOne({ schoolId }).populate('schoolId');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error("Error fetching home page content:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching home page content",
      error: error.message
    });
  }
};

// Create or update home page content
const createOrUpdateHomePageContent = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const contentData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (content) {
      // Update existing content
      Object.keys(contentData).forEach(key => {
        if (contentData[key] !== undefined) {
          content[key] = contentData[key];
        }
      });
      await content.save();
    } else {
      // Create new content
      content = new HomePageContent({
        schoolId,
        ...contentData
      });
      await content.save();
    }

    res.status(200).json({
      success: true,
      message: "Home page content saved successfully",
      data: content
    });
  } catch (error) {
    console.error("Error saving home page content:", error);
    res.status(500).json({
      success: false,
      message: "Error saving home page content",
      error: error.message
    });
  }
};

// Update header section
const updateHeader = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const headerData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found. Please create it first."
      });
    }

    content.header = { ...content.header, ...headerData };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Header updated successfully",
      data: content.header
    });
  } catch (error) {
    console.error("Error updating header:", error);
    res.status(500).json({
      success: false,
      message: "Error updating header",
      error: error.message
    });
  }
};

// Add slider
const addSlider = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const sliderData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.sliders.push(sliderData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Slider added successfully",
      data: content.sliders
    });
  } catch (error) {
    console.error("Error adding slider:", error);
    res.status(500).json({
      success: false,
      message: "Error adding slider",
      error: error.message
    });
  }
};

// Update slider
const updateSlider = async (req, res) => {
  try {
    const { schoolId, sliderId } = req.params;
    const sliderData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const sliderIndex = content.sliders.findIndex(
      s => s._id.toString() === sliderId
    );

    if (sliderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Slider not found"
      });
    }

    content.sliders[sliderIndex] = {
      ...content.sliders[sliderIndex].toObject(),
      ...sliderData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Slider updated successfully",
      data: content.sliders[sliderIndex]
    });
  } catch (error) {
    console.error("Error updating slider:", error);
    res.status(500).json({
      success: false,
      message: "Error updating slider",
      error: error.message
    });
  }
};

// Delete slider
const deleteSlider = async (req, res) => {
  try {
    const { schoolId, sliderId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.sliders = content.sliders.filter(
      s => s._id.toString() !== sliderId
    );
    await content.save();

    res.status(200).json({
      success: true,
      message: "Slider deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting slider:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting slider",
      error: error.message
    });
  }
};

// Update statistics
const updateStatistics = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const statistics = req.body.statistics;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.statistics = statistics;
    await content.save();

    res.status(200).json({
      success: true,
      message: "Statistics updated successfully",
      data: content.statistics
    });
  } catch (error) {
    console.error("Error updating statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error updating statistics",
      error: error.message
    });
  }
};

// Update about section
const updateAbout = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const aboutData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.about = { ...content.about, ...aboutData };
    await content.save();

    res.status(200).json({
      success: true,
      message: "About section updated successfully",
      data: content.about
    });
  } catch (error) {
    console.error("Error updating about section:", error);
    res.status(500).json({
      success: false,
      message: "Error updating about section",
      error: error.message
    });
  }
};

// Update explore campus section
const updateExploreCampus = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const campusData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.exploreCampus = { ...content.exploreCampus, ...campusData };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Explore campus section updated successfully",
      data: content.exploreCampus
    });
  } catch (error) {
    console.error("Error updating explore campus:", error);
    res.status(500).json({
      success: false,
      message: "Error updating explore campus section",
      error: error.message
    });
  }
};

// News CRUD operations
const addNews = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const newsData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.news.push(newsData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "News added successfully",
      data: content.news
    });
  } catch (error) {
    console.error("Error adding news:", error);
    res.status(500).json({
      success: false,
      message: "Error adding news",
      error: error.message
    });
  }
};

const updateNews = async (req, res) => {
  try {
    const { schoolId, newsId } = req.params;
    const newsData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const newsIndex = content.news.findIndex(n => n._id.toString() === newsId);

    if (newsIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "News not found"
      });
    }

    content.news[newsIndex] = {
      ...content.news[newsIndex].toObject(),
      ...newsData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: content.news[newsIndex]
    });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({
      success: false,
      message: "Error updating news",
      error: error.message
    });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { schoolId, newsId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.news = content.news.filter(n => n._id.toString() !== newsId);
    await content.save();

    res.status(200).json({
      success: true,
      message: "News deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting news",
      error: error.message
    });
  }
};

// Video CRUD operations
const addVideo = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const videoData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.videos.push(videoData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Video added successfully",
      data: content.videos
    });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({
      success: false,
      message: "Error adding video",
      error: error.message
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { schoolId, videoId } = req.params;
    const videoData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const videoIndex = content.videos.findIndex(
      v => v._id.toString() === videoId
    );

    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    content.videos[videoIndex] = {
      ...content.videos[videoIndex].toObject(),
      ...videoData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: content.videos[videoIndex]
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({
      success: false,
      message: "Error updating video",
      error: error.message
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { schoolId, videoId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.videos = content.videos.filter(v => v._id.toString() !== videoId);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting video",
      error: error.message
    });
  }
};

// Gallery CRUD operations
const addGalleryImage = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const imageData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.gallery.push(imageData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Gallery image added successfully",
      data: content.gallery
    });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    res.status(500).json({
      success: false,
      message: "Error adding gallery image",
      error: error.message
    });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const { schoolId, imageId } = req.params;
    const imageData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const imageIndex = content.gallery.findIndex(
      g => g._id.toString() === imageId
    );

    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found"
      });
    }

    content.gallery[imageIndex] = {
      ...content.gallery[imageIndex].toObject(),
      ...imageData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Gallery image updated successfully",
      data: content.gallery[imageIndex]
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    res.status(500).json({
      success: false,
      message: "Error updating gallery image",
      error: error.message
    });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const { schoolId, imageId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.gallery = content.gallery.filter(
      g => g._id.toString() !== imageId
    );
    await content.save();

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting gallery image",
      error: error.message
    });
  }
};

// Program CRUD operations
const addProgram = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const programData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.programs.push(programData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Program added successfully",
      data: content.programs
    });
  } catch (error) {
    console.error("Error adding program:", error);
    res.status(500).json({
      success: false,
      message: "Error adding program",
      error: error.message
    });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { schoolId, programId } = req.params;
    const programData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const programIndex = content.programs.findIndex(
      p => p._id.toString() === programId
    );

    if (programIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Program not found"
      });
    }

    content.programs[programIndex] = {
      ...content.programs[programIndex].toObject(),
      ...programData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: content.programs[programIndex]
    });
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({
      success: false,
      message: "Error updating program",
      error: error.message
    });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { schoolId, programId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.programs = content.programs.filter(
      p => p._id.toString() !== programId
    );
    await content.save();

    res.status(200).json({
      success: true,
      message: "Program deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting program",
      error: error.message
    });
  }
};

// Why Choose Us operations
const updateWhyChooseUs = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const whyChooseUsData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.whyChooseUs = { ...content.whyChooseUs, ...whyChooseUsData };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Why Choose Us section updated successfully",
      data: content.whyChooseUs
    });
  } catch (error) {
    console.error("Error updating Why Choose Us:", error);
    res.status(500).json({
      success: false,
      message: "Error updating Why Choose Us section",
      error: error.message
    });
  }
};

// Testimonial CRUD operations
const addTestimonial = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const testimonialData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.testimonials.items.push(testimonialData);
    await content.save();

    res.status(200).json({
      success: true,
      message: "Testimonial added successfully",
      data: content.testimonials.items
    });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error adding testimonial",
      error: error.message
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { schoolId, testimonialId } = req.params;
    const testimonialData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    const testimonialIndex = content.testimonials.items.findIndex(
      t => t._id.toString() === testimonialId
    );

    if (testimonialIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found"
      });
    }

    content.testimonials.items[testimonialIndex] = {
      ...content.testimonials.items[testimonialIndex].toObject(),
      ...testimonialData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: content.testimonials.items[testimonialIndex]
    });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error updating testimonial",
      error: error.message
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { schoolId, testimonialId } = req.params;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.testimonials.items = content.testimonials.items.filter(
      t => t._id.toString() !== testimonialId
    );
    await content.save();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting testimonial",
      error: error.message
    });
  }
};

// Update section visibility
const updateSectionVisibility = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const visibilityData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.sectionVisibility = {
      ...content.sectionVisibility,
      ...visibilityData
    };
    await content.save();

    res.status(200).json({
      success: true,
      message: "Section visibility updated successfully",
      data: content.sectionVisibility
    });
  } catch (error) {
    console.error("Error updating section visibility:", error);
    res.status(500).json({
      success: false,
      message: "Error updating section visibility",
      error: error.message
    });
  }
};

// Update SEO
const updateSEO = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const seoData = req.body;

    let content = await HomePageContent.findOne({ schoolId });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Home page content not found"
      });
    }

    content.seo = { ...content.seo, ...seoData };
    await content.save();

    res.status(200).json({
      success: true,
      message: "SEO updated successfully",
      data: content.seo
    });
  } catch (error) {
    console.error("Error updating SEO:", error);
    res.status(500).json({
      success: false,
      message: "Error updating SEO",
      error: error.message
    });
  }
};

// File upload handler
const uploadFile = async (req, res) => {
  const form = new formidableLib.IncomingForm({
    multiples: true,
    uploadDir: path.join(__dirname, "../uploads/home-page"),
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024 // 50MB
  });

  // Create upload directory if it doesn't exist
  const uploadDir = path.join(__dirname, "../uploads/home-page");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("File upload error:", err);
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
        const fileUrl = `/uploads/home-page/${fileName}`;
        uploadedFiles.push({
          filename: fileName,
          originalName: file.originalFilename,
          url: fileUrl,
          size: file.size,
          type: file.mimetype
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      files: uploadedFiles
    });
  });
};

module.exports = {
  getPublicHomePageContent,
  getHomePageContent,
  createOrUpdateHomePageContent,
  updateHeader,
  addSlider,
  updateSlider,
  deleteSlider,
  updateStatistics,
  updateAbout,
  updateExploreCampus,
  addNews,
  updateNews,
  deleteNews,
  addVideo,
  updateVideo,
  deleteVideo,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  addProgram,
  updateProgram,
  deleteProgram,
  updateWhyChooseUs,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  updateSectionVisibility,
  updateSEO,
  uploadFile
};
