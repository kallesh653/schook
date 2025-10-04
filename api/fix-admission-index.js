const mongoose = require('mongoose');
require('dotenv').config();

async function fixAdmissionIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('studentrecords');

        // Drop the problematic admission_number unique index
        try {
            await collection.dropIndex('admission_number_1');
            console.log('✅ Dropped admission_number unique index');
        } catch (error) {
            console.log('ℹ️  Index might not exist:', error.message);
        }

        // Create a new sparse unique index for admission_number (only when not null)
        try {
            await collection.createIndex(
                { admission_number: 1 }, 
                { unique: true, sparse: true, name: 'admission_number_sparse' }
            );
            console.log('✅ Created sparse unique index for admission_number');
        } catch (error) {
            console.log('❌ Error creating sparse index:', error.message);
        }

        // List final indexes
        console.log('\n📋 Final indexes:');
        const indexes = await collection.indexes();
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}: ${JSON.stringify(index.key)} (unique: ${index.unique || false}, sparse: ${index.sparse || false})`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixAdmissionIndex();
