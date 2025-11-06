const Period = require('../model/period.model');

// Controller to create a FIXED period (set once, stays forever)
exports.createPeriod = async (req, res) => {
  try {
    const { teacher, subject, classId, dayOfWeek, periodNumber, startTime, endTime } = req.body;
    // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;

    // Validate inputs
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return res.status(400).json({ message: 'Invalid day of week. Must be 0-6 (0=Sunday, 1=Monday, etc.)' });
    }

    if (periodNumber < 1 || periodNumber > 12) {
      return res.status(400).json({ message: 'Invalid period number. Must be 1-12' });
    }

    // Check if this class already has a period assigned for this day/period slot
    const existingPeriod = await Period.findOne({
      school: schoolId,
      class: classId,
      dayOfWeek,
      periodNumber
    });

    if (existingPeriod) {
      return res.status(400).json({
        message: 'This class already has a period assigned for this time slot. Please edit or delete the existing period first.'
      });
    }

    const newPeriod = new Period({
       teacher,
       subject,
       class: classId,
       dayOfWeek,
       periodNumber,
       startTime, // Just time string like "07:00"
       endTime,   // Just time string like "08:00"
       school: schoolId
      });

    await newPeriod.save();
    res.status(201).json({ message: 'Fixed period assigned successfully', period: newPeriod });
  } catch (error) {
    res.status(500).json({ message: 'Error creating period', error: error.message });
    console.log("Error", error)
  }
};

// Controller to get periods for a specific teacher
exports.getTeacherPeriods = async (req, res) => {
  try {
    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;
    const { teacherId } = req.params;
    const periods = await Period.find({ teacher: teacherId,school:schoolId }).populate('class').populate('subject');
    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching periods', error });
  }
};

exports.getPeriodsWithId = async (req, res) => {
    try {
      const { id } = req.params;
      const period = await Period.findById(id).populate('class').populate('subject').populate('teacher');
      res.status(200).json({ period });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods by id', error });
    }
  };

// Controller to get periods for a specific CLASS
exports.getClassPeriods = async (req, res) => {

    try {
      const { classId } = req.params;
      // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
      const schoolId = req.user.schoolId || req.user.id;
      const periods = await Period.find({class:classId,school:schoolId}).populate('subject').populate('teacher');
      console.log(classId)
      res.status(200).json({ periods });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods', error });
    }
  };

  // all periods
exports.getPeriods = async (req, res) => {
    try {
      // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
      const schoolId = req.user.schoolId || req.user.id;
      const periods = await Period.find({school:schoolId}).populate('class').populate('subject').populate("teacher")
      res.status(200).json({ periods });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching periods', error });
    }
  };


// Update period (can change teacher, subject, or time)
exports.updatePeriod = async (req, res) => {
  try {
    const { teacher, subject, startTime, endTime } = req.body;
    const periodId = req.params.id;

    const updateData = {};
    if (teacher) updateData.teacher = teacher;
    if (subject) updateData.subject = subject;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;

    const updatedPeriod = await Period.findOneAndUpdate(
      {_id: periodId, school: req.user.schoolId},
      updateData,
      { new: true }
    ).populate('teacher').populate('subject').populate('class');

    if (!updatedPeriod) {
      return res.status(404).json({ message: 'Period not found' });
    }

    res.status(200).json({ message: 'Period updated successfully', period: updatedPeriod });
  } catch (error) {
    res.status(500).json({ message: 'Error updating period', error: error.message });
  }
};

// Delete period
exports.deletePeriod = async (req, res) => {
  try {
    const periodId = req.params.id;
    await Period.findByIdAndDelete(periodId);
    res.status(200).json({ message: 'Period deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting period', error });
  }
};

// Get schedule by day of week and class
exports.getScheduleByDay = async (req, res) => {
  try {
    const { dayOfWeek, classId } = req.params;
    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;

    const periods = await Period.find({
      school: schoolId,
      class: classId,
      dayOfWeek: parseInt(dayOfWeek)
    })
    .populate('teacher')
    .populate('subject')
    .populate('class')
    .sort({ periodNumber: 1 });

    res.status(200).json({ periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Get all schedules for a class (entire week)
exports.getWeeklyScheduleByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;

    const periods = await Period.find({
      school: schoolId,
      class: classId
    })
    .populate('teacher')
    .populate('subject')
    .populate('class')
    .sort({ dayOfWeek: 1, periodNumber: 1 });

    // Group by day of week
    const schedule = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    periods.forEach(period => {
      schedule[period.dayOfWeek].push(period);
    });

    res.status(200).json({ schedule });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly schedule', error: error.message });
  }
};

// Get free teachers for a specific day and period
exports.getFreeTeachers = async (req, res) => {
  try {
    const { dayOfWeek, periodNumber } = req.params;
    // Use schoolId for ADMIN/SUPER_ADMIN, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;

    // Get all teachers
    const Teacher = require('../model/teacher.model');
    const allTeachers = await Teacher.find({ school: schoolId });

    // Get teachers who are teaching in this period
    const busyPeriods = await Period.find({
      school: schoolId,
      dayOfWeek: parseInt(dayOfWeek),
      periodNumber: parseInt(periodNumber)
    }).populate('teacher');

    const busyTeacherIds = busyPeriods.map(p => p.teacher._id.toString());

    // Filter out busy teachers
    const freeTeachers = allTeachers.filter(teacher =>
      !busyTeacherIds.includes(teacher._id.toString())
    );

    res.status(200).json({ freeTeachers, busyTeachers: busyPeriods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching free teachers', error: error.message });
  }
};

// Get current day's schedule for all classes
exports.getTodaySchedule = async (req, res) => {
  try {
    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;
    const today = new Date().getDay(); // 0=Sunday, 1=Monday, etc.

    const periods = await Period.find({
      school: schoolId,
      dayOfWeek: today
    })
    .populate('teacher')
    .populate('subject')
    .populate('class')
    .sort({ class: 1, periodNumber: 1 });

    res.status(200).json({ dayOfWeek: today, periods });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching today\'s schedule', error: error.message });
  }
};

// Get classes that a teacher teaches (based on schedule) - for attendance
exports.getTeacherClassesFromSchedule = async (req, res) => {
  try {
    // For TEACHER role, use their own ID. For SUPER_ADMIN/ADMIN, get teacherId from query params
    const teacherId = req.user.role === 'TEACHER' ? req.user.id : req.query.teacherId;

    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;
    console.log('getTeacherClassesFromSchedule - Role:', req.user.role, '- Teacher:', teacherId, '- School:', schoolId);

    // If no teacherId provided and not a TEACHER, return empty array
    if (!teacherId) {
      console.log('⚠️ No teacherId provided for non-TEACHER role');
      return res.status(200).json([]);
    }

    // Find all unique classes where this teacher has periods assigned
    const periods = await Period.find({
      school: schoolId,
      teacher: teacherId
    })
    .populate('class', 'class_text class_num')
    .select('class');

    console.log(`✅ Found ${periods.length} period(s) for teacher ${teacherId}`);

    // Get unique classes
    const uniqueClasses = [];
    const classIds = new Set();

    periods.forEach(period => {
      if (period.class && !classIds.has(period.class._id.toString())) {
        classIds.add(period.class._id.toString());
        uniqueClasses.push({
          classId: period.class._id,
          class_text: period.class.class_text,
          class_num: period.class.class_num
        });
      }
    });

    console.log(`✅ Returning ${uniqueClasses.length} unique class(es)`);
    res.status(200).json(uniqueClasses);
  } catch (error) {
    console.error('❌ Error in getTeacherClassesFromSchedule:', error);
    res.status(500).json({
      message: 'Error fetching teacher classes from schedule',
      error: error.message
    });
  }
};

// Check if teacher is assigned to teach a class (based on schedule)
exports.canTeacherTakeAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const teacherId = req.user.id;
    // Use schoolId for ADMIN/SUPER_ADMIN/TEACHER, or id for SCHOOL role
    const schoolId = req.user.schoolId || req.user.id;

    // Check if teacher has any period assigned for this class
    const period = await Period.findOne({
      school: schoolId,
      teacher: teacherId,
      class: classId
    });

    if (period) {
      res.status(200).json({
        canTakeAttendance: true,
        message: 'Teacher is authorized to take attendance for this class'
      });
    } else {
      res.status(200).json({
        canTakeAttendance: false,
        message: 'Teacher is not assigned to teach this class'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error checking teacher authorization',
      error: error.message
    });
  }
};

// Get teacher's own periods (for TEACHER role to fetch their own schedule)
exports.getTeacherOwnPeriods = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const schoolId = req.user.schoolId || req.user.id;

    console.log(`getTeacherOwnPeriods - Teacher: ${teacherId}, School: ${schoolId}`);

    const periods = await Period.find({
      teacher: teacherId,
      school: schoolId
    })
    .populate('class', 'class_text class_num')
    .populate('subject', 'subject_name subject_code')
    .sort({ dayOfWeek: 1, periodNumber: 1 });

    console.log(`✅ Found ${periods.length} period(s) for teacher ${teacherId}`);

    res.status(200).json({
      success: true,
      data: periods
    });
  } catch (error) {
    console.error('❌ Error in getTeacherOwnPeriods:', error);
    res.status(500).json({
      message: 'Error fetching teacher periods',
      error: error.message
    });
  }
};
