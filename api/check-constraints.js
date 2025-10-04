const mongoose = require('mongoose');
require('dotenv').config();

async function checkConstraints() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('studentrecords');

        // List all indexes
        console.log('\n📋 All current indexes:');
        const indexes = await collection.indexes();
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`);
            console.log(`   Key: ${JSON.stringify(index.key)}`);
            console.log(`   Unique: ${index.unique || false}`);
            console.log(`   Sparse: ${index.sparse || false}`);
            console.log('');
        });

        // Try to create a test record to see exact error
        console.log('🧪 Testing record creation...');
        const testRecord = {
            student_name: 'Debug Test Student',
            class: '12th',
            section: 'C',
            roll_number: 'DEBUG001',
            phone_number: '1234567890'
        };

        try {
            await collection.insertOne(testRecord);
            console.log('✅ Test record created successfully');
            
            // Clean up test record
            await collection.deleteOne({ student_name: 'Debug Test Student' });
            console.log('🧹 Test record cleaned up');
        } catch (error) {
            console.log('❌ Test record creation failed:');
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkConstraints();
