require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const School = require("../model/school.model");
const AdminUser = require("../model/adminUser.model");
module.exports = {

    getAllSchools: async(req,res)=>{
         try {
            const schools= await School.find().select(['-_id','-password','-email','-owner_name','-createdAt']);
            res.status(200).json({success:true, message:"Success in fetching all  Schools", data:schools})
         } catch (error) {
            console.log("Error in getAllSchools", error);
            res.status(500).json({success:false, message:"Server Error in Getting All Schools. Try later"})
        }

    },
    registerSchool: async (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            console.log(fields,"fields")
            School.find({ email: fields.email }).then(resp => {
                if (resp.length > 0) {
                    res.status(500).json({ success: false, message: "Email Already Exist!" })
                } else {
                    const photo = files.image[0];
                    let oldPath = photo.filepath;
                    let originalFileName = photo.originalFilename.replace(" ", "_")

                    let newPath = path.join(__dirname, '../../frontend/public/images/uploaded/school', '/', originalFileName)

                    let photoData = fs.readFileSync(oldPath);
                    fs.writeFile(newPath, photoData, function (err) {
                        if (err) console.log(err);

                        var salt = bcrypt.genSaltSync(10);
                        var hashPassword = bcrypt.hashSync(fields.password[0], salt);

                        const newSchool = new School({
                            school_name:fields.school_name[0],
                            email: fields.email[0],
                            owner_name: fields.owner_name[0],
                            password: hashPassword,
                            school_image: originalFileName
                        })

                        newSchool.save().then(async savedData => {
                            console.log("School saved", savedData);

                            // Create primary SUPER_ADMIN user
                            try {
                                const primaryAdmin = new AdminUser({
                                    school: savedData._id,
                                    full_name: fields.owner_name[0],
                                    email: fields.email[0],
                                    password: hashPassword, // Use the same hashed password
                                    role: 'SUPER_ADMIN',
                                    phone: fields.phone ? fields.phone[0] : '',
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
                                    profile_image: originalFileName,
                                    is_active: true
                                });

                                const savedAdmin = await primaryAdmin.save();

                                // Update school with primary_admin reference
                                savedData.primary_admin = savedAdmin._id;
                                await savedData.save();

                                console.log("Primary admin created", savedAdmin);

                                res.status(200).json({
                                    success: true,
                                    data: {
                                        school: savedData,
                                        primaryAdmin: {
                                            id: savedAdmin._id,
                                            full_name: savedAdmin.full_name,
                                            email: savedAdmin.email,
                                            role: savedAdmin.role
                                        }
                                    },
                                    message: "School is Registered Successfully. Primary admin account created."
                                });
                            } catch (adminError) {
                                console.log("Error creating primary admin:", adminError);
                                // School is created, but admin creation failed
                                res.status(200).json({
                                    success: true,
                                    data: savedData,
                                    message: "School registered but admin creation failed. Please contact support.",
                                    warning: "Primary admin not created"
                                });
                            }
                        }).catch(e => {
                            console.log("ERROR in Register", e)
                            res.status(500).json({ success: false, message: "Failed Registration." })
                        })

                    })


                }
            })

        })



    },
    loginSchool: async (req, res) => {
        School.find({ email: req.body.email }).populate('primary_admin').then(resp => {
            if (resp.length > 0) {
                // Always check if school has a primary admin and redirect to admin login
                // This applies to school owner login only, not admin login
                if (resp[0].primary_admin) {
                    return res.status(200).json({
                        success: false,
                        message: "This school uses Admin login. Please use the Admin Login with your credentials.",
                        loginType: 'ADMIN_REQUIRED',
                        schoolId: resp[0]._id,
                        redirectToAdminLogin: true
                    });
                }

                // Legacy school login for backward compatibility (only if no primary_admin exists)
                const isAuth = bcrypt.compareSync(req.body.password, resp[0].password);
                if (isAuth) {
                    const token = jwt.sign(
                        {
                            id: resp[0]._id,
                            schoolId:resp[0]._id,
                            school_name: resp[0].school_name,
                            owner_name:resp[0].owner_name,
                            image_url: resp[0].school_image,
                            role:'SCHOOL'
                        }, jwtSecret );

                   res.header("Authorization", token);
                   res.status(200).json({
                    success: true,
                    message: "Success Login",
                    token: token,
                    loginType: 'SCHOOL',
                    user: {
                         id: resp[0]._id,
                         owner_name:resp[0].owner_name,
                         school_name: resp[0].school_name,
                          image_url: resp[0].school_image,
                          role: "SCHOOL" } })
                }else {
                    res.status(401).json({ success: false, message: "Password doesn't match." })
                }

            } else {
                res.status(401).json({ success: false, message: "Email not registerd." })
            }
        })
    },
    getSchoolOwnData: async(req, res)=>{
        const id = req.user.id;
        School.findById(id).then(resp=>{
            if(resp){
                res.status(200).json({success:true, data:resp})
            }else {
                res.status(500).json({ success: false, message: "School data not Available" })
            }
        }).catch(e=>{
            console.log("Error in getSchoolWithId", e)
            res.status(500).json({ success: false, message: "Error in getting  School Data" })
        })
    },

    updateSchoolWithId: async (req, res) => {
        const form =new formidable.IncomingForm({ multiples: false,
         uploadDir: path.join(__dirname, '../../frontend/public/images/uploaded/school'), keepExtensions: true });
        form.parse(req, async (err, fields, files) => {
            console.log(fields)
          if (err) {
            return res.status(400).json({ message: "Error parsing the form data." });
          }
          try {
            const id  = req.user.id;
            const school = await School.findById(id);
      
            if (!school) {
              return res.status(404).json({ message: "School not found." });
            }
      
            
            // Update text fields
            Object.keys(fields).forEach((field) => {
              school[field] = fields[field][0];
            });
      
            // Handle image file if provided
            if (files.image) {
              // Delete the old image if it exists
              const oldImagePath = path.join(__dirname, '../../frontend/public/images/uploaded/school',  school.school_image);
               
              if (school.school_image && fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (unlinkErr) => {
                  if (unlinkErr) console.log("Error deleting old image:", unlinkErr);
                });
              }
      
              // Set the new image filename            
              let filepath = files.image[0].filepath;
              const originalFileName = path.basename(files.image[0].originalFilename.replace(" ", "_"));
              let newPath = path.join(__dirname, '../../frontend/public/images/uploaded/school', '/', originalFileName);
              let photoData = fs.readFileSync(filepath);
              
             fs.writeFileSync(newPath, photoData);
              school.school_image=originalFileName;
            }
            // Save the updated school document
            await school.save();
            res.status(200).json({ message: "School updated successfully", data: school });
          } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Error updating school details." });
          }
        });
      },
    signOut:async(req, res)=>{
       

        try {
            res.header("Authorization",  "");
            // "Authorization"
            res.status(200).json({success:true, messsage:"School Signed Out  Successfully."})
        } catch (error) {
            console.log("Error in Sign out", error);
            res.status(500).json({success:false, message:"Server Error in Signing Out. Try later"})
        }
    },
    isSchoolLoggedIn: async(req,  res)=>{
        try {
            let token = req.header("Authorization");
            if(token){
                var decoded = jwt.verify(token, jwtSecret);
                console.log(decoded)
                if(decoded){
                    res.status(200).json({success:true,  data:decoded, message:"School is a logged in One"})
                }else{
                    res.status(401).json({success:false, message:"You are not Authorized."})
                }
            }else{
                res.status(401).json({success:false, message:"You are not Authorized."})
            }
        } catch (error) {
            console.log("Error in isSchoolLoggedIn", error);
            res.status(500).json({success:false, message:"Server Error in School Logged in check. Try later"})
        }
    }
}