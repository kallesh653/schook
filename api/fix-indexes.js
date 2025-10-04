const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;
        const collection = db.collection('studentrecords');

        // List current indexes
        console.log('\n📋 Current indexes:');
        const indexes = await collection.indexes();
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
        });

        // Drop problematic unique indexes
        const problematicIndexes = [
            'school_1_class_1_roll_number_1',
            'school_1_roll_number_1',
            'class_1_roll_number_1'
        ];

        for (const indexName of problematicIndexes) {
            try {
                await collection.dropIndex(indexName);
                console.log(`✅ Dropped index: ${indexName}`);
            } catch (error) {
                if (error.code === 27) {
                    console.log(`ℹ️  Index ${indexName} doesn't exist`);
                } else {
                    console.log(`❌ Error dropping ${indexName}:`, error.message);
                }
            }
        }

        // List indexes after cleanup
        console.log('\n📋 Indexes after cleanup:');
        const newIndexes = await collection.indexes();
        newIndexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, JSON.stringify(index.key));
        });

        console.log('\n✅ Index cleanup completed');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixIndexes();
