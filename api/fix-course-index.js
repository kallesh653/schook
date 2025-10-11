const mongoose = require('mongoose');
require('dotenv').config();

async function fixCourseIndex() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get the courses collection
        const db = mongoose.connection.db;
        const coursesCollection = db.collection('courses');

        // Drop all problematic indexes
        try {
            await coursesCollection.dropIndex('school_1_course_code_1');
            console.log('✅ Dropped old index: school_1_course_code_1');
        } catch (error) {
            console.log('Index school_1_course_code_1:', error.message);
        }

        try {
            await coursesCollection.dropIndex('courseCode_1_school_1');
            console.log('✅ Dropped old index: courseCode_1_school_1');
        } catch (error) {
            console.log('Index courseCode_1_school_1:', error.message);
        }

        // Just use sparse index - it will ignore documents where courseCode is null/undefined
        await coursesCollection.createIndex(
            { courseCode: 1, school: 1 },
            {
                unique: true,
                sparse: true,
                name: 'courseCode_school_sparse_unique'
            }
        );
        console.log('✅ Created new sparse unique index');

        // List all indexes
        const indexes = await coursesCollection.indexes();
        console.log('\n📋 Current indexes on courses collection:');
        indexes.forEach(idx => {
            console.log(`  - ${idx.name}:`, idx.key);
        });

        console.log('\n✨ Index fix completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing index:', error);
        process.exit(1);
    }
}

fixCourseIndex();
