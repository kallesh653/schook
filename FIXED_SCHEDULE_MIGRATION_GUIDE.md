# Fixed Schedule System - Migration Guide

## What Changed?

The period/schedule system has been completely redesigned to use **FIXED schedules** instead of date-based periods.

### Old System (Problems):
- ❌ Periods were stored with full dates (startTime: 2024-01-15 07:00:00)
- ❌ Had to create same period every day manually
- ❌ Changes every day - not fixed
- ❌ No easy way to see weekly pattern

### New System (Fixed):
- ✅ Periods stored with day of week (Monday, Tuesday, etc.)
- ✅ Set up ONCE and stays forever
- ✅ Easy to edit anytime
- ✅ Can see which teacher is free
- ✅ Shows today's schedule clearly

## Database Schema Changes

### Before:
```javascript
{
  teacher: ObjectId,
  subject: ObjectId,
  class: ObjectId,
  startTime: Date,  // Full datetime: "2024-01-15T07:00:00Z"
  endTime: Date     // Full datetime: "2024-01-15T08:00:00Z"
}
```

### After:
```javascript
{
  teacher: ObjectId,
  subject: ObjectId,
  class: ObjectId,
  dayOfWeek: Number,    // 0=Sunday, 1=Monday, ..., 6=Saturday
  periodNumber: Number, // 1-12 (Period 6 = Lunch)
  startTime: String,    // Just time: "07:00"
  endTime: String       // Just time: "08:00"
}
```

## New Features

### 1. Fixed Weekly Schedule
- Set up your entire week's schedule once
- Click any cell in the table to add/edit a period
- Changes are permanent until you edit them
- File: `frontend/src/school/components/periods/FixedSchedule.jsx`

### 2. Today's Schedule View
- See all classes happening TODAY
- Shows which teacher is teaching which class
- Shows which teachers are FREE in each period
- Shows teachers not teaching today
- File: `frontend/src/school/components/periods/TodaySchedule.jsx`

### 3. Edit Functionality
- Click on any assigned period to edit
- Change teacher or subject anytime
- Delete periods if needed
- Shows which teachers are available for that slot

## New API Endpoints

```javascript
// Create fixed period
POST /period/create
Body: {
  teacher: "teacherId",
  subject: "subjectId",
  classId: "classId",
  dayOfWeek: 1,        // Monday
  periodNumber: 3,     // Period 3
  startTime: "09:00",
  endTime: "10:00"
}

// Update period (change teacher/subject)
PUT /period/update/:id
Body: {
  teacher: "newTeacherId",
  subject: "newSubjectId"
}

// Get today's schedule
GET /period/schedule/today

// Get weekly schedule for a class
GET /period/schedule/week/:classId

// Get schedule for specific day and class
GET /period/schedule/day/:dayOfWeek/class/:classId

// Get free teachers for a time slot
GET /period/free-teachers/:dayOfWeek/:periodNumber
```

## Migration Steps

### Step 1: Backup Your Data
```bash
# Backup your MongoDB database
mongodump --db your_database_name --out backup_before_migration
```

### Step 2: Clear Old Period Data (OPTIONAL)
If you want to start fresh:
```javascript
// In MongoDB shell or Compass
db.periods.deleteMany({})
```

### Step 3: Restart API Server
The new schema will automatically be applied when you restart:
```bash
cd api
npm start
```

### Step 4: Set Up Fixed Schedules
1. Go to the Schedule page in your school admin panel
2. Select "Fixed Weekly Schedule" tab
3. For each class:
   - Select the class
   - Click on each time slot
   - Assign teacher and subject
   - Save

### Step 5: Verify
1. Check "Today's Schedule" tab
2. Verify all periods are showing correctly
3. Check that free teachers are displayed

## Usage Guide

### Setting Up a Fixed Schedule

1. **Navigate to Schedule Page**
   - Go to School Dashboard → Periods/Schedule

2. **Select Fixed Weekly Schedule Tab**
   - You'll see a table with Days (columns) and Periods (rows)

3. **Click Any Cell to Add a Period**
   - Select Teacher (free teachers shown)
   - Select Subject
   - Click "Assign Period"

4. **Edit Existing Periods**
   - Click on any assigned cell
   - Change teacher or subject
   - Or delete the period

### Viewing Today's Schedule

1. **Navigate to Today's Schedule Tab**
   - Shows current day's schedule automatically

2. **See Which Classes Are Running**
   - Organized by period number
   - Shows Class → Subject → Teacher

3. **See Free Teachers**
   - Below each period, see which teachers are free
   - Helpful for substitutions

4. **Check Teachers Not Teaching**
   - Right side panel shows summary
   - Lists teachers with no classes today

## Day of Week Reference

```
0 = Sunday
1 = Monday
2 = Tuesday
3 = Wednesday
4 = Thursday
5 = Friday
6 = Saturday
```

## Period Numbers

```
Period 1:  07:00 - 08:00
Period 2:  08:00 - 09:00
Period 3:  09:00 - 10:00
Period 4:  10:00 - 11:00
Period 5:  11:00 - 12:00
Period 6:  12:00 - 13:00 (Lunch)
Period 7:  13:00 - 14:00
Period 8:  14:00 - 15:00
Period 9:  15:00 - 16:00
Period 10: 16:00 - 17:00
Period 11: 17:00 - 18:00
Period 12: 18:00 - 19:00
```

You can customize these times in the frontend files.

## Troubleshooting

### Issue: Cannot create period - "class already has a period assigned"
**Solution**: You're trying to assign multiple periods to the same class in the same time slot. Edit or delete the existing period first.

### Issue: Free teachers not showing
**Solution**: Make sure all teachers are properly registered in the system and associated with your school.

### Issue: Today's schedule is empty
**Solution**: Check that:
1. You've set up periods for today's day of week
2. The `dayOfWeek` matches (0-6)
3. Your server time zone is correct

## Benefits of This System

1. ✅ **Set Once, Use Forever**: No need to recreate schedules
2. ✅ **Easy Editing**: Change teacher assignments anytime
3. ✅ **Teacher Availability**: See who's free instantly
4. ✅ **Better Planning**: Visual weekly view
5. ✅ **Today's View**: Know what's happening right now
6. ✅ **No Date Confusion**: Works week after week automatically

## Files Modified

### Backend:
- `api/model/period.model.js` - Updated schema
- `api/controller/period.controller.js` - New controller functions
- `api/router/period.router.js` - New routes

### Frontend:
- `frontend/src/school/components/periods/Schedule.jsx` - Main component with tabs
- `frontend/src/school/components/periods/FixedSchedule.jsx` - Weekly schedule grid (NEW)
- `frontend/src/school/components/periods/AssignFixedPeriod.jsx` - Form to assign periods (NEW)
- `frontend/src/school/components/periods/TodaySchedule.jsx` - Today's view (NEW)

## Questions?

If you encounter any issues, check:
1. MongoDB indexes are created properly
2. API server restarted after schema changes
3. Frontend rebuilt if using production build
4. Browser cache cleared

---

**This is a major improvement that makes schedule management much easier!** 🎉
