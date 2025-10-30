require("dotenv").config();
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const Student = require("../model/student.model");
const Attendance = require('../model/attendance.model');
module.exports = {

   
    getStudentWithQuery: async(req, res)=>{
      
        try {
            const filterQuery = {};
            const schoolId = req.user.schoolId;
            console.log(schoolId,"schoolId")
            filterQuery['school'] = schoolId;
            if(req.query.hasOwnProperty('search')){
                filterQuery['name'] = {$regex: req.query.search, $options:'i'}
            }
            
            if(req.query.hasOwnProperty('student_class')){
                filterQuery['student_class'] = req.query.student_class
            }
    
            const filteredStudents = await Student.find(filterQuery).populate("student_class").populate("course");
            res.status(200).json({success:true, data:filteredStudents})
        } catch (error) {
            console.log("Error in fetching Student with query", error);
            res.status(500).json({success:false, message:"Error  in fetching Student  with query."})
        }

    },


    registerStudent: async (req, res) => {
        const form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.log("Form parse error:", err);
                return res.status(500).json({ success: false, message: "Error parsing form data." });
            }

            // Validate required fields
            if (!fields.email || !fields.email[0]) {
                return res.status(400).json({ success: false, message: "Email is required." });
            }
            if (!fields.name || !fields.name[0]) {
                return res.status(400).json({ success: false, message: "Name is required." });
            }
            if (!fields.password || !fields.password[0]) {
                return res.status(400).json({ success: false, message: "Password is required." });
            }
            if (!req.user || !req.user.id) {
                return res.status(401).json({ success: false, message: "Authentication required. Please login again." });
            }

            Student.find({ email: fields.email[0] }).then(resp => {
                if (resp.length > 0) {
                    res.status(500).json({ success: false, message: "Email Already Exist!" })
                } else {

                    // Function to save student data
                    const saveStudentData = (imageName) => {
                        var salt = bcrypt.genSaltSync(10);
                        var hashPassword = bcrypt.hashSync(fields.password[0], salt);

                        console.log(fields,"Fields")

                        // Handle fees data
                        const feesData = {};
                        if (fields['fees[total_fees]']) {
                            feesData.total_fees = Number(fields['fees[total_fees]'][0]) || 0;
                        }
                        if (fields['fees[paid_fees]']) {
                            feesData.paid_fees = Number(fields['fees[paid_fees]'][0]) || 0;
                        }

                        // Calculate date of birth from age if not provided
                        let dateOfBirth = new Date();
                        if (fields.date_of_birth && fields.date_of_birth[0]) {
                            dateOfBirth = new Date(fields.date_of_birth[0]);
                        } else if (fields.age && fields.age[0]) {
                            const age = Number(fields.age[0]);
                            dateOfBirth.setFullYear(dateOfBirth.getFullYear() - age);
                        }

                        const studentData = {
                            email: fields.email[0],
                            name: fields.name[0],
                            student_class: fields.student_class[0],
                            guardian: fields.guardian[0],
                            guardian_phone: fields.guardian_phone[0],
                            age: Number(fields.age[0]) || 5,
                            gender: fields.gender[0],
                            date_of_birth: dateOfBirth,
                            date_of_admission: fields.date_of_admission && fields.date_of_admission[0] ? new Date(fields.date_of_admission[0]) : new Date(),
                            student_image: imageName,
                            password: hashPassword,
                            school: req.user.id
                        };

                        // Only add optional fields if they exist
                        if (fields.course && fields.course[0]) {
                            studentData.course = fields.course[0];
                        }
                        if (fields.aadhaar_number && fields.aadhaar_number[0]) {
                            studentData.aadhaar_number = fields.aadhaar_number[0];
                        }
                        if (Object.keys(feesData).length > 0) {
                            studentData.fees = feesData;
                        }
                        if (fields.transport_fees && fields.transport_fees[0] && fields.transport_fees[0] !== '') {
                            studentData.transport_fees = fields.transport_fees[0];
                        }

                        console.log("Student Data to save:", studentData);

                        const newStudent = new Student(studentData)

                        newStudent.save().then(savedData => {
                            console.log("Date saved", savedData);
                            res.status(200).json({ success: true, data: savedData, message:"Student is Registered Successfully." })
                        }).catch(e => {
                            console.log("ERRORO in Register", e)
                            console.log("Error details:", e.message)
                            res.status(500).json({ success: false, message: e.message || "Failed Registration." })
                        })
                    };

                    // Check if image is provided
                    if (files.image && files.image[0]) {
                        const photo = files.image[0];
                        let oldPath = photo.filepath;
                        let originalFileName = photo.originalFilename.replace(/\s+/g, "_")

                        let newPath = path.join(__dirname, '../../frontend/public/images/uploaded/student', '/', originalFileName)

                        let photoData = fs.readFileSync(oldPath);
                        fs.writeFile(newPath, photoData, function (err) {
                            if (err) {
                                console.log("File write error:", err);
                                return res.status(500).json({ success: false, message: "Error saving image file." });
                            }
                            saveStudentData(originalFileName);
                        })
                    } else {
                        // No image provided, use default
                        saveStudentData('default-student.png');
                    }


                }
            }).catch(err => {
                console.log("Database error:", err);
                res.status(500).json({ success: false, message: "Database error checking email." });
            })

        })



    },
    loginStudent: async (req, res) => {
        Student.find({ email: req.body.email }).then(resp => {
            if (resp.length > 0) {
                const isAuth = bcrypt.compareSync(req.body.password, resp[0].password);
                if (isAuth) {   
                    const token = jwt.sign(
                        {
                            id: resp[0]._id,
                            schoolId: resp[0].school,
                            email: resp[0].email,
                            image_url: resp[0].image_url,
                            name:resp[0].name,
                            role: 'STUDENT'
                        }, jwtSecret );

                       res.header("Authorization", token);

                   res.status(200).json({ success: true, message: "Success Login",  user: {
                    id: resp[0]._id,
                    email: resp[0].email,
                    image_url: resp[0].student_image,
                    name:resp[0].name,
                    role: 'STUDENT'} })
                }else {
                    res.status(401).json({ success: false, message: "Password doesn't match." })
                }

            } else {
                res.status(401).json({ success: false, message: "Email not registerd." })
            }
        })
    },
    getStudentWithId: async(req, res)=>{
        const id = req.params.id;
        const schoolId =  req.user.schoolId;
        Student.findOne({_id:id, school:schoolId}).populate("student_class").populate("course").then(resp=>{
            if(resp){
                console.log("data",resp)
                res.status(200).json({success:true, data:resp})
            }else {
                res.status(500).json({ success: false, message: "Student data not Available" })
            }
        }).catch(e=>{
            console.log("Error in getStudentWithId", e)
            res.status(500).json({ success: false, message: "Error in getting  Student Data" })
        })
    },
     getOwnDetails: async(req, res)=>{
        const id = req.user.id;
        const schoolId =  req.user.schoolId;
        Student.findOne({_id:id,school:schoolId}).populate("student_class").populate("course").then(resp=>{
            if(resp){
                console.log("data",resp)
                res.status(200).json({success:true, data:resp})
            }else {
                res.status(500).json({ success: false, message: "Student data not Available" })
            }
        }).catch(e=>{
            console.log("Error in getStudentWithId", e)
            res.status(500).json({ success: false, message: "Error in getting  Student Data" })
        })
    },
    // updateStudentWithId: async(req, res)=>{
       
    //     try {
    //         let id = req.params.id;
    //         const schoolId =  req.user.schoolId;
    //         console.log(req.body)
    //         await Student.findOneAndUpdate({_id:id,school:schoolId},{$set:{...req.body}});
    //         const StudentAfterUpdate =await Student.findOne({_id:id});
    //         res.status(200).json({success:true, message:"Student Updated", data:StudentAfterUpdate})
    //     } catch (error) {
            
    //         console.log("Error in updateStudentWithId", error);
    //         res.status(500).json({success:false, message:"Server Error in Update Student. Try later"})
    //     }

    // },
updateStudentWithId : async (req, res) => {
    const form =new formidable.IncomingForm({ multiples: false, uploadDir: path.join(__dirname, '../../frontend/public/images/uploaded/student'), keepExtensions: true });
  
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ message: "Error parsing the form data." });
      }
      try {
        const { id } = req.params;
        const student = await Student.findById(id);
  
        if (!student) {
          return res.status(404).json({ message: "Student not found." });
        }
  
        // Update text fields (excluding fees fields)
        Object.keys(fields).forEach((field) => {
          if (!field.startsWith('fees[')) {
            student[field] = fields[field][0];
          }
        });

        // Handle fees data separately
        if (fields['fees[total_fees]'] || fields['fees[paid_fees]']) {
          if (!student.fees) {
            student.fees = {};
          }
          if (fields['fees[total_fees]']) {
            student.fees.total_fees = Number(fields['fees[total_fees]'][0]) || 0;
          }
          if (fields['fees[paid_fees]']) {
            student.fees.paid_fees = Number(fields['fees[paid_fees]'][0]) || 0;
          }
        }
  
        // Handle image file if provided
        if (files.image) {
          // Delete the old image if it exists
          const oldImagePath = path.join(__dirname, '../../frontend/public/images/uploaded/student',  student.student_image);
           
          if (student.student_image && fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (unlinkErr) => {
              if (unlinkErr) console.log("Error deleting old image:", unlinkErr);
            });
          }
  
          // Set the new image filename
        
          let filepath = files.image[0].filepath;
          const originalFileName = path.basename(files.image[0].originalFilename.replace(" ", "_"));
          let newPath = path.join(__dirname, '../../frontend/public/images/uploaded/student', '/', originalFileName)

          let photoData = fs.readFileSync(filepath);
          
         fs.writeFileSync(newPath, photoData);
          student.student_image=originalFileName;
        }
  
        // Save the updated student document
        await student.save();
        res.status(200).json({ message: "Student updated successfully", data: student });
      } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error updating student details." });
      }
    });
  },
    deleteStudentWithId: async(req, res)=>{
        try {
            let id = req.params.id;
            const schoolId =  req.user.schoolId;
            await Attendance.deleteMany({school:schoolId,student:id})
            await Student.findOneAndDelete({_id:id, school:schoolId,});
            const studentAfterDelete =await Student.findOne({_id:id});
            res.status(200).json({success:true, message:"Student  deleted", data:studentAfterDelete})
        } catch (error) {
            console.log("Error in updateStudentWithId", error);
            res.status(500).json({success:false, message:"Server Error in deleted Student. Try later"})
        }

    },
    signOut:async(req, res)=>{
       

        try {
            res.header("Authorization",  "");
            "Authorization"
            res.status(200).json({success:true, messsage:"Student Signed Out  Successfully."})
        } catch (error) {
            console.log("Error in Sign out", error);
            res.status(500).json({success:false, message:"Server Error in Signing Out. Try later"})
        }
    },
    isStudentLoggedIn: async(req,  res)=>{
        try {
            let token = req.header("Authorization");
            if(token){
                var decoded = jwt.verify(token, jwtSecret);
                console.log(decoded)
                if(decoded){
                    res.status(200).json({success:true,  data:decoded, message:"Student is a logged in One"})
                }else{
                    res.status(401).json({success:false, message:"You are not Authorized."})
                }
            }else{
                res.status(401).json({success:false, message:"You are not Authorized."})
            }
        } catch (error) {
            console.log("Error in isStudentLoggedIn", error);
            res.status(500).json({success:false, message:"Server Error in Student Logged in check. Try later"})
        }
    }
   
}