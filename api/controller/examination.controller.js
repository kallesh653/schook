const Examination = require('../model/examination.model');

module.exports = {
    newExamination: (req, res)=>{
          // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
          const schoolId = req.user.schoolId || req.user.id;
          console.log('newExamination - User:', req.user.role, 'School ID:', schoolId);
          const newExamination = new Examination({
              examDate:req.body.exam_date,
              subject:req.body.subject,
              examType:req.body.exam_type,
              class:req.body.class_id,
              school:schoolId
          })
          newExamination.save().then(resp=>{
              res.status(200).send({success:true,  message:"Exam assigned Successfully."})
          }).catch(e=>{
             console.log(e)
             res.status(500).send({success:false, message:"Failure  in exam , try later."})
           })
    
    },
    getExaminationByClass: async(req, res)=>{
        try {
            // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
            const schoolId = req.user.schoolId || req.user.id;
            console.log('getExaminationByClass - User:', req.user.role, '- School ID:', schoolId, '- Class:', req.params.classId);

            const examination = await Examination.find({class:req.params.classId,school:schoolId}).populate("subject");
            console.log(`✅ Found ${examination.length} examinations for class ${req.params.classId} in school ${schoolId}`);

            res.status(200).json({success:true, message:"Success in fetching User Applications.", data:examination})
        } catch (error) {
            console.error('❌ Error in getExaminationByClass:', error);
            res.status(500).send({success:false, message:"Failure  in fetching user applications, try later."})
        }
    },
    getAllExaminations:async(req, res)=>{
        try {
            // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
            const schoolId = req.user.schoolId || req.user.id;
            console.log('getAllExaminations - User:', req.user.role, '- School ID:', schoolId);

            const examinations = await Examination.find({school:schoolId}).populate("subject").populate("class");
            console.log(`✅ Found ${examinations.length} examinations for school ${schoolId}`);

            res.status(200).json({success:true, message:"Success in fetching User Applications.", data:examinations})
        } catch (error) {
            console.error('❌ Error in getAllExaminations:', error);
            res.status(500).send({success:false, message:"Failure  in fetching user applications, try later."})
        }
    },
    getExaminationById:async(req, res)=>{
        try {
           const examination = await Examination.findOne({_id:req.params.id});
            res.status(200).json({success:true, message:"Success in Fetching Single Examination.", data: examination})
        } catch (error) {
            res.status(500).send({success:false, message:"Failure  in Fetching Single Examination, try later."})
        }
    },
    deleteExaminationById:async(req, res)=>{
        try {
             await Examination.findOneAndDelete({_id:req.params.id});
            res.status(200).json({success:true, message:"Success in Deleting Examination."})
        } catch (error) {
            res.status(500).send({success:false, message:"Failure  in Deleting Examination, try later."})
        }
    },
    updateExaminaitonWithId: async(req, res)=>{
        try {
            let id = req.params.id;
            console.log(req.body,id)
            await Examination.findOneAndUpdate({_id:id},{$set:{examDate:req.body.exam_date, subject:req.body.subject, examType:req.body.exam_type}});
            // const examinationAfterUpdate =await School.findOne({_id:id});
            res.status(200).json({success:true, message:"Examination Updated."})
        } catch (error) {
            
            console.log("Error in updateSchoolWithId", error);
            res.status(500).json({success:false, message:"Server Error in Update School. Try later"})
        }

    },
}